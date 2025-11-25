import { describe, it, expect, beforeEach } from './test-framework.js';
import http from 'http';

const API_BASE_URL = 'http://localhost:3000/';

// Simple test framework implementation
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

describe('Student Management API Tests', () => {
  let testStudentId = null;
  let createdStudents = [];

  beforeEach(async () => {
    // Clean up: delete any test students created
    for (const id of createdStudents) {
      try {
        await makeRequest('DELETE', `api/students/${id}`);
      } catch (e) {
        // Ignore errors
      }
    }
    createdStudents = [];
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await makeRequest('GET', 'api/health');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('GET /api/students', () => {
    it('should get all students', async () => {
      const response = await makeRequest('GET', 'api/students');
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return students with correct structure', async () => {
      const response = await makeRequest('GET', 'api/students');
      expect(response.statusCode).toBe(200);
      if (response.body.data.length > 0) {
        const student = response.body.data[0];
        expect(student).toHaveProperty('id');
        expect(student).toHaveProperty('name');
        expect(student).toHaveProperty('email');
        expect(student).toHaveProperty('age');
        expect(student).toHaveProperty('course');
      }
    });
  });

  describe('GET /api/students/:id', () => {
    it('should get a student by ID', async () => {
      // First get all students to get a valid ID
      const allResponse = await makeRequest('GET', 'api/students');
      if (allResponse.body.data.length > 0) {
        const studentId = allResponse.body.data[0].id;
        const response = await makeRequest('GET', `api/students/${studentId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(studentId);
      }
    });

    it('should return 404 for non-existent student', async () => {
      const response = await makeRequest('GET', 'api/students/non-existent-id-12345');
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/students', () => {
    it('should create a new student', async () => {
      const newStudent = {
        name: 'Test Student',
        email: `test-${Date.now()}@example.com`,
        age: 20,
        course: 'Test Course',
      };

      const response = await makeRequest('POST', 'api/students', newStudent);
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newStudent.name);
      expect(response.body.data.email).toBe(newStudent.email);

      testStudentId = response.body.data.id;
      createdStudents.push(testStudentId);
    });

    it('should reject student with missing fields', async () => {
      const incompleteStudent = {
        name: 'Incomplete Student',
        // Missing email, age, course
      };

      const response = await makeRequest('POST', 'api/students', incompleteStudent);
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email', async () => {
      const student1 = {
        name: 'Student One',
        email: `duplicate-${Date.now()}@example.com`,
        age: 20,
        course: 'Course 1',
      };

      // Create first student
      const response1 = await makeRequest('POST', 'api/students', student1);
      expect(response1.statusCode).toBe(201);
      const studentId1 = response1.body.data.id;
      createdStudents.push(studentId1);

      // Try to create second student with same email
      const response2 = await makeRequest('POST', 'api/students', student1);
      expect(response2.statusCode).toBe(409);
      expect(response2.body.success).toBe(false);
    });
  });

  describe('PATCH /api/students/:id', () => {
    it('should update a student', async () => {
      // Create a student first
      const newStudent = {
        name: 'Update Test Student',
        email: `update-${Date.now()}@example.com`,
        age: 20,
        course: 'Original Course',
      };

      const createResponse = await makeRequest('POST', 'api/students', newStudent);
      expect(createResponse.statusCode).toBe(201);
      const studentId = createResponse.body.data.id;
      createdStudents.push(studentId);

      // Update the student
      const updateData = {
        name: 'Updated Name',
        age: 21,
      };

      const updateResponse = await makeRequest('PATCH', `api/students/${studentId}`, updateData);
      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.name).toBe('Updated Name');
      expect(updateResponse.body.data.age).toBe(21);
      expect(updateResponse.body.data.course).toBe('Original Course'); // Should remain unchanged
    });

    it('should return 404 for non-existent student', async () => {
      const updateData = { name: 'Updated Name' };
      const response = await makeRequest('PATCH', 'api/students/non-existent-id-12345', updateData);
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      // Create a student first
      const newStudent = {
        name: 'Delete Test Student',
        email: `delete-${Date.now()}@example.com`,
        age: 20,
        course: 'Test Course',
      };

      const createResponse = await makeRequest('POST', 'api/students', newStudent);
      expect(createResponse.statusCode).toBe(201);
      const studentId = createResponse.body.data.id;

      // Delete the student
      const deleteResponse = await makeRequest('DELETE', `api/students/${studentId}`);
      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // Verify student is deleted
      const getResponse = await makeRequest('GET', `api/students/${studentId}`);
      expect(getResponse.statusCode).toBe(404);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await makeRequest('DELETE', 'api/students/non-existent-id-12345');
      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});

