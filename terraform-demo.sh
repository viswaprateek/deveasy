#!/bin/bash

# Terraform Commands Demonstration Script
# This script demonstrates init, plan, and apply commands

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Terraform Commands Demonstration ===${NC}\n"

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform is not installed${NC}"
    echo "Please install Terraform: https://www.terraform.io/downloads"
    exit 1
fi

echo -e "${GREEN}Step 1: Initializing Terraform${NC}"
echo -e "${YELLOW}Command: terraform init${NC}\n"
terraform init

echo -e "\n${GREEN}Step 2: Validating Configuration${NC}"
echo -e "${YELLOW}Command: terraform validate${NC}\n"
terraform validate

echo -e "\n${GREEN}Step 3: Formatting Configuration${NC}"
echo -e "${YELLOW}Command: terraform fmt${NC}\n"
terraform fmt

echo -e "\n${GREEN}Step 4: Planning Changes${NC}"
echo -e "${YELLOW}Command: terraform plan${NC}\n"
if [ -f "terraform.tfvars" ]; then
    terraform plan -var-file="terraform.tfvars"
else
    echo -e "${YELLOW}Note: terraform.tfvars not found. Using defaults.${NC}\n"
    terraform plan
fi

echo -e "\n${BLUE}=== Planning Complete ===${NC}"
echo -e "${YELLOW}Review the plan above. If everything looks good, you can proceed with:${NC}"
echo -e "${YELLOW}  terraform apply${NC}"
echo -e "${YELLOW}  or${NC}"
echo -e "${YELLOW}  terraform apply -auto-approve${NC}\n"

# Uncomment the following section to auto-apply (use with caution)
# echo -e "\n${GREEN}Step 5: Applying Changes${NC}"
# echo -e "${YELLOW}Command: terraform apply -auto-approve${NC}\n"
# if [ -f "terraform.tfvars" ]; then
#     terraform apply -var-file="terraform.tfvars" -auto-approve
# else
#     terraform apply -auto-approve
# fi

# echo -e "\n${GREEN}Step 6: Viewing Outputs${NC}"
# echo -e "${YELLOW}Command: terraform output${NC}\n"
# terraform output

echo -e "\n${BLUE}=== Demonstration Complete ===${NC}"
echo -e "${YELLOW}To destroy resources when done:${NC}"
echo -e "${YELLOW}  terraform destroy${NC}\n"

