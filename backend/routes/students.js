import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory data store (in production, use a database)
let students = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', age: 20, course: 'Computer Science' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', age: 22, course: 'Mathematics' },
  { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', age: 21, course: 'Physics' }
];

// GET /api/students - Get all students
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// GET /api/students/:id - Get a single student by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const student = students.find(s => s.id === id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// POST /api/students - Create a new student
router.post('/', (req, res) => {
  try {
    const { name, email, age, course } = req.body;

    // Validation
    if (!name || !email || !age || !course) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, age, and course'
      });
    }

    // Check if email already exists
    const existingStudent = students.find(s => s.email === email);
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Create new student
    const newStudent = {
      id: uuidv4(),
      name,
      email,
      age: parseInt(age),
      course
    };

    students.push(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
});

// PATCH /api/students/:id - Update a student (partial update)
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, course } = req.body;

    const studentIndex = students.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    // Update only provided fields
    const student = students[studentIndex];
    if (name) student.name = name;
    if (email) {
      // Check if email is being changed and if new email already exists
      if (email !== student.email) {
        const emailExists = students.find(s => s.email === email && s.id !== id);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Student with this email already exists'
          });
        }
        student.email = email;
      }
    }
    if (age) student.age = parseInt(age);
    if (course) student.course = course;

    students[studentIndex] = student;

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
});

// DELETE /api/students/:id - Delete a student
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const studentIndex = students.findIndex(s => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found`
      });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: deletedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
});

export default router;

