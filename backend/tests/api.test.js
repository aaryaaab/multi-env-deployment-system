const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

// Ensure correct test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret123';

const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Close any existing mongoose connection and connect to memory server
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Disconnect and stop memory server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collections before each test to ensure isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Full-Stack Task Manager Backend API Tests', () => {
  
  describe('GET /health', () => {
    it('should return status ok and 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /metrics (Prometheus Endpoint)', () => {
    it('should return 200 OK and valid prometheus formatted metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('process_cpu_user_seconds_total');
      expect(res.text).toContain('http_requests_total');
    });
  });

  describe('User Authentication API', () => {
    const testUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123'
    };

    it('should successfully register a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should fail registration if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: testUser.email });

      expect(res.statusCode).toBe(400);
    });

    it('should log in an existing user and return a token', async () => {
      // Pre-register user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Attempt login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should fail login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should access protected /me endpoint with valid token', async () => {
      // Register
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      const token = regRes.body.token;

      // Access /me
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.name).toBe(testUser.name);
    });
  });

  describe('Task Manager CRUD API', () => {
    let token;
    let userId;
    
    beforeEach(async () => {
      // Register a user to get a valid token
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Task Owner',
          email: 'owner@example.com',
          password: 'password123'
        });
      token = regRes.body.token;
      userId = regRes.body._id;
    });

    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Learn Docker Orchestration',
        description: 'Deploy 5 containers with docker-compose'
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(taskData.title);
      expect(res.body.description).toBe(taskData.description);
      expect(res.body.user).toBe(userId);
    });

    it('should retrieve task board list', async () => {
      // Add tasks to in-memory db
      await Task.create({
        title: 'Task A',
        description: 'First task',
        user: userId
      });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Task A');
    });

    it('should update an existing task', async () => {
      const task = await Task.create({
        title: 'Original Title',
        description: 'Original description',
        user: userId
      });

      const res = await request(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title',
          status: 'In Progress'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.status).toBe('In Progress');
    });

    it('should delete a task successfully', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        description: 'Will be deleted',
        user: userId
      });

      const res = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', task._id.toString());

      // Confirm deleted
      const checkTask = await Task.findById(task._id);
      expect(checkTask).toBeNull();
    });
  });

  describe('Error Handling Middleware', () => {
    it('should return 401 Unauthorized for route requests without token', async () => {
      const res = await request(app)
        .get('/api/tasks');
      
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 Unauthorized for route requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalidtoken123');
      
      expect(res.statusCode).toBe(401);
    });

    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /api/devops/metrics (Live Telemetry Endpoint)', () => {
    it('should return live process CPU and memory metrics', async () => {
      // Register a user to get a valid token
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Telemetry Inspector',
          email: 'inspector@example.com',
          password: 'password123'
        });
      const token = regRes.body.token;

      // Get DevOps telemetry
      const res = await request(app)
        .get('/api/devops/metrics')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'Operational');
      expect(res.body).toHaveProperty('cpuUsage');
      expect(res.body).toHaveProperty('memoryUsage');
      expect(res.body).toHaveProperty('totalRequests');
      expect(res.body).toHaveProperty('routeMetrics');
    });
  });
});
