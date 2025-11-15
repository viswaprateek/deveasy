@echo off
REM Docker Commands Reference Script for Student Management API (Windows)
REM This script demonstrates all Docker operations

echo === Student Management API - Docker Commands ===
echo.

REM Replace with your Docker Hub username
set DOCKERHUB_USERNAME=YOUR_DOCKERHUB_USERNAME
set IMAGE_NAME=student-management-api
set FULL_IMAGE_NAME=%DOCKERHUB_USERNAME%/%IMAGE_NAME%

echo 1. Building Docker Image
echo docker build -f backend/Dockerfile -t %IMAGE_NAME%:latest .
echo.

echo 2. Running Container with Port Mapping
echo docker run -d --name student-api -p 3000:3000 %IMAGE_NAME%:latest
echo.

echo 3. Verifying Running Containers
echo docker ps
echo docker ps -a  # Show all containers
echo docker logs student-api  # View logs
echo.

echo 4. Testing the API
echo curl http://localhost:3000/api/health
echo curl http://localhost:3000/api/students
echo.

echo 5. Tagging for Docker Hub
echo docker tag %IMAGE_NAME%:latest %FULL_IMAGE_NAME%:latest
echo.

echo 6. Pushing to Docker Hub
echo docker login
echo docker push %FULL_IMAGE_NAME%:latest
echo.

echo 7. Pulling and Running on Another System
echo docker pull %FULL_IMAGE_NAME%:latest
echo docker run -d --name student-api -p 3000:3000 %FULL_IMAGE_NAME%:latest
echo.

echo 8. Using Docker Compose
echo docker-compose build  # Build
echo docker-compose up -d  # Start
echo docker-compose down   # Stop
echo docker-compose logs   # View logs
echo.

echo Note: Replace %DOCKERHUB_USERNAME% with your actual Docker Hub username

