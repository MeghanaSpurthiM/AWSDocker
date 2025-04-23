import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskManager from './components/TaskManager';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

fetch(`${API_BASE_URL}/api/students`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error fetching students:', error));

function App() {
  return (
    <Router>
      <Routes>
        {/* Set TaskManager as the default page */}
        <Route path="/" element={<TaskManager />} />
      </Routes>
    </Router>
  );
}

export default App;