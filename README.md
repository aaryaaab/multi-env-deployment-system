# Multi-Environment Deployment System (Task Manager Pro)

An industry-level DevOps and Full-Stack project featuring a MERN application orchestrated with Docker Compose, monitored with Prometheus and Grafana, and deployed via a robust GitHub Actions CI/CD pipeline.

## 🏗️ Architecture

- **Frontend:** React + Vite, Tailwind CSS v4, Lucide Icons.
- **Backend:** Node.js + Express.js, MongoDB (Mongoose).
- **Monitoring:** Prometheus (Metrics Collection) & Grafana (Dashboards).
- **Orchestration:** Docker Compose (Local microservices setup).
- **Reverse Proxy:** Nginx (Serving frontend and proxying API).
- **CI/CD:** GitHub Actions (Lint, Test, Docker Build, Health Verification).

## 🚀 Step 1: Running the Full Stack Locally

This project uses Docker Compose to orchestrate 5 containers: Frontend (Nginx), Backend (Node), MongoDB, Prometheus, and Grafana.

1. Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. In the root of the project, run:
   ```bash
   docker-compose up --build
   ```
3. The services will be available at:
   - **Frontend App:** [http://localhost](http://localhost) (Served by Nginx)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)
   - **Prometheus UI:** [http://localhost:9090](http://localhost:9090)
   - **Grafana Dashboards:** [http://localhost:3000](http://localhost:3000)

## 📊 Step 2: Accessing Grafana Metrics

1. Open [http://localhost:3000](http://localhost:3000)
2. Log in with:
   - **Username:** `admin`
   - **Password:** `admin`
3. Go to **Dashboards** (on the left menu) > **Task Manager Node.js Metrics**.
4. You will see real-time graphs for:
   - Total API Requests
   - Memory Usage
   - CPU Usage
   - API Requests per Route

*Note: The backend has a custom `prom-client` middleware that increments the `http_requests_total` metric on every incoming request!*

## ☁️ Step 3: Production Deployment (Free Tier)

For actual internet-facing production, you can break the microservices out into free-tier cloud platforms:
1. **Frontend:** Deploy the `frontend` folder to Vercel.
2. **Backend:** Deploy the `backend` folder to Render.com. Set the start command to `npm start`.
3. **Database:** Use MongoDB Atlas.

Set your Vercel `VITE_API_URL` environment variable to your Render URL.

## 🔄 Step 4: GitHub Actions (CI/CD)

The pipeline (`.github/workflows/ci-cd.yml`) executes on pushes to `main`:
1. **Lint Job:** Checks frontend React code for ESLint errors.
2. **Test Job:** Runs backend Jest tests.
3. **Build Job:** Builds both Frontend (Nginx) and Backend Docker images. It then launches the backend container in isolated mode and queries the `/health` endpoint to verify successful startup before completing the pipeline.
