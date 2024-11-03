import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CategoriesList.css';

const api = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('CategoryID');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState({
    CategoryName: '', Description: ''
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editableCategory, setEditableCategory] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${api}/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  };

  const sortedCategories = [...categories]
    .filter(category => category.CategoryName && category.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);

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
    if (currentPage < Math.ceil(categories.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddCategory = () => {
    fetch(`${api}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories([...categories, data]);
        setNewCategory({ CategoryName: '', Description: '' });
      });
  };

  const handleEditCategory = (id) => {
    setEditingCategoryId(id);
    const categoryToEdit = categories.find(category => category.CategoryID === id);
    setEditableCategory({ ...categoryToEdit });
  };

  const handleSaveChanges = () => {
    fetch(`${api}/categories/${editableCategory.CategoryID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editableCategory),
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(categories.map(cat => cat.CategoryID === editableCategory.CategoryID ? data : cat));
        setEditingCategoryId(null);
        setEditableCategory(null);
      });
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditableCategory(null);
  };

  const handleDeleteCategory = (id) => {
    fetch(`${api}/categories/${id}`, { method: 'DELETE' })
      .then(() => setCategories(categories.filter(category => category.CategoryID !== id)));
  };

  return (
    <div className="categories-container">

      <h1>Categories List</h1>

      <input
        type="text"
        placeholder="Search by category name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <button onClick={fetchCategories} className="refresh-button">Refresh</button>

      <div className="add-category">
        <input type="text" placeholder="Category Name" value={newCategory.CategoryName} onChange={(e) => setNewCategory({ ...newCategory, CategoryName: e.target.value })} />
        <input type="text" placeholder="Description" value={newCategory.Description} onChange={(e) => setNewCategory({ ...newCategory, Description: e.target.value })} />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th><button onClick={() => handleSort('CategoryID')}>ID</button></th>
            <th><button onClick={() => handleSort('CategoryName')}>Category Name</button></th>
            <th><button onClick={() => handleSort('Description')}>Description</button></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map(category => (
            <tr key={category.CategoryID}>
              <td>{category.CategoryID}</td>
              <td>{category.CategoryName}</td>
              <td>{category.Description}</td>
              <td>
                <button onClick={() => handleEditCategory(category.CategoryID)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteCategory(category.CategoryID)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length > itemsPerPage && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {Math.ceil(categories.length / itemsPerPage)}</span>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(categories.length / itemsPerPage)}>Next</button>
        </div>
      )}

      {editingCategoryId && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Category</h2>
            <input type="text" placeholder="Category Name" value={editableCategory.CategoryName} onChange={(e) => setEditableCategory({ ...editableCategory, CategoryName: e.target.value })} />
            <input type="text" placeholder="Description" value={editableCategory.Description} onChange={(e) => setEditableCategory({ ...editableCategory, Description: e.target.value })} />
            <button onClick={handleSaveChanges} className="save-button">Save</button>
            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesList;
