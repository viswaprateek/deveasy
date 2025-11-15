# Alternative Terraform configuration for Local Docker Container
# Use this file instead of main.tf if you want to run containers locally
# Rename this file to main.tf or use it separately

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

# Configure the Docker Provider (uses local Docker daemon)
# Works on Linux, macOS, and Windows (Docker Desktop)
provider "docker" {
  # Linux/macOS: unix:///var/run/docker.sock
  # Windows: npipe:////./pipe/docker_engine
  # Terraform auto-detects the appropriate socket, but you can override:
  # host = "unix:///var/run/docker.sock"  # Linux/macOS
  # host = "npipe:////./pipe/docker_engine"  # Windows
}

# Build the Docker image from Dockerfile
resource "docker_image" "api_image" {
  name          = var.docker_image_name
  keep_locally  = true
  build {
    context    = "."
    dockerfile = "backend/Dockerfile"
    tag        = ["${var.docker_image_name}:latest"]
  }
  triggers = {
    dockerfile_hash = filemd5("backend/Dockerfile")
    context_hash    = filemd5("package.json")
  }
}

# Create a Docker network for the container
resource "docker_network" "api_network" {
  name = "${var.project_name}-network"
}

# Create and run the Docker container
resource "docker_container" "api_container" {
  image = docker_image.api_image.image_id
  name  = var.docker_container_name

  ports {
    internal = 3000
    external = var.host_port
  }

  env = [
    "NODE_ENV=production",
    "PORT=3000"
  ]

  networks = [docker_network.api_network.name]

  restart = "unless-stopped"

  healthcheck {
    test     = ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
    interval = "30s"
    timeout  = "3s"
    retries  = 3
    start_period = "5s"
  }

  labels {
    project = var.project_name
  }
}

