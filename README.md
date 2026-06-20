# Multi-Environment Deployment System (Task Manager Pro)

An enterprise-grade Full-Stack Task Management application designed for high-availability deployment, container orchestration, and real-time monitoring. The project features a containerized architecture managed with Docker Compose, telemetry instrumentation, and a robust CI/CD workflow.

---

## 🏗️ Tech Stack

* **Frontend:** React + Vite, Tailwind CSS v4, Lucide Icons
* **Backend:** Node.js + Express.js, Mongoose (MongoDB ORM)
* **Monitoring:** Prometheus (Telemetry scraper) & Grafana (Visual dashboards)
* **Reverse Proxy:** Nginx (Static hosting and API request forwarding)
* **Orchestration:** Docker Compose
* **CI/CD:** GitHub Actions (ESLint validation, backend integration testing, container orchestration and health verification)

---

## 📦 Docker Container Architecture

The system orchestrates **5 Docker containers** working in an isolated network:

1. **`frontend` (React + Nginx):** Hosts static React assets and acts as a reverse proxy, forwarding API requests starting with `/api` to the backend.
2. **`backend` (Node.js + Express.js):** The core application logic. Connects to MongoDB, serves REST APIs, registers application metrics, and computes real-time telemetry.
3. **`mongodb` (Mongo Database):** The persistence layer. Stores user credentials and task states.
4. **`prometheus` (Prometheus Server):** Automatically scrapes application and system metrics from the backend's `/metrics` endpoint.
5. **`grafana` (Grafana Server):** Visualizes the metrics scraped by Prometheus using a pre-configured node dashboard.

---

## ⚙️ Environment Variables

### Backend (`/backend/.env.development` & `/backend/.env.production`)
* `NODE_ENV`: The runtime environment (`development` | `production` | `test`).
* `PORT`: The port the backend listens on (default: `5000`).
* `MONGO_URI`: The MongoDB connection string (e.g. `mongodb://mongodb:27017/taskmanager` for local docker setups).
* `JWT_SECRET`: Secret key used for signing JWT authentication tokens.

### Frontend (`/frontend/.env.development` & `/frontend/.env.production`)
* `VITE_API_URL`: The backend endpoint root. Set to `http://localhost:5000/api` in development, and to `/api` in production (which routes calls through the Nginx reverse proxy).

---

## 🚀 Getting Started

### Prerequisites
* [Node.js v18+](https://nodejs.org/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

### Local Setup (Development Mode)

#### 1. Start the Database
Run a local MongoDB instance, or use the database from the docker-compose stack.

#### 2. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend server runs at `http://localhost:5000`.

#### 3. Run the Frontend Server
```bash
cd ../frontend
npm install
npm run dev
```
The React development server runs at `http://localhost:5173`.

---

### Docker Compose Setup (Orchestrated Stack)

To build and start the entire 5-container architecture:
```bash
docker compose up -d --build
```

#### Exposed Interfaces:
* **Frontend Web App (Nginx Proxy):** [http://localhost](http://localhost) (port 80)
* **Backend API server:** [http://localhost:5000](http://localhost:5000)
* **Prometheus Dashboard:** [http://localhost:9090](http://localhost:9090)
* **Grafana Dashboards:** [http://localhost:3000](http://localhost:3000) (Default Login: `admin` / `admin`)

---

## 📊 Live Metrics & Telemetry

### Application Dashboard
The React app displays a live **DevOps Metrics** panel presenting:
* **API Health:** Current server status (`Operational` or `Offline`).
* **Memory Usage:** Live RSS memory consumption of the backend process.
* **Node CPU Consumption:** CPU consumption percentage of the backend process.
* **Total API Requests:** Live request counter queried directly from `prom-client` registers.

### Centralized Monitoring Stack
* **Scraping Endpoint:** The backend exposes `/metrics` displaying Prometheus-formatted registry metrics (including HTTP requests and process details).
* **Grafana Integration:** Grafana pulls metric data from Prometheus and loads a pre-configured dashboard named **Task Manager Node.js Metrics** showing graphs for request rate, CPU usage, and route-level hits.

---

## 🔄 GitHub Actions CI/CD Pipeline

The workflow defined in `.github/workflows/ci-cd.yml` automatically validates code on every push and pull request:
1. **ESLint Job:** Verifies frontend compliance using ESLint.
2. **Test Job:** Runs Jest integration tests against an in-memory MongoDB server using `mongodb-memory-server` and `supertest` to confirm Express logic.
3. **Build & Verify Job:**
   * Automatically runs `docker compose up -d --build` to build images and launch the stack.
   * Runs an automated `/health` endpoint check using `curl` against the container to ensure successful startup.
   * Shuts down the stack gracefully with `docker compose down`.
