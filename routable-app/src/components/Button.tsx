// Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

interface Props {
  children: string;
  color?: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

function Button({ children, onClick, color = 'primary', to, type = 'button' }: Props) {
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
