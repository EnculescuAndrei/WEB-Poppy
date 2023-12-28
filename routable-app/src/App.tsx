// App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import StudentPage from './StudentPage';
import TeacherPage from './TeacherPage';

import StudentLoginPage from './StudentPageLogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students/signup" element={<StudentPage />} />
        <Route path="/teachers/signup" element={<TeacherPage />} />
        <Route path='/students/login' element={<StudentLoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
