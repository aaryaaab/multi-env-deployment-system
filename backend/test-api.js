const axios = require('axios');

async function testAPI() {
  const baseURL = 'http://localhost/api';
  const testUser = {
    name: 'API Test User',
    email: `apitest${Date.now()}@example.com`,
    password: 'password123'
  };

  try {
    console.log('--- TESTING REGISTRATION ---');
    const regRes = await axios.post(`${baseURL}/auth/register`, testUser);
    console.log('Registration Success:', regRes.data.email);
    console.log('JWT Token Received:', !!regRes.data.token);

    console.log('\n--- TESTING LOGIN ---');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login Success:', loginRes.data.email);
    console.log('JWT Token Received:', !!loginRes.data.token);
    const token = loginRes.data.token;

    console.log('\n--- TESTING PROTECTED ROUTE (GET ME) ---');
    const meRes = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Protected Route Success. User ID:', meRes.data._id);

    console.log('\nAll API tests passed successfully!');
  } catch (error) {
    console.error('\nAPI Test Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testAPI();
