import React, { useState } from 'react';
import Button from './components/Button';
import './StudentPageLogIn.css';

interface LoginFormData {
  username: string;
  password: string;
}

const ProfessorLoginPage = () => {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      if (!validateUsername(loginFormData.username) || !validatePassword(loginFormData.password)) {
        console.error('Form validation failed.');
        return;
      }

      const response = await fetch('http://localhost:7777/professors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginFormData),
      });

      if (response.ok) {
        //Redirect to inserting code page
        console.log('Login successful');
      } else {
        //Toast de eroare
        console.error('Failed to log in');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const validateUsername = (username: string) => {
    const isValid = username.length > 0;
    setUsernameError(isValid ? null : 'Username is required');
    return isValid;
  };

  const validatePassword = (password: string) => {
    const isValid = password.length > 0;
    setPasswordError(isValid ? null : 'Password is required');
    return isValid;
  };

  return (
    <div className="login-container">
      <form>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={loginFormData.username}
            onChange={(e) => {
              handleChange(e);
              validateUsername(e.target.value);
            }}
          />
          {usernameError && <span className="validation-label">{usernameError}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginFormData.password}
            onChange={(e) => {
              handleChange(e);
              validatePassword(e.target.value);
            }}
          />
          {passwordError && <span className="validation-label">{passwordError}</span>}
        </div>
        <Button onClick={handleLogin} color="SignUp-Professor" type="button">
          Log In
        </Button>

        <div className="text-center mt-3">
          <p>Don't have an account? <a href="/professors/signup">Sign Up</a></p>
        </div>
      </form>
    </div>
  );
};

export default ProfessorLoginPage;
