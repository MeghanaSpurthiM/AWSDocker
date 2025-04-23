import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaskManager component by default', () => {
  render(<App />);

  const taskManagerTitle = screen.getByText(/Task Manager/i);
  expect(taskManagerTitle).toBeInTheDocument();
});