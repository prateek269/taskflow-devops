# TaskFlow – DevOps Project

TaskFlow is a full-stack task management application built and deployed using modern DevOps practices.

The project demonstrates Docker containerization, CI/CD automation, Kubernetes deployment, PostgreSQL persistence, Kubernetes Secrets, Gunicorn, Nginx, GitHub Container Registry, and automated deployment using a self-hosted GitHub Actions runner.

---

## Architecture

```text
Developer
    |
    v
  GitHub
    |
    v
GitHub Actions
    |
    +---- Backend Validation
    |
    +---- Frontend Build
    |
    +---- Docker Build
    |
    v
    GHCR
    |
    v
Self-Hosted Runner
    |
    v
Kubernetes
    |
    +---- Frontend (React + Nginx)
    |
    +---- Backend (Flask + Gunicorn)
    |
    +---- PostgreSQL
              |
              v
        Persistent Storage
```

## Technologies Used
- Linux / WSL
- Git & GitHub
- GitHub Actions
- Docker
- GitHub Container Registry (GHCR)
- Kubernetes
- PostgreSQL
- Flask
- Gunicorn
- React
- Nginx
- YAML

## Project Structure
```text
taskflow/
│
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── k8s/
│   ├── postgres-deployment.yml
│   ├── postgres-service.yml
│   ├── postgres-pvc.yml
│   ├── postgres-secret.yml
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   └── frontend-service.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

## Application Components

### Frontend

The frontend is developed using React.

For production deployment, the React application is built using Node.js and served using Nginx.

### Backend

The backend is developed using Flask and provides REST APIs for task management.

Gunicorn is used as the production WSGI server.

### Database

PostgreSQL is used as the application database.

Kubernetes PersistentVolumeClaim (PVC) is used for persistent database storage.

## API Endpoints

```text
GET     /
GET     /health
GET     /tasks
POST    /tasks
PUT     /tasks/<task_id>
DELETE  /tasks/<task_id>
```

## Docker

The frontend and backend applications are containerized using Docker.

### Backend

The backend uses:

- Python 3.12
- Flask
- Gunicorn

Gunicorn runs the Flask application on port 5000.

### Frontend

The frontend uses:

- Node.js
- React
- Nginx

The frontend uses a multi-stage Docker build.

The React application is built in the Node.js stage and the generated production files are served using Nginx.

## Kubernetes

The application is deployed on Kubernetes using separate resources for:

- Frontend Deployment
- Frontend Service
- Backend Deployment
- Backend Service
- PostgreSQL Deployment
- PostgreSQL Service
- PersistentVolumeClaim
- Kubernetes Secret
- PostgreSQL Persistence

PostgreSQL uses a Kubernetes PersistentVolumeClaim.

The PVC provides persistent storage for the PostgreSQL database.

This allows database data to remain available even when the PostgreSQL pod is recreated.

### Kubernetes Secrets

Database configuration is managed using Kubernetes Secrets.

The backend receives database configuration through environment variables.

Sensitive values are not documented in this README.

## CI/CD Pipeline

GitHub Actions is used to automate the CI/CD process.

Pipeline flow:

```text
Git Push
   |
   v
GitHub Actions
   |
   +---- Backend Validation
   |
   +---- Frontend Build
   |
   +---- Docker Image Build
   |
   +---- Push Images to GHCR
   |
   v
Self-Hosted Runner
   |
   v
Kubernetes Deployment
```

## Backend Validation

The backend Python application is validated using:

```bash
python -m py_compile app.py
```

## Frontend Build

Frontend dependencies are installed using:

```bash
npm ci
```

The production frontend build is created using:

```bash
npm run build
```

## Docker Images

The pipeline builds and pushes Docker images to GitHub Container Registry.

```text
ghcr.io/prateek269/taskflow-backend:latest
ghcr.io/prateek269/taskflow-frontend:latest
```

## Kubernetes Deployment

After successful CI and Docker image builds, the deployment job runs on a self-hosted GitHub Actions runner.

The runner uses kubectl to deploy the Kubernetes manifests.

## Self-Hosted GitHub Actions Runner

A self-hosted GitHub Actions runner is used for the Kubernetes deployment stage.

Deployment flow:

```text
GitHub Actions
      |
      v
Self-Hosted Runner
      |
      v
kubectl
      |
      v
Kubernetes Cluster
```

The runner directory is not committed to the Git repository because it contains local runner configuration and runtime files.

## Kubernetes Commands
### Check Pods
```bash
kubectl get pods
```
### Check Deployments
```bash
kubectl get deployments
```
### Check Services
```bash
kubectl get services
```
### Check PersistentVolumeClaim
```bash
kubectl get pvc
```
### Check Logs
```bash
kubectl logs deployment/taskflow-backend
```
```bash
kubectl logs deployment/taskflow-frontend
```
## Application Verification

The backend health endpoint can be tested using:

```bash
curl http://localhost:5001/health
```

### Expected Response

```json
{
  "database": "connected",
  "status": "healthy"
}
```

### Retrieve Tasks

```bash
curl http://localhost:5001/tasks
```

## Port Forwarding

For local Kubernetes testing:

### Backend

```bash
kubectl port-forward svc/taskflow-backend 5001:5000
```

### Frontend

```bash
kubectl port-forward svc/taskflow-frontend 8086:80
```

The application can then be accessed through the local forwarded ports.

## DevOps Concepts Demonstrated
- Linux and WSL
- Git and GitHub
- Docker
- Dockerfiles
- Multi-stage Docker builds
- Container Registry
- GitHub Actions
- CI/CD
- Self-hosted GitHub Actions Runner
- Kubernetes
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes Secrets
- PersistentVolumeClaim
- PostgreSQL
- Gunicorn
- Nginx
- Application Health Checks
- Automated Kubernetes Deployment

## Key DevOps Workflow

```text
Developer
    |
    | git push
    v
GitHub
    |
    v
GitHub Actions
    |
    +---- Backend Validation
    |
    +---- Frontend Build
    |
    +---- Docker Build
    |
    +---- Push to GHCR
    |
    v
Self-Hosted Runner
    |
    v
kubectl
    |
    v
Kubernetes
    |
    +---- Frontend
    |
    +---- Backend
    |
    +---- PostgreSQL
    |
    v
Running Application
```

## What I Learned

Through this project, I worked with an end-to-end DevOps workflow from source code to automated Kubernetes deployment.

Key learning areas include:

- Building Docker images
- Running applications in containers
- Creating Kubernetes Deployments and Services
- Managing PostgreSQL persistence using PVC
- Managing configuration using Kubernetes Secrets
- Creating CI/CD pipelines with GitHub Actions
- Publishing Docker images to GHCR
- Using a self-hosted GitHub Actions runner
- Deploying applications automatically to Kubernetes
- Troubleshooting containers, pods, services and networking
- Verifying application health and database connectivity
- Using Gunicorn for backend production serving
- Using Nginx for frontend production serving

## Future Improvements

- Kubernetes Ingress
- HTTPS / TLS
- Horizontal Pod Autoscaling
- Prometheus and Grafana monitoring
- Centralized logging
- Automated unit and integration testing
- Terraform infrastructure provisioning
- Ansible configuration management
- Immutable Docker image tags
- Improved frontend/backend API routing
- Production-grade secret management
