# ThreadCo — Clothing Store (DevOps Portfolio Project)

A full-stack clothing e-commerce app built to demonstrate a complete DevOps pipeline.
The application is intentionally simple; the focus is on the infrastructure.

---

## Architecture Diagram

```mermaid
graph TD
    Dev[Developer] -->|git push| GH[GitHub]

    subgraph CI/CD ["GitHub Actions (CI/CD Pipeline)"]
        GH --> Test[1. Run Jest Tests]
        Test --> Build[2. Build Docker Images]
        Build --> Push[3. Push to Docker Hub]
        Push --> Deploy[4. Deploy to Kubernetes]
    end

    subgraph Docker Hub
        Push --> FE_IMG[clothing-frontend:sha]
        Push --> BE_IMG[clothing-backend:sha]
    end

    subgraph AWS EKS ["AWS EKS Cluster (provisioned by Terraform)"]
        Deploy --> NS[Namespace: clothing-store]
        NS --> ING[Nginx Ingress]
        ING --> FE[Frontend Pod x2\nReact + Nginx]
        ING --> BE[Backend Pod x2\nNode.js + Express]
        BE --> METRICS[/metrics endpoint]
    end

    subgraph Monitoring
        PROM[Prometheus] -->|scrapes every 15s| METRICS
        GRAF[Grafana] -->|queries| PROM
    end

    User[Browser] --> ING
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Tests | Jest + Supertest |
| Containers | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Orchestration | Kubernetes (EKS) |
| Infrastructure | Terraform |
| Monitoring | Prometheus + Grafana |

---

## Local Setup (Quickstart)

### Prerequisites
- Docker Desktop
- Node.js 20+

### Option A — Docker Compose (recommended)

```bash
# 1. Clone the repo
git clone https://github.com/your-username/devops-clothing-store.git
cd devops-clothing-store

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up --build

# Services:
#   Frontend  → http://localhost:3000
#   Backend   → http://localhost:5000
#   Prometheus → http://localhost:9090
#   Grafana   → http://localhost:3001  (admin/admin)
```

### Option B — Run locally without Docker

```bash
# Backend
cd backend
npm install
npm run dev        # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # runs on http://localhost:3000
```

### Run Tests

```bash
cd backend
npm test
```

---

## DevOps Pipeline Explained

### 1. Docker — Containerization
Every service is packaged into a Docker image so it runs identically everywhere.

- `backend/Dockerfile` — multi-stage build: installs deps then runs as non-root user
- `frontend/Dockerfile` — builds Vite bundle then serves with Nginx
- `docker-compose.yml` — wires all four containers (app + monitoring) together locally

**Why it matters:** "It works on my machine" disappears. Any environment that has Docker can run this.

---

### 2. GitHub Actions — CI/CD Pipeline
`.github/workflows/ci-cd.yml` runs three jobs in sequence on every push to `main`:

```
Push to main
    │
    ▼
[Job 1] test      — npm ci && npm test (Jest)
    │ (fails here = stops the pipeline)
    ▼
[Job 2] build     — docker build + push to Docker Hub (tagged with git SHA)
    │
    ▼
[Job 3] deploy    — kubectl apply manifests to EKS cluster
```

**Why it matters:** Broken code never reaches production. Every deploy is traceable to a specific commit via the image tag.

---

### 3. Kubernetes — Container Orchestration
Manifests in `k8s/` describe the desired state of the cluster:

| File | What it does |
|------|-------------|
| `namespace.yaml` | Logical isolation for all app resources |
| `*-deployment.yaml` | Runs 2 replicas of each service, with health probes |
| `*-service.yaml` | Internal DNS-based discovery between pods |
| `ingress.yaml` | Routes `/api/*` → backend, `/` → frontend via Nginx |

**Why it matters:** Kubernetes auto-restarts crashed pods, scales replicas, and does rolling deploys with zero downtime.

---

### 4. Terraform — Infrastructure as Code
`terraform/` provisions the AWS EKS cluster declaratively:

```bash
cd terraform
terraform init
terraform plan    # preview changes
terraform apply   # create VPC + EKS cluster (~15 min)

# After cluster is ready:
$(terraform output -raw configure_kubectl)
```

**Why it matters:** The entire cloud infrastructure is version-controlled. Destroy and recreate in one command. No clicking in the AWS console.

---

### 5. Prometheus + Grafana — Monitoring
The backend exposes a `/metrics` endpoint (via `prom-client`) with:
- `http_requests_total` — request count by route/method/status
- `http_request_duration_seconds` — response time histogram
- Default Node.js metrics (CPU, memory, event loop)

Prometheus scrapes this every 15 seconds. Grafana visualises it.

**Grafana Dashboard panels:**
- Total request count
- Request rate (req/s) over time
- p95 response latency
- Node.js memory usage
- HTTP error count (4xx/5xx)

---

## Deployment Steps (Production)

### Step 1 — Provision infrastructure
```bash
cd terraform
terraform init && terraform apply
```

### Step 2 — Add GitHub Secrets
In your repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `AWS_ACCESS_KEY_ID` | AWS IAM key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret |

### Step 3 — Push to main
```bash
git add .
git commit -m "feat: initial deployment"
git push origin main
```

GitHub Actions takes over: tests → builds images → deploys to EKS.

### Step 4 — Access the app
```bash
kubectl get ingress -n clothing-store
# Use the EXTERNAL-IP shown to access the app
```

---

## Project Structure

```
devops-clothing-store/
├── frontend/               # React + Vite app
│   ├── src/components/     # Header, ProductCard, ProductGrid, Cart
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # Express REST API
│   ├── src/
│   │   ├── routes/         # products.js, metrics.js
│   │   └── data/           # products.js (seed data)
│   ├── tests/              # Jest + Supertest
│   └── Dockerfile
├── k8s/                    # Kubernetes manifests
├── terraform/              # AWS EKS infrastructure
├── monitoring/             # Prometheus config + Grafana dashboard
├── .github/workflows/      # GitHub Actions CI/CD
├── docker-compose.yml
└── .env.example
```
