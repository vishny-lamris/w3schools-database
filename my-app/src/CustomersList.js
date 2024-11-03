import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomersList.css';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('CustomerID');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    CustomerName: '', ContactName: '', Address: '', City: '', PostalCode: '', Country: ''
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editableCustomer, setEditableCustomer] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch(`${api}/customers`)
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching customers:', error));
  };

  const sortedCustomers = [...customers]
    .filter(customer => customer.CustomerName && customer.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

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
    if (currentPage < Math.ceil(customers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddCustomer = () => {
    fetch(`${api}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers([...customers, data]);
        setNewCustomer({ CustomerName: '', ContactName: '', Address: '', City: '', PostalCode: '', Country: '' });
      });
  };

  const handleEditCustomer = (id) => {
    setEditingCustomerId(id);
    const customerToEdit = customers.find(customer => customer.CustomerID === id);
    setEditableCustomer({ ...customerToEdit });
  };

  const handleSaveChanges = () => {
    fetch(`${api}/customers/${editableCustomer.CustomerID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editableCustomer),
    })
      .then((response) => response.json())
      .then((data) => {
        setCustomers(customers.map(cust => cust.CustomerID === editableCustomer.CustomerID ? data : cust));
        setEditingCustomerId(null);
        setEditableCustomer(null);
      });
  };

  const handleCancelEdit = () => {
    setEditingCustomerId(null);
    setEditableCustomer(null);
  };

  const handleDeleteCustomer = (id) => {
    fetch(`${api}/customers/${id}`, { method: 'DELETE' })
      .then(() => setCustomers(customers.filter(customer => customer.CustomerID !== id)));
  };

  return (
    <div className="customers-container">

      <h1>Customers List</h1>

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <button onClick={fetchCustomers} className="refresh-button">Refresh</button>

      <div className="add-customer">
        <input type="text" placeholder="Name" value={newCustomer.CustomerName} onChange={(e) => setNewCustomer({ ...newCustomer, CustomerName: e.target.value })} />
        <input type="text" placeholder="Contact Name" value={newCustomer.ContactName} onChange={(e) => setNewCustomer({ ...newCustomer, ContactName: e.target.value })} />
        <input type="text" placeholder="Address" value={newCustomer.Address} onChange={(e) => setNewCustomer({ ...newCustomer, Address: e.target.value })} />
        <input type="text" placeholder="City" value={newCustomer.City} onChange={(e) => setNewCustomer({ ...newCustomer, City: e.target.value })} />
        <input type="text" placeholder="Postal Code" value={newCustomer.PostalCode} onChange={(e) => setNewCustomer({ ...newCustomer, PostalCode: e.target.value })} />
        <input type="text" placeholder="Country" value={newCustomer.Country} onChange={(e) => setNewCustomer({ ...newCustomer, Country: e.target.value })} />
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>

      <table className="customers-table">
        <thead>
          <tr>
            <th><button onClick={() => handleSort('CustomerID')}>ID</button></th>
            <th><button onClick={() => handleSort('CustomerName')}>Name</button></th>
            <th><button onClick={() => handleSort('ContactName')}>Contact Name</button></th>
            <th><button onClick={() => handleSort('Address')}>Address</button></th>
            <th><button onClick={() => handleSort('City')}>City</button></th>
            <th><button onClick={() => handleSort('PostalCode')}>Postal Code</button></th>
            <th><button onClick={() => handleSort('Country')}>Country</button></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(customer => (
            <tr key={customer.CustomerID}>
              <td>{customer.CustomerID}</td>
              <td>{customer.CustomerName}</td>
              <td>{customer.ContactName}</td>
              <td>{customer.Address}</td>
              <td>{customer.City}</td>
              <td>{customer.PostalCode}</td>
              <td>{customer.Country}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer.CustomerID)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteCustomer(customer.CustomerID)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {customers.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {Math.ceil(customers.length / itemsPerPage)}</span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(customers.length / itemsPerPage)}>Next</button>
        </div>
      )}

      {editingCustomerId && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Customer</h2>
            <input type="text" placeholder="Name" value={editableCustomer.CustomerName} onChange={(e) => setEditableCustomer({ ...editableCustomer, CustomerName: e.target.value })} />
            <input type="text" placeholder="Contact Name" value={editableCustomer.ContactName} onChange={(e) => setEditableCustomer({ ...editableCustomer, ContactName: e.target.value })} />
            <input type="text" placeholder="Address" value={editableCustomer.Address} onChange={(e) => setEditableCustomer({ ...editableCustomer, Address: e.target.value })} />
            <input type="text" placeholder="City" value={editableCustomer.City} onChange={(e) => setEditableCustomer({ ...editableCustomer, City: e.target.value })} />
            <input type="text" placeholder="Postal Code" value={editableCustomer.PostalCode} onChange={(e) => setEditableCustomer({ ...editableCustomer, PostalCode: e.target.value })} />
            <input type="text" placeholder="Country" value={editableCustomer.Country} onChange={(e) => setEditableCustomer({ ...editableCustomer, Country: e.target.value })} />
            <button onClick={handleSaveChanges} className="save-button">Save</button>
            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersList;
