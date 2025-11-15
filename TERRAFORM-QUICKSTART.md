# Terraform Quick Start Guide

## Two Deployment Options

### Option 1: EC2 Instance (AWS) - Current `main.tf`
### Option 2: Local Docker Container - Use `docker-local.tf`

---

## Quick Start: EC2 Deployment

```bash
# 1. Configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: set key_pair_name

# 2. Initialize
terraform init

# 3. Plan
terraform plan

# 4. Apply
terraform apply

# 5. Get API URL
terraform output api_url
```

---

## Quick Start: Docker Deployment

```bash
# 1. Switch to Docker config
mv main.tf main.tf.ec2.backup
mv docker-local.tf main.tf

# 2. Initialize
terraform init

# 3. Plan
terraform plan

# 4. Apply
terraform apply

# 5. Test
curl http://localhost:3000/api/health
```

---

## Command Demonstration

Run the demo script:
- **Linux/Mac:** `bash terraform-demo.sh`
- **Windows:** `terraform-demo.bat`

Or manually:

### 1. Initialize
```bash
terraform init
```
Downloads providers and initializes backend.

### 2. Plan
```bash
terraform plan
```
Shows what will be created without making changes.

### 3. Apply
```bash
terraform apply
```
Creates the infrastructure. Confirm with `yes`.

### 4. Destroy
```bash
terraform destroy
```
Removes all resources.

---

For detailed documentation, see [TERRAFORM.md](./TERRAFORM.md)

