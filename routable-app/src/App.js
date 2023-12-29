import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import StudentPage from './components/StudentPage';
import ProfessorPage from './components/ProfessorPage';
import StudentLoginPage from './components/StudentPageLogIn';
import ProfessorLoginPage from './components/ProfessorPageLogIn';
import StudentHomePage from './components/StudentHomePage';
import ActivityManager from './components/Activities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students/signup" element={<StudentPage />} />
        <Route path="/professors/signup" element={<ProfessorPage />} />
        <Route path='/students/login' element={<StudentLoginPage/>}/>
        <Route path='/professors/login' element={<ProfessorLoginPage/>}/>
        <Route path='/student/activities' element={<StudentHomePage/>}/>
        <Route path='/professors/activities' element={<ActivityManager/>}/>
      </Routes>
    </Router>
  );
}

export default App;
