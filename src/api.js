const API_BASE_URL = 'http://localhost:3000/api';

// API service functions
export const studentAPI = {
  // Get all students
  async getAllStudents() {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    const data = await response.json();
    return data.data;
  },

  // Get student by ID
  async getStudentById(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }
    const data = await response.json();
    return data.data;
  },

  // Create new student
  async createStudent(student) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create student');
    }
    const data = await response.json();
    return data.data;
  },

  // Update student
  async updateStudent(id, student) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update student');
    }
    const data = await response.json();
    return data.data;
  },

  // Delete student
  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete student');
    }
    const data = await response.json();
    return data.data;
  },
};

