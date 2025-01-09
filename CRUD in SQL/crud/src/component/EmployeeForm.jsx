import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    FName: '',
    LName: '',
    Mobile: '',
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Create a new FormData object
    const data = new FormData();
  
    // Append form fields to FormData
    data.append('FName', formData.FName);
    data.append('LName', formData.LName);
    data.append('Mobile', formData.Mobile);
  
  
    // Log FormData content for debugging
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  
    try {
      // Send the FormData using axios
      const response = await axios.post('http://localhost:3001/Emp/Create', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important: set the correct header for file upload
        },
      });
      console.log('Employee created:', response.data);
      // Optionally reset the form or take another action after success
    } catch (error) {
      console.error('Error creating employee:', error.response?.data || error.message);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            name="FName"
            value={formData.FName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            name="LName"
            value={formData.LName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            className="form-control"
            name="Mobile"
            value={formData.Mobile}
            onChange={handleChange}
            required
          />
        </div>
      
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
