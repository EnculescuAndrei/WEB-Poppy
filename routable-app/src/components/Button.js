import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css';

function Button({ children, onClick, color = 'primary', to, type = 'button' }) {
  const buttonClassName = `btn  custom-btn-${color}`;

  if (to) {
    return (
      <Link to={to} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
