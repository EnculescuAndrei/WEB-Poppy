import React, { useState } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentPage.css';

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    password: '',
  });

  const [nameError, setNameError] = useState(null);
  const [surnameError, setSurnameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!validateName(formData.name) || !validateSurname(formData.surname) || !validatePassword(formData.password)) {
        console.error('Form validation failed.');
        return;
      }

      const response = await fetch('http://localhost:7777/students/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newStudent = await response.json();
        console.log('New student created:', newStudent);

        navigate('/students/login');

      } else {
        console.error('Failed to create student');
        const errorData = await response.json();
        if (errorData && errorData.error === 'Username already exists') {
          setShowToast(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateName = (name) => {
    const isValid = name.length >= 1 && name.length <= 20;
    setNameError(isValid ? null : 'Name must be between 1 and 20 characters');
    return isValid;
  };

  const validateSurname = (surname) => {
    const isValid = surname.length >= 1 && surname.length <= 20;
    setSurnameError(isValid ? null : 'Surname must be between 1 and 20 characters');
    return isValid;
  };

  const validatePassword = (password) => {
    const isValid = password.length >= 6 && password.length <= 20 && /\d/.test(password);
    setPasswordError(isValid ? null : 'Password must be between 6 and 20 characters and contain at least 1 number');
    return isValid;
  };

  return (
    <div className="signup-container">
      <form>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => {
              handleChange(e);
              validateName(e.target.value);
            }}
          />
          {nameError && <span className="validation-label">{nameError}</span>}
        </div>
        <div className="form-group">
          <label>Surname</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={(e) => {
              handleChange(e);
              validateSurname(e.target.value);
            }}
          />
          {surnameError && <span className="validation-label">{surnameError}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => {
              handleChange(e);
              validatePassword(e.target.value);
            }}
          />
          {passwordError && <span className="validation-label">{passwordError}</span>}
        </div>
        <Button onClick={handleSubmit} color="SignUp" type="button">
          Sign Up
        </Button>

        <div
          className={`toast position-fixed bottom-0 end-0 mb-4 me-4 ${showToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Error</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">Username already exists</div>
        </div>

        <div className="text-center mt-3">
          <p>Already have an account? <a href="/students/login">Go to log in.</a></p>
        </div>
      </form>
    </div>
  );
};

export default StudentSignupPage;
