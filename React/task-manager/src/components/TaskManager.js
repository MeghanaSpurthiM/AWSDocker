import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', age: '', course: '' });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'http://localhost:3000/api';
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setTasks(response.data.studentsData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/students`, formData);
      fetchTasks();
      setFormData({ id: '', name: '', email: '', age: '', course: '' });
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/student/${formData.id}`, formData);
      fetchTasks();
      setFormData({ id: '', name: '', email: '', age: '', course: '' });
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/student/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setFormData(task);
    setIsEditing(true);
  };

  const handleHomeClick = () => {
    setFormData({ id: '', name: '', email: '', age: '', course: '' }); // Reset form data
    setIsEditing(false); // Exit editing mode
    navigate('/'); // Navigate to the "Create Task" form
  };

  return (
    <div className="task-manager">
      <h1 className="title">Task Manager</h1>

      {/* Home Icon */}
      <button onClick={handleHomeClick} className="home-icon">
        🏠
      </button>

      {/* Task Form */}
      <form className="task-form" onSubmit={isEditing ? handleUpdate : handleCreate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </form>

      {/* Task List */}
      <table className="task-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.email}</td>
              <td>{task.age}</td>
              <td>{task.course}</td>
              <td>
                <button onClick={() => handleEdit(task)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(task.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManager;