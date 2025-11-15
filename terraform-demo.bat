@echo off
REM Terraform Commands Demonstration Script (Windows)
REM This script demonstrates init, plan, and apply commands

echo === Terraform Commands Demonstration ===
echo.

REM Check if Terraform is installed
where terraform >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Terraform is not installed
    echo Please install Terraform: https://www.terraform.io/downloads
    exit /b 1
)

echo Step 1: Initializing Terraform
echo Command: terraform init
echo.
terraform init
if %ERRORLEVEL% NEQ 0 (
    echo Error during initialization
    exit /b 1
)

echo.
echo Step 2: Validating Configuration
echo Command: terraform validate
echo.
terraform validate
if %ERRORLEVEL% NEQ 0 (
    echo Error during validation
    exit /b 1
)

echo.
echo Step 3: Formatting Configuration
echo Command: terraform fmt
echo.
terraform fmt

echo.
echo Step 4: Planning Changes
echo Command: terraform plan
echo.
if exist terraform.tfvars (
    terraform plan -var-file="terraform.tfvars"
) else (
    echo Note: terraform.tfvars not found. Using defaults.
    echo.
    terraform plan
)

echo.
echo === Planning Complete ===
echo Review the plan above. If everything looks good, you can proceed with:
echo   terraform apply
echo   or
echo   terraform apply -auto-approve
echo.

REM Uncomment the following section to auto-apply (use with caution)
REM echo.
REM echo Step 5: Applying Changes
REM echo Command: terraform apply -auto-approve
REM echo.
REM if exist terraform.tfvars (
REM     terraform apply -var-file="terraform.tfvars" -auto-approve
REM ) else (
REM     terraform apply -auto-approve
REM )
REM
REM echo.
REM echo Step 6: Viewing Outputs
REM echo Command: terraform output
REM echo.
REM terraform output

echo.
echo === Demonstration Complete ===
echo To destroy resources when done:
echo   terraform destroy
echo.

