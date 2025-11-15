#!/bin/bash

# Docker Commands Reference Script for Student Management API
# This script demonstrates all Docker operations

echo "=== Student Management API - Docker Commands ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Replace with your Docker Hub username
DOCKERHUB_USERNAME="YOUR_DOCKERHUB_USERNAME"
IMAGE_NAME="student-management-api"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}"

echo -e "${BLUE}1. Building Docker Image${NC}"
echo "docker build -f backend/Dockerfile -t ${IMAGE_NAME}:latest ."
echo ""

echo -e "${BLUE}2. Running Container with Port Mapping${NC}"
echo "docker run -d --name student-api -p 3000:3000 ${IMAGE_NAME}:latest"
echo ""

echo -e "${BLUE}3. Verifying Running Containers${NC}"
echo "docker ps"
echo "docker ps -a  # Show all containers"
echo "docker logs student-api  # View logs"
echo ""

echo -e "${BLUE}4. Testing the API${NC}"
echo "curl http://localhost:3000/api/health"
echo "curl http://localhost:3000/api/students"
echo ""

echo -e "${BLUE}5. Tagging for Docker Hub${NC}"
echo "docker tag ${IMAGE_NAME}:latest ${FULL_IMAGE_NAME}:latest"
echo ""

echo -e "${BLUE}6. Pushing to Docker Hub${NC}"
echo "docker login"
echo "docker push ${FULL_IMAGE_NAME}:latest"
echo ""

echo -e "${BLUE}7. Pulling and Running on Another System${NC}"
echo "docker pull ${FULL_IMAGE_NAME}:latest"
echo "docker run -d --name student-api -p 3000:3000 ${FULL_IMAGE_NAME}:latest"
echo ""

echo -e "${BLUE}8. Using Docker Compose${NC}"
echo "docker-compose build  # Build"
echo "docker-compose up -d  # Start"
echo "docker-compose down   # Stop"
echo "docker-compose logs   # View logs"
echo ""

echo -e "${YELLOW}Note: Replace ${DOCKERHUB_USERNAME} with your actual Docker Hub username${NC}"

