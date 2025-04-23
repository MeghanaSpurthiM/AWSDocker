const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('API Routes', () => {
  let studentId; // Variable to store the ID of a created student

  // Create a test student before each test
  beforeEach(async () => {
    const newStudent = {
      name: 'Test Student',
      email: `test.student.${Date.now()}@example.com`, // Generate a unique email
      age: 20,
      course: 'Test Course',
    };

    const res = await request(app).post('/api/students').send(newStudent);
    console.log(res.body); // Log the response body to confirm its structure
    studentId = res.body.id; // Assign the 'id' from the response to the 'studentId' variable
  });

  // Clean up the test student after each test
  afterEach(async () => {
    await request(app).delete(`/api/student/${studentId}`);
  });

  // Test for GET /ping
  describe('GET /ping', () => {
    it('should return pong', async () => {
      const res = await request(app).get('/ping');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'pong');
    });
  });

  // Test for GET /students
  describe('GET /api/students', () => {
    it('should return a list of students', async () => {
      const res = await request(app).get('/api/students');
      expect(res.statusCode).toEqual(201); // Expect 200 OK
      expect(res.body).toHaveProperty('studentsData'); // Check if the response has a 'studentsData' property
      expect(res.body.studentsData).toBeInstanceOf(Array); // Check if 'studentsData' is an array
      expect(res.body.studentsData.length).toBeGreaterThan(0); // Ensure the array is not empty
    });
  });

  describe('POST /api/students', () => {
    it('should create a new student and return its ID', async () => {
      const uniqueEmail = `john.doe.${Date.now()}@example.com`; // Generate a unique email
      const newStudent = {
        name: 'John Doe',
        email: uniqueEmail,
        age: 22,
        course: 'Computer Science',
      };

      const res = await request(app).post('/api/students').send(newStudent);
      expect(res.statusCode).toEqual(201); // Expect 201 Created
      expect(res.body).toHaveProperty('id'); // Check if the response includes the 'id' property
      expect(typeof res.body.id).toBe('number'); // Ensure the 'id' is a number
    });
  });

  // Test for PUT /students/:id
  describe('PUT /api/student/:id', () => {
    it('should update an existing student and return a success message', async () => {
      const updatedStudent = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        age: 23,
        course: 'Mathematics',
      };

      const res = await request(app).put(`/api/student/${studentId}`).send(updatedStudent);
      console.log(res.body); // Log the response body to inspect its structure
      expect(res.statusCode).toEqual(200); // Assuming 200 OK
      expect(res.body).toHaveProperty('message', 'Student record replaced successfully'); // Check if the response includes the success message
    });
  });

  // Test for PATCH /students/:id
  describe('PATCH /api/student/:id', () => {
    it('should partially update an existing student and return a success message', async () => {
      const partialUpdate = {
        course: 'Physics',
      };

      const res = await request(app).patch(`/api/student/${studentId}`).send(partialUpdate);
      console.log(res.body); // Log the response body to inspect its structure
      expect(res.statusCode).toEqual(200); // Assuming 200 OK
      expect(res.body).toHaveProperty('message', 'Student updated successfully'); // Check if the response includes the success message
    });
  });

  // Test for DELETE /students/:id
  describe('DELETE /api/student/:id', () => {
    it('should delete a student', async () => {
      const res = await request(app).delete(`/api/student/${studentId}`);
      expect(res.statusCode).toEqual(200); // Assuming 200 OK
      expect(res.body).toHaveProperty('message', 'Student deleted successfully'); // Adjust based on your API response
    });
  });

  // Test for GET /student/:id
  describe('GET /api/student/:id', () => {
    it('should return a student by ID', async () => {
      const res = await request(app).get(`/api/student/${studentId}`);
      console.log(res.body); // Log the response body to inspect its structure
      expect(res.statusCode).toEqual(201); // Assuming 200 OK
      expect(res.body).toHaveProperty('studentData'); // Check if the response has a 'studentData' property
      expect(res.body.studentData).toMatchObject({
        id: studentId,
        name: 'Test Student',
        email: expect.any(String), // Ensure email is a string
        age: 20,
        course: 'Test Course',
      });
    });
  });
});