import './style.css';
import { studentAPI } from './api.js';

let students = [];
let editingStudentId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  loadStudents();
});

// Render main app structure
function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🎓 Student Management System</h1>
        <p class="subtitle">Manage your students with ease</p>
      </header>

      <div class="main-content">
        <div class="form-section">
          <h2>${editingStudentId ? 'Edit Student' : 'Add New Student'}</h2>
          <form id="studentForm">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" id="name" name="name" required placeholder="Enter student name">
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" required placeholder="Enter email address">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="age">Age *</label>
                <input type="number" id="age" name="age" required min="1" max="150" placeholder="Age">
              </div>
              <div class="form-group">
                <label for="course">Course *</label>
                <input type="text" id="course" name="course" required placeholder="Enter course">
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                ${editingStudentId ? 'Update Student' : 'Add Student'}
              </button>
              ${editingStudentId ? '<button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>' : ''}
            </div>
          </form>
          <div id="message" class="message"></div>
        </div>

        <div class="students-section">
          <div class="section-header">
            <h2>Students List</h2>
            <span class="badge" id="studentCount">0 students</span>
          </div>
          <div id="loading" class="loading">Loading students...</div>
          <div id="studentsList" class="students-list"></div>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  document.getElementById('studentForm').addEventListener('submit', handleFormSubmit);
  if (editingStudentId) {
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
  }
}

// Load all students
async function loadStudents() {
  const loadingEl = document.getElementById('loading');
  const studentsListEl = document.getElementById('studentsList');
  const studentCountEl = document.getElementById('studentCount');

  try {
    loadingEl.style.display = 'block';
    studentsListEl.innerHTML = '';
    
    students = await studentAPI.getAllStudents();
    
    loadingEl.style.display = 'none';
    studentCountEl.textContent = `${students.length} ${students.length === 1 ? 'student' : 'students'}`;
    
    if (students.length === 0) {
      studentsListEl.innerHTML = '<div class="empty-state">No students found. Add your first student above!</div>';
    } else {
      renderStudentsList();
    }
  } catch (error) {
    loadingEl.style.display = 'none';
    showMessage('Error loading students: ' + error.message, 'error');
    studentsListEl.innerHTML = `<div class="error-state">Failed to load students. Make sure the backend server is running on port 3000.</div>`;
  }
}

// Render students list
function renderStudentsList() {
  const studentsListEl = document.getElementById('studentsList');
  
  studentsListEl.innerHTML = students.map(student => `
    <div class="student-card" data-id="${student.id}">
      <div class="student-info">
        <h3>${student.name}</h3>
        <p class="student-email">📧 ${student.email}</p>
        <div class="student-details">
          <span class="detail-badge">Age: ${student.age}</span>
          <span class="detail-badge">Course: ${student.course}</span>
        </div>
      </div>
      <div class="student-actions">
        <button class="btn btn-edit" onclick="editStudent('${student.id}')" title="Edit">
          ✏️ Edit
        </button>
        <button class="btn btn-delete" onclick="deleteStudent('${student.id}')" title="Delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  `).join('');
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  const messageEl = document.getElementById('message');
  messageEl.textContent = '';
  messageEl.className = 'message';

  const formData = new FormData(e.target);
  const studentData = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age'),
    course: formData.get('course'),
  };

  try {
    if (editingStudentId) {
      await studentAPI.updateStudent(editingStudentId, studentData);
      showMessage('Student updated successfully!', 'success');
    } else {
      await studentAPI.createStudent(studentData);
      showMessage('Student added successfully!', 'success');
    }
    
    e.target.reset();
    editingStudentId = null;
    renderApp();
    loadStudents();
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
}

// Edit student
window.editStudent = async function(id) {
  try {
    const student = await studentAPI.getStudentById(id);
    editingStudentId = id;
    
    // Re-render form with student data
    renderApp();
    
    // Populate form fields
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
    document.getElementById('course').value = student.course;
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading student: ' + error.message, 'error');
  }
};

// Delete student
window.deleteStudent = async function(id) {
  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }

  try {
    await studentAPI.deleteStudent(id);
    showMessage('Student deleted successfully!', 'success');
    loadStudents();
  } catch (error) {
    showMessage('Error deleting student: ' + error.message, 'error');
  }
};

// Cancel edit
function cancelEdit() {
  editingStudentId = null;
  renderApp();
  document.getElementById('studentForm').reset();
}

// Show message
function showMessage(text, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message message-${type}`;
  
  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 5000);
}
