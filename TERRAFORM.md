# Terraform Configuration Guide

This guide demonstrates how to use Terraform to provision infrastructure for the Student Management API. You can choose between **EC2 instance** (AWS) or **local Docker container** deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option 1: EC2 Instance Deployment](#option-1-ec2-instance-deployment)
3. [Option 2: Local Docker Container Deployment](#option-2-local-docker-container-deployment)
4. [Terraform Commands Demonstration](#terraform-commands-demonstration)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### For EC2 Deployment:
- AWS Account with CLI configured
- AWS credentials configured (`aws configure`)
- Terraform installed (>= 1.0)
- SSH key pair created in AWS

### For Docker Deployment:
- Docker installed and running locally
- Terraform installed (>= 1.0)

---

## Option 1: EC2 Instance Deployment

### Step 1: Configure Variables

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your settings:
   ```hcl
   aws_region = "us-east-1"
   project_name = "student-management-api"
   instance_type = "t2.micro"
   key_pair_name = "your-aws-key-pair-name"
   ssh_cidr = "0.0.0.0/0"  # Restrict to your IP for security
   ```

### Step 2: Use EC2 Configuration

Ensure you're using `main.tf` (EC2 configuration). If you have both files, rename or use a workspace:
```bash
# main.tf contains EC2 configuration
```

---

## Option 2: Local Docker Container Deployment

### Step 1: Configure Variables

Create or update `terraform.tfvars`:
```hcl
project_name = "student-management-api"
docker_image_name = "student-management-api"
docker_container_name = "student-management-api"
host_port = 3000
```

### Step 2: Use Docker Configuration

1. Temporarily rename or backup `main.tf`:
   ```bash
   mv main.tf main.tf.ec2.backup
   mv docker-local.tf main.tf
   ```

   OR use Terraform workspaces (recommended):
   ```bash
   # Keep both files and use workspaces
   ```

---

## Terraform Commands Demonstration

### 1. Initialize Terraform (`terraform init`)

This command downloads the required providers and initializes the backend.

**Command:**
```bash
terraform init
```

**Expected Output:**
```
Initializing the backend...

Initializing provider plugins...
- Finding latest version of hashicorp/aws...
- Installing hashicorp/aws v5.x.x...
- Installed hashicorp/aws v5.x.x (signed by HashiCorp)

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory.
```

**What it does:**
- Downloads required provider plugins (AWS or Docker)
- Initializes the backend for state storage
- Sets up `.terraform/` directory with providers

---

### 2. Validate Configuration (`terraform validate`)

Validate your Terraform configuration syntax.

**Command:**
```bash
terraform validate
```

**Expected Output:**
```
Success! The configuration is valid.
```

---

### 3. Format Configuration (`terraform fmt`)

Format your Terraform files for consistency.

**Command:**
```bash
terraform fmt
```

**Expected Output:**
```
main.tf
variables.tf
outputs.tf
```

---

### 4. Plan Changes (`terraform plan`)

Preview what Terraform will create, modify, or destroy.

**Command:**
```bash
terraform plan
```

**With variables file:**
```bash
terraform plan -var-file="terraform.tfvars"
```

**Expected Output (EC2):**
```
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_eip.api_eip will be created
  + resource "aws_eip" "api_eip" {
      + allocation_id        = (known after apply)
      + association_id       = (known after apply)
      + domain               = "vpc"
      + id                   = (known after apply)
      + instance             = (known after apply)
      + network_border_group = (known after apply)
      + network_interface    = (known after apply)
      + private_dns          = (known after apply)
      + private_ip           = (known after apply)
      + public_dns           = (known after apply)
      + public_ip            = (known after apply)
      + public_ipv4_pool     = (known after apply)
      + tags                 = {
          + "Name" = "student-management-api-api-eip"
        }
    }

  # aws_instance.api_server will be created
  + resource "aws_instance" "api_server" {
      + ami                                  = "ami-0c55b159cbfafe1f0"
      + instance_type                        = "t2.micro"
      + key_name                             = "your-aws-key-pair-name"
      + tags                                 = {
          + "Name" = "student-management-api-api-server"
        }
      + vpc_security_group_ids               = (known after apply)
      ...
    }

  # aws_security_group.api_sg will be created
  + resource "aws_security_group" "api_sg" {
      + description = "Security group for Student Management API"
      + name        = "student-management-api-api-sg"
      ...
    }

Plan: 3 to add, 0 to change, 0 to destroy.
```

**Expected Output (Docker):**
```
Terraform used the selected providers to generate the following execution plan:

  # docker_container.api_container will be created
  + resource "docker_container" "api_container" {
      + name  = "student-management-api"
      + image = (known after apply)
      ...
    }

  # docker_image.api_image will be created
  + resource "docker_image" "api_image" {
      + name         = "student-management-api"
      + image_id     = (known after apply)
      ...
    }

  # docker_network.api_network will be created
  + resource "docker_network" "api_network" {
      + name = "student-management-api-network"
      ...
    }

Plan: 3 to add, 0 to change, 0 to destroy.
```

**What it does:**
- Shows what resources will be created
- Displays changes without making them
- Validates the plan against current state

---

### 5. Apply Changes (`terraform apply`)

Creates or modifies infrastructure according to the plan.

**Command (Interactive):**
```bash
terraform apply
```

**Command (Auto-approve - Non-interactive):**
```bash
terraform apply -auto-approve
```

**With variables file:**
```bash
terraform apply -var-file="terraform.tfvars" -auto-approve
```

**Expected Output:**
```
Terraform used the selected providers to generate the following execution plan...
[Output similar to plan command]

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

aws_security_group.api_sg: Creating...
aws_security_group.api_sg: Creation complete after 2s
aws_instance.api_server: Creating...
aws_instance.api_server: Still creating... [10s elapsed]
aws_instance.api_server: Creation complete after 15s
aws_eip.api_eip: Creating...
aws_eip.api_eip: Creation complete after 3s

Apply complete! Resources: 3 added, 0 changed, 0 destroyed.

Outputs:

api_server_public_ip = "54.123.45.67"
api_server_public_dns = "ec2-54-123-45-67.compute-1.amazonaws.com"
api_url = "http://54.123.45.67:3000/api"
ssh_command = "ssh -i <your-key.pem> ec2-user@54.123.45.67"
```

**What it does:**
- Creates/modifies/destroys resources
- Shows progress in real-time
- Displays outputs after completion
- Updates the state file

---

### 6. View Outputs (`terraform output`)

Display output values after apply.

**Command:**
```bash
terraform output
```

**Specific output:**
```bash
terraform output api_url
```

---

### 7. Destroy Infrastructure (`terraform destroy`)

Remove all resources created by Terraform.

**Command:**
```bash
terraform destroy
```

**Auto-approve:**
```bash
terraform destroy -auto-approve
```

**Expected Output:**
```
aws_eip.api_eip: Refreshing state... [id=eipalloc-xxx]
aws_instance.api_server: Refreshing state... [id=i-xxx]
aws_security_group.api_sg: Refreshing state... [id=sg-xxx]

Terraform will destroy all resources. Are you sure?
  Enter 'yes' to confirm: yes

aws_eip.api_eip: Destroying... [id=eipalloc-xxx]
aws_eip.api_eip: Destruction complete after 2s
aws_instance.api_server: Destroying... [id=i-xxx]
aws_instance.api_server: Still destroying... [10s elapsed]
aws_instance.api_server: Destruction complete after 15s
aws_security_group.api_sg: Destroying... [id=sg-xxx]
aws_security_group.api_sg: Destruction complete after 2s

Destroy complete! Resources: 3 destroyed.
```

---

## Quick Reference: Command Sequence

### Complete Workflow for EC2:

```bash
# 1. Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# 2. Initialize
terraform init

# 3. Validate
terraform validate

# 4. Format
terraform fmt

# 5. Plan
terraform plan -var-file="terraform.tfvars"

# 6. Apply
terraform apply -var-file="terraform.tfvars"

# 7. View outputs
terraform output

# 8. Test the API
curl http://$(terraform output -raw api_server_public_ip):3000/api/health

# 9. When done, destroy
terraform destroy -var-file="terraform.tfvars"
```

### Complete Workflow for Docker:

```bash
# 1. Switch to Docker configuration
mv main.tf main.tf.ec2.backup
mv docker-local.tf main.tf

# 2. Initialize
terraform init

# 3. Validate
terraform validate

# 4. Plan
terraform plan

# 5. Apply
terraform apply -auto-approve

# 6. Test the API
curl http://localhost:3000/api/health

# 7. View container
docker ps
docker logs student-management-api

# 8. When done, destroy
terraform destroy -auto-approve
```

---

## Troubleshooting

### Common Issues:

1. **Provider not found:**
   ```bash
   Error: Failed to query available provider packages
   ```
   Solution: Run `terraform init` again

2. **AWS credentials not configured:**
   ```bash
   Error: error configuring Terraform AWS Provider
   ```
   Solution: Run `aws configure` or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

3. **Docker daemon not running:**
   ```bash
   Error: Cannot connect to the Docker daemon
   ```
   Solution: Start Docker service (`sudo systemctl start docker` on Linux)

4. **Port already in use (Docker):**
   ```bash
   Error: bind: address already in use
   ```
   Solution: Change `host_port` in terraform.tfvars or stop conflicting container

---

## Additional Commands

### State Management:
```bash
terraform state list          # List all resources in state
terraform state show <resource>  # Show details of a resource
terraform refresh            # Update state file with actual infrastructure
```

### Workspaces (for managing multiple environments):
```bash
terraform workspace new dev
terraform workspace select dev
terraform workspace list
```

