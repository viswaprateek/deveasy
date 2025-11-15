# Student Management API

A simple RESTful CRUD API for managing students built with Node.js and Express.

## 🐳 Docker Support

This API is containerized and ready for Docker deployment. See [DOCKER.md](../DOCKER.md) for complete Docker instructions including:
- Building Docker images
- Running containers with port mapping
- Pushing to Docker Hub
- Pulling and running on other systems

## Features

- **GET** - Retrieve all students or a specific student by ID
- **POST** - Create a new student
- **PATCH** - Update an existing student (partial update)
- **DELETE** - Delete a student

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

Start the backend server:
```bash
npm run server
# or
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /api/health
```
Returns server status.

### Get All Students
```
GET /api/students
```
**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 20,
      "course": "Computer Science"
    }
  ]
}
```

### Get Student by ID
```
GET /api/students/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 20,
    "course": "Computer Science"
  }
}
```

### Create Student
```
POST /api/students
```
**Request Body:**
```json
{
  "name": "Alice Brown",
  "email": "alice.brown@example.com",
  "age": 19,
  "course": "Engineering"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "uuid-generated-id",
    "name": "Alice Brown",
    "email": "alice.brown@example.com",
    "age": 19,
    "course": "Engineering"
  }
}
```

### Update Student (PATCH)
```
PATCH /api/students/:id
```
**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "age": 21
}
```
**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": "1",
    "name": "John Updated",
    "email": "john.doe@example.com",
    "age": 21,
    "course": "Computer Science"
  }
}
```

### Delete Student
```
DELETE /api/students/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 20,
    "course": "Computer Science"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide name, email, age, and course"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Student with ID {id} not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Student with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Testing with cURL

### Get all students
```bash
curl http://localhost:3000/api/students
```

### Get student by ID
```bash
curl http://localhost:3000/api/students/1
```

### Create a student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Brown","email":"alice@example.com","age":19,"course":"Engineering"}'
```

### Update a student
```bash
curl -X PATCH http://localhost:3000/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"age":21}'
```

### Delete a student
```bash
curl -X DELETE http://localhost:3000/api/students/1
```

## Notes

- The API uses an in-memory data store for simplicity. Data will be lost when the server restarts.
- For production use, integrate with a database (MongoDB, PostgreSQL, MySQL, etc.).
- The API includes CORS support for cross-origin requests.
- Email addresses must be unique across all students.

