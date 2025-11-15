# Docker Guide for Student Management API

This guide demonstrates how to build, run, and deploy the Student Management API using Docker.

## Prerequisites

- Docker installed on your system
- Docker Hub account (for pushing images)

## Table of Contents

1. [Building the Docker Image](#building-the-docker-image)
2. [Running the Container with Port Mapping](#running-the-container-with-port-mapping)
3. [Verifying Running Containers](#verifying-running-containers)
4. [Pushing to Docker Hub](#pushing-to-docker-hub)
5. [Pulling and Running on Another System](#pulling-and-running-on-another-system)

---

## Building the Docker Image

### Option 1: Using Dockerfile directly

```bash
# Navigate to project root
cd devops

# Build the image
docker build -f backend/Dockerfile -t student-management-api:latest .
```

### Option 2: Using Docker Compose

```bash
# Build using docker-compose
docker-compose build
```

**Expected output:**
```
[+] Building 15.2s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 2.45kB
 => [internal] load .dockerignore
 => => transferring context: 1.20kB
 => [internal] load metadata for docker.io/library/node:18-alpine
 => [1/6] FROM docker.io/library/node:18-alpine
 => [2/6] WORKDIR /app
 => [3/6] COPY package*.json ./
 => [4/6] RUN npm install --production
 => [5/6] COPY backend/ ./backend/
 => [6/6] EXPOSE 3000
 => exporting to image
 => => exporting layers
 => => writing image sha256:...
 => => naming to docker.io/library/student-management-api:latest
```

---

## Running the Container with Port Mapping

### Option 1: Using docker run

```bash
# Run container with port mapping (host:container)
docker run -d \
  --name student-api \
  -p 3000:3000 \
  student-management-api:latest
```

**Port Mapping Explanation:**
- `-p 3000:3000` maps port 3000 on your host machine to port 3000 in the container
- Format: `-p HOST_PORT:CONTAINER_PORT`
- You can use different host port: `-p 8080:3000` (access via localhost:8080)

### Option 2: Using Docker Compose

```bash
# Start container
docker-compose up -d

# View logs
docker-compose logs -f
```

### Verify the API is Running

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"OK","message":"Student Management API is running"}

# Test students endpoint
curl http://localhost:3000/api/students
```

---

## Verifying Running Containers

### Using docker ps

```bash
# List all running containers
docker ps

# Expected output:
# CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS          PORTS                    NAMES
# abc123def456   student-management-api:latest   "node backend/server.js"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   student-api
```

### Detailed Container Information

```bash
# Show all containers (including stopped)
docker ps -a

# Show container details
docker inspect student-api

# Show container logs
docker logs student-api

# Follow logs in real-time
docker logs -f student-api

# Show container resource usage
docker stats student-api
```

### Container Status Fields Explained

- **CONTAINER ID**: Unique identifier
- **IMAGE**: Image used to create container
- **COMMAND**: Command running in container
- **CREATED**: When container was created
- **STATUS**: Current state (Up, Exited, etc.)
- **PORTS**: Port mappings (HOST:CONTAINER)
- **NAMES**: Container name

---

## Pushing to Docker Hub

### Step 1: Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Tag the Image

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```bash
# Tag image with your Docker Hub username
docker tag student-management-api:latest YOUR_DOCKERHUB_USERNAME/student-management-api:latest

# Optional: Tag with version
docker tag student-management-api:latest YOUR_DOCKERHUB_USERNAME/student-management-api:v1.0.0
```

### Step 3: Push to Docker Hub

```bash
# Push the image
docker push YOUR_DOCKERHUB_USERNAME/student-management-api:latest

# Push versioned tag
docker push YOUR_DOCKERHUB_USERNAME/student-management-api:v1.0.0
```

**Expected output:**
```
The push refers to repository [docker.io/YOUR_DOCKERHUB_USERNAME/student-management-api]
latest: digest: sha256:... size: 1234
```

### Verify on Docker Hub

1. Visit https://hub.docker.com
2. Navigate to your repository
3. Verify the image is listed

---

## Pulling and Running on Another System

### Step 1: Pull the Image

On the new system (with Docker installed):

```bash
# Pull the image from Docker Hub
docker pull YOUR_DOCKERHUB_USERNAME/student-management-api:latest
```

**Expected output:**
```
latest: Pulling from YOUR_DOCKERHUB_USERNAME/student-management-api
Digest: sha256:...
Status: Downloaded newer image for YOUR_DOCKERHUB_USERNAME/student-management-api:latest
```

### Step 2: Run the Container

```bash
# Run the pulled image
docker run -d \
  --name student-api \
  -p 3000:3000 \
  YOUR_DOCKERHUB_USERNAME/student-management-api:latest
```

### Step 3: Verify Running Container

```bash
# Check running containers
docker ps

# Test the API
curl http://localhost:3000/api/health
curl http://localhost:3000/api/students
```

### Step 4: Access from Frontend

Update the frontend API URL in `src/api.js`:

```javascript
// For local Docker container
const API_BASE_URL = 'http://localhost:3000/api';

// For remote Docker container
const API_BASE_URL = 'http://REMOTE_IP:3000/api';
```

---

## Common Docker Commands

### Container Management

```bash
# Start container
docker start student-api

# Stop container
docker stop student-api

# Restart container
docker restart student-api

# Remove container
docker rm student-api

# Remove container (force, even if running)
docker rm -f student-api
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi student-management-api:latest

# Remove unused images
docker image prune -a
```

### Debugging

```bash
# Execute command in running container
docker exec -it student-api sh

# View container logs
docker logs student-api

# View last 100 lines of logs
docker logs --tail 100 student-api

# Inspect container
docker inspect student-api
```

---

## Docker Compose Commands

```bash
# Build and start
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :3000

# Use different port
docker run -d -p 8080:3000 student-management-api:latest
```

### Container Won't Start

```bash
# Check logs
docker logs student-api

# Run interactively to see errors
docker run -it student-management-api:latest
```

### Cannot Connect to API

1. Verify container is running: `docker ps`
2. Check port mapping: `docker port student-api`
3. Test from inside container: `docker exec student-api wget -qO- http://localhost:3000/api/health`
4. Check firewall settings

---

## Example: Complete Workflow

```bash
# 1. Build image
docker build -f backend/Dockerfile -t student-management-api:latest .

# 2. Run container
docker run -d --name student-api -p 3000:3000 student-management-api:latest

# 3. Verify running
docker ps

# 4. Test API
curl http://localhost:3000/api/health

# 5. Tag for Docker Hub
docker tag student-management-api:latest YOUR_USERNAME/student-management-api:latest

# 6. Push to Docker Hub
docker push YOUR_USERNAME/student-management-api:latest

# 7. On another system, pull and run
docker pull YOUR_USERNAME/student-management-api:latest
docker run -d --name student-api -p 3000:3000 YOUR_USERNAME/student-management-api:latest
```

---

## Notes

- The container uses in-memory storage, so data is lost when container stops
- For production, consider adding a database container
- Health checks are configured to monitor container status
- The image is based on Node.js 18 Alpine (lightweight Linux distribution)

