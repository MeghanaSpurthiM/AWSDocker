const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');

// Allow requests from React frontend
app.use(cors({}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/api/students', (req, res) => {
  try {
    const studentsData = db.prepare('SELECT * FROM students').all();
    res.status(201).json({ studentsData});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/student/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const studentData = await db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.status(201).json({ studentData});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', (req, res) => {
  const { name, email, age, course } = req.body;
  if(!name || !email || !age || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const stmt = db.prepare('INSERT INTO students (name, email, age, course) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, age, course);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/student/:id', (req, res) => {
  const { id } = req.params;
  try {
    const deletedData = db.prepare('DELETE FROM students WHERE id = ?').run(id);
    if (deletedData.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/student/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age, course } = req.body;

  // Build the query dynamically based on provided fields
  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (age) {
    fields.push('age = ?');
    values.push(age);
  }
  if (course) {
    fields.push('course = ?');
    values.push(course);
  }

  // If no fields are provided, return a bad request error
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  // Add the id to the values array for the WHERE clause
  values.push(id);

  try {
    const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    const info = stmt.run(...values);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/student/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age, course } = req.body;


  try {
    // Check if the student exists
    const studentExists = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!studentExists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Replace the student's record
    const stmt = db.prepare('UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?');
    stmt.run(name, email, age, course, id);

    res.status(200).json({ message: 'Student record replaced successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define the default port
const DEFAULT_PORT = 3000;
app.listen(DEFAULT_PORT, () => {
  console.log(`Server is running on port ${DEFAULT_PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${DEFAULT_PORT} is busy. Trying another port...`);
    server.listen(0, () => {
      const newPort = server.address().port;
      console.log(`Server is now running on port ${newPort}`);
    });
  } else {
    console.error('Error starting the server:', err);
  }
});

module.exports = app;