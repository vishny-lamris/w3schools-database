import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomersList from './CustomersList';
import CategoriesList from './CategoriesList';
import EmployeesList from './EmployeesList';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h2>Shipping Company</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/customers">Customers</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/employees">Employees</Link></li> {/* New link to Employees */}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to My App</h1>} />
        <Route path="/customers" element={<CustomersList />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/employees" element={<EmployeesList />} /> {/* New route for EmployeesList */}
      </Routes>
    </Router>
  );
}

export default App;
