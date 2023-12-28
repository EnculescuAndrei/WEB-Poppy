// HomePage.tsx
import React from 'react';
import Button from './components/Button';

function HomePage() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mt-4 mb-4">What are you?</h1>
      <div className="d-flex">
        <Button to="/students/signup" color="students">
          Student
        </Button>
        <Button to="/professors/signup" color="professors">
          Professor
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
