# Test Suite for Student Management API

This directory contains automated tests for the Student Management API.

## Running Tests Locally

### Prerequisites

1. Start the backend server:
```bash
npm start
# or
npm run server
```

The server should be running on `http://localhost:3000`

### Run Tests

```bash
npm test
```

### Test Output

Tests will display:
- ✅ Passed tests
- ❌ Failed tests with error messages
- 📊 Summary of test results
- 📄 JUnit XML report (test-results.xml)

## Test Coverage

The test suite covers:

### Health Check
- ✅ Health endpoint returns OK status

### GET Endpoints
- ✅ Get all students
- ✅ Get student by ID
- ✅ 404 error for non-existent student

### POST Endpoints
- ✅ Create new student
- ✅ Validation (missing fields)
- ✅ Duplicate email prevention

### PATCH Endpoints
- ✅ Update student (partial update)
- ✅ 404 error for non-existent student

### DELETE Endpoints
- ✅ Delete student
- ✅ 404 error for non-existent student

## Test Framework

The tests use a custom lightweight test framework that:
- Supports `describe`, `it`, `beforeEach`
- Provides `expect` assertions
- Generates JUnit XML for CI/CD integration
- Works with Node.js ES modules

## Integration with Jenkins

The tests are automatically run in the Jenkins pipeline:
1. Tests execute after build stage
2. Results are published as JUnit XML
3. Build fails if tests fail
4. Test results visible in Jenkins dashboard

## Troubleshooting

### Tests fail with "ECONNREFUSED"

**Solution:** Make sure the server is running on port 3000
```bash
npm start
```

### Tests timeout

**Solution:** Increase timeout or check server health
```bash
curl http://localhost:3000/api/health
```

### Port already in use

**Solution:** Use a different port or stop the existing server
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :3000
```

