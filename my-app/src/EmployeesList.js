import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './EmployeesList.css';
const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('EmployeeID');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    fetch(`${api}/employees`)
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  };

  const sortedEmployees = [...employees]
    .filter(employee =>
      employee.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.LastName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(employees.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="employees-container">
      <h1>Employees List</h1>

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <table className="employees-table">
        <thead>
          <tr>
            <th><button onClick={() => handleSort('EmployeeID')}>ID</button></th>
            <th><button onClick={() => handleSort('LastName')}>Last Name</button></th>
            <th><button onClick={() => handleSort('FirstName')}>First Name</button></th>
            <th><button onClick={() => handleSort('BirthDate')}>Birth Date</button></th>
            <th>Photo</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map(employee => (
            <tr key={employee.EmployeeID}>
              <td>{employee.EmployeeID}</td>
              <td>{employee.LastName}</td>
              <td>{employee.FirstName}</td>
              <td>{new Date(employee.BirthDate).toLocaleDateString()}</td>
              <td><img src={employee.Photo} alt={`${employee.FirstName} ${employee.LastName}`} className="employee-photo" /></td>
              <td>{employee.Notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {employees.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {Math.ceil(employees.length / itemsPerPage)}</span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default EmployeesList;
