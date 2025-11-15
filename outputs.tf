# EC2 Outputs (only applicable when using EC2 configuration)
output "api_server_public_ip" {
  description = "Public IP address of the API server (EC2)"
  value       = try(aws_eip.api_eip.public_ip, null)
}

output "api_server_public_dns" {
  description = "Public DNS name of the API server (EC2)"
  value       = try(aws_eip.api_eip.public_dns, null)
}

output "api_url" {
  description = "URL to access the Student Management API"
  value       = try("http://${aws_eip.api_eip.public_ip}:3000/api", "http://localhost:${var.host_port}/api")
}

output "ssh_command" {
  description = "Command to SSH into the instance (EC2 only)"
  value       = try("ssh -i <your-key.pem> ec2-user@${aws_eip.api_eip.public_ip}", null)
}

# Docker Outputs (only applicable when using Docker configuration)
output "docker_container_id" {
  description = "ID of the Docker container"
  value       = try(docker_container.api_container.id, null)
}

output "docker_container_name" {
  description = "Name of the Docker container"
  value       = try(docker_container.api_container.name, null)
}

output "docker_network_name" {
  description = "Name of the Docker network"
  value       = try(docker_network.api_network.name, null)
}

output "local_api_url" {
  description = "Local URL to access the Student Management API (Docker)"
  value       = "http://localhost:${var.host_port}/api"
}

