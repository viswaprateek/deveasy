# Jenkins CI/CD Pipeline Guide

This guide explains how to set up and use the Jenkins pipeline for the Student Management API.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Jenkins Setup](#jenkins-setup)
3. [Pipeline Configuration](#pipeline-configuration)
4. [Running the Pipeline](#running-the-pipeline)
5. [Viewing Build Results](#viewing-build-results)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Jenkins** (LTS version recommended)
   - Download from: https://www.jenkins.io/download/
   - Or use Docker: `docker run -p 8080:8080 jenkins/jenkins:lts`

2. **Node.js** (v18 or higher)
   - Install on Jenkins server or use Node.js plugin

3. **Git**
   - For pulling code from GitHub

4. **GitHub Repository**
   - Your code should be pushed to GitHub

### Required Jenkins Plugins

Install these plugins via Jenkins → Manage Jenkins → Plugins:

- **Pipeline** (usually pre-installed)
- **Git** (for GitHub integration)
- **NodeJS Plugin** (for Node.js support)
- **JUnit Plugin** (for test results)
- **Email Extension Plugin** (for email notifications)

---

## Jenkins Setup

### Step 1: Install Node.js Plugin

1. Go to **Manage Jenkins** → **Plugins**
2. Search for "NodeJS Plugin"
3. Install and restart Jenkins

### Step 2: Configure Node.js

1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Under **NodeJS**, click **Add NodeJS**
3. Name: `NodeJS-18`
4. Version: Select `18.x` or latest LTS
5. Click **Save**

### Step 3: Create Pipeline Job

1. Click **New Item** on Jenkins dashboard
2. Enter job name: `student-management-api`
3. Select **Pipeline**
4. Click **OK**

### Step 4: Configure Pipeline

1. **General Settings:**
   - ✅ **GitHub project**: Enter your GitHub repository URL
   - ✅ **Build Triggers**: 
     - Poll SCM: `H/5 * * * *` (every 5 minutes)
     - Or: GitHub hook trigger for GITScm polling

2. **Pipeline Configuration:**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: Your GitHub repository URL
   - Credentials: Add if repository is private
   - Branches to build: `*/main` or `*/master`
   - Script Path: `Jenkinsfile`

3. Click **Save**

---

## Pipeline Configuration

The `Jenkinsfile` defines the CI/CD pipeline with these stages:

### Pipeline Stages

1. **Checkout** - Pulls code from GitHub
2. **Install Dependencies** - Runs `npm install`
3. **Lint** - Runs linting (if configured)
4. **Build** - Builds the application
5. **Test** - Runs automated tests
6. **Start Server** - Starts the API server
7. **Integration Tests** - Runs integration tests against running server

### Pipeline Features

- ✅ Automatic GitHub integration
- ✅ Test result reporting (JUnit XML)
- ✅ Email notifications on success/failure
- ✅ Artifact archiving
- ✅ Build status indicators

---

## Running the Pipeline

### Manual Build

1. Go to your Jenkins job dashboard
2. Click **Build Now**
3. Watch the build progress in real-time

### Automatic Builds

The pipeline can be triggered by:

- **Git Push**: Configure webhook in GitHub
- **Scheduled**: Poll SCM every 5 minutes
- **Manual**: Click "Build Now"

### GitHub Webhook Setup (Optional)

1. In GitHub repository, go to **Settings** → **Webhooks**
2. Click **Add webhook**
3. Payload URL: `http://your-jenkins-url/github-webhook/`
4. Content type: `application/json`
5. Events: Select **Just the push event**
6. Click **Add webhook**

---

## Viewing Build Results

### Build Dashboard

After a build completes, you'll see:

- **Build Status**: ✅ Success, ❌ Failure, ⚠️ Unstable
- **Build Number**: Sequential build numbers
- **Build Duration**: How long the build took
- **Stage View**: Visual representation of pipeline stages

### Test Results

1. Click on a build number
2. Click **Test Result** in the left menu
3. View:
   - Total tests run
   - Passed/Failed tests
   - Test execution time
   - Individual test details

### Console Output

1. Click on a build number
2. Click **Console Output**
3. See detailed logs of:
   - Code checkout
   - Dependency installation
   - Test execution
   - Build artifacts

### Build Artifacts

1. Click on a build number
2. Click **Build Artifacts**
3. Download:
   - `test-results.xml` - JUnit test results
   - `npm-debug.log` - NPM logs (if any)

---

## Pipeline Stages Explained

### 1. Checkout Stage

```groovy
stage('Checkout') {
    steps {
        checkout scm
        // Displays Git commit and branch info
    }
}
```

**What it does:**
- Pulls latest code from GitHub
- Shows commit hash and branch name

### 2. Install Dependencies

```groovy
stage('Install Dependencies') {
    steps {
        npm install
    }
}
```

**What it does:**
- Installs all npm packages
- Verifies Node.js and npm versions

### 3. Build Stage

```groovy
stage('Build') {
    steps {
        npm run build
    }
}
```

**What it does:**
- Builds the frontend application
- Creates production-ready assets

### 4. Test Stage

```groovy
stage('Test') {
    steps {
        npm test
    }
}
```

**What it does:**
- Runs all automated tests
- Generates JUnit XML report
- Publishes test results to Jenkins

**Test Coverage:**
- ✅ Health check endpoint
- ✅ GET all students
- ✅ GET student by ID
- ✅ POST create student
- ✅ PATCH update student
- ✅ DELETE student
- ✅ Error handling (404, 400, 409)

### 5. Integration Tests

```groovy
stage('Integration Tests') {
    steps {
        # Server is started in previous stage
        npm run test:integration
    }
}
```

**What it does:**
- Tests API endpoints against running server
- Verifies end-to-end functionality

---

## Build Results Interpretation

### Success Indicators

✅ **Green Build**: All stages passed
- Code checked out successfully
- Dependencies installed
- Build completed
- All tests passed
- Integration tests passed

### Failure Indicators

❌ **Red Build**: One or more stages failed
- Check console output for errors
- Review test failures
- Check dependency installation issues

### Unstable Build

⚠️ **Yellow Build**: Tests passed but warnings present
- Some non-critical issues
- Review test results for details

---

## Email Notifications

The pipeline sends email notifications:

- **On Success**: ✅ Build completed successfully
- **On Failure**: ❌ Build failed with error details

### Configure Email

1. Go to **Manage Jenkins** → **Configure System**
2. Under **Extended E-mail Notification**:
   - SMTP server: Your SMTP server
   - Default user e-mail suffix: `@yourdomain.com`
3. Save configuration

---

## Troubleshooting

### Issue: "Node.js not found"

**Solution:**
1. Install Node.js plugin
2. Configure Node.js in Global Tool Configuration
3. Ensure Node.js path is correct

### Issue: "Tests failing"

**Solution:**
1. Check if server is running before tests
2. Verify API endpoints are accessible
3. Check test logs in console output
4. Ensure port 3000 is available

### Issue: "Cannot connect to GitHub"

**Solution:**
1. Verify repository URL is correct
2. Add credentials for private repositories
3. Check network connectivity
4. Verify GitHub webhook (if using)

### Issue: "Build hangs"

**Solution:**
1. Check if server is properly stopped
2. Verify no port conflicts
3. Increase build timeout
4. Check Jenkins server resources

### Issue: "Test results not showing"

**Solution:**
1. Install JUnit plugin
2. Verify `test-results.xml` is generated
3. Check file path in Jenkinsfile
4. Ensure tests are actually running

---

## Advanced Configuration

### Custom Environment Variables

Add to Jenkinsfile:

```groovy
environment {
    NODE_ENV = 'test'
    API_PORT = '3000'
    TEST_TIMEOUT = '30000'
}
```

### Parallel Test Execution

```groovy
stage('Test') {
    parallel {
        stage('Unit Tests') {
            steps {
                npm run test:unit
            }
        }
        stage('Integration Tests') {
            steps {
                npm run test:integration
            }
        }
    }
}
```

### Docker Integration

Add Docker build stage:

```groovy
stage('Docker Build') {
    steps {
        sh 'docker build -f backend/Dockerfile -t student-api:${BUILD_NUMBER} .'
    }
}
```

---

## Best Practices

1. ✅ **Keep Jenkinsfile in repository** - Version control your pipeline
2. ✅ **Use environment variables** - Don't hardcode values
3. ✅ **Fail fast** - Stop pipeline on first failure
4. ✅ **Archive artifacts** - Keep test results and logs
5. ✅ **Notify on failures** - Get alerts when builds fail
6. ✅ **Clean up resources** - Stop servers, remove temp files
7. ✅ **Use build numbers** - Tag Docker images with build numbers

---

## Example Build Output

```
Started by user Admin
[Pipeline] checkout
Checking out code from GitHub...
Git Commit: abc1234
Git Branch: main

[Pipeline] stage
[Pipeline] { (Install Dependencies)
Installing Node.js dependencies...
Node.js v18.17.0
npm v9.6.7
npm install completed

[Pipeline] stage
[Pipeline] { (Test)
Running automated tests...
🧪 Running Tests...
✅ Health Check - should return health status
✅ GET /api/students - should get all students
✅ POST /api/students - should create a new student
📊 Test Results: 15/15 passed
✅ All tests passed!

[Pipeline] stage
[Pipeline] { (Integration Tests)
Running integration tests...
✅ Integration tests passed

[Pipeline] post
Pipeline succeeded! ✅
```

---

## Quick Reference

### Common Jenkins URLs

- Dashboard: `http://localhost:8080`
- Job: `http://localhost:8080/job/student-management-api`
- Build: `http://localhost:8080/job/student-management-api/1`
- Console: `http://localhost:8080/job/student-management-api/1/console`

### Useful Commands

```bash
# Check Jenkins status
sudo systemctl status jenkins

# View Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Restart Jenkins
sudo systemctl restart jenkins
```

---

## Support

For issues or questions:
1. Check Jenkins console output
2. Review test logs
3. Verify GitHub repository access
4. Check Jenkins plugin versions

