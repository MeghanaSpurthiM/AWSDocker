const Database = require('better-sqlite3');
const db = new Database('./students.db');

// Create table if it doesn't exist
db.prepare(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  age INTEGER,
  course TEXT
)`).run();

module.exports = db;
