variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "student-management-api"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_pair_name" {
  description = "Name of the AWS key pair for SSH access"
  type        = string
  default     = ""
}

variable "ssh_cidr" {
  description = "CIDR block allowed for SSH access"
  type        = string
  default     = "0.0.0.0/0"
}

# Docker-specific variables (for local container deployment)
variable "docker_image_name" {
  description = "Name of the Docker image to build/use"
  type        = string
  default     = "student-management-api"
}

variable "docker_container_name" {
  description = "Name for the Docker container"
  type        = string
  default     = "student-management-api"
}

variable "host_port" {
  description = "Host port to map to container port 3000"
  type        = number
  default     = 3000
}

