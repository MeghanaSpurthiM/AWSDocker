module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Use babel-jest to transform JavaScript and JSX files
    },
    transformIgnorePatterns: [
      '/node_modules/(?!react-router-dom)', // Ensure react-router-dom is transformed
    ],
    testEnvironment: 'jsdom', // Use jsdom for testing React components
  };