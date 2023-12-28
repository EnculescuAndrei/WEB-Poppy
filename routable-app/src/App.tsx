// App.tsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import StudentPage from './StudentPage';
import ProfessorPage from './ProfessorPage';

import StudentLoginPage from './StudentPageLogIn';
import ProfessorLoginPage from './ProfessorPageLogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students/signup" element={<StudentPage />} />
        <Route path="/professors/signup" element={<ProfessorPage />} />
        <Route path='/students/login' element={<StudentLoginPage/>}/>
        <Route path='/professors/login' element={<ProfessorLoginPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
