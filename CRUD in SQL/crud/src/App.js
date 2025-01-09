import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import EmployeeList from './component/EmployeeList';
import EmployeeForm from './component/EmployeeForm';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/create" element={<EmployeeForm />} />
      </Routes>
    </Router>
  );
};

export default App;
