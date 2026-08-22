import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import EmployeeCard from '../components/EmployeeCard';
import CheckInWidget from '../components/CheckInWidget';
<<<<<<< HEAD
import { UserPlusIcon, SearchIcon, UsersIcon, CloseIcon } from '../components/Icons';
=======
import { SearchIcon, FileTextIcon } from '../components/Icons';
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
import '../styles/dashboard.css';

export default function Dashboard() {
  const { 
    employees, 
    currentUser, 
    createEmployeeByAdmin, 
    showNotification 
  } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRole, setAddRole] = useState('Employee');

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query)
    );
  });

  // Get current date string
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();

    const nameVal = addName.trim();
    const emailVal = addEmail.trim().toLowerCase();
    const phoneVal = addPhone.trim();

    if (!nameVal) {
      showNotification('Full Name is required.', 'error');
      return;
    }

    if (!emailVal) {
      showNotification('Email Address is required.', 'error');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Check uniqueness
    const emailExists = employees.some(emp => emp.email.toLowerCase() === emailVal);
    if (emailExists) {
      showNotification('An employee with this email already exists.', 'error');
      return;
    }

    try {
      const newEmp = createEmployeeByAdmin({
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        role: addRole
      });

      showNotification(`Employee added successfully! Generated ID: ${newEmp.id}`, 'success');
      
      // Reset form states
      setAddName('');
      setAddEmail('');
      setAddPhone('');
      setAddRole('Employee');
      setIsAddModalOpen(false);
    } catch (err) {
      showNotification(err.message || 'Failed to create employee.', 'error');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Welcome section */}
      <section className="dashboard-hero-section">
        <div className="welcome-text-container">
          <h1 className="dashboard-welcome">Hello, {currentUser?.name}!</h1>
          <p className="dashboard-date">{getCurrentDate()}</p>
        </div>
        
        {/* Dynamic Check In/Out widget (Assigned to Shebha) */}
        <div className="dashboard-widget-container">
          <CheckInWidget />
        </div>
      </section>

      {/* Employee Directory Section */}
      <section className="directory-section card">
        <div className="directory-header">
          <div className="directory-title-container">
            <h2 className="directory-title">Employee Directory</h2>
            <div className="directory-actions-row">
              <p className="directory-count">Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</p>
              {currentUser?.role === 'HR' && (
                <button 
                  className="profile-btn btn-save btn-add-employee" 
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <UserPlusIcon size={14} style={{ marginRight: '6px' }} /> Add Employee
                </button>
              )}
            </div>
          </div>
          
          {/* Search bar */}
          <div className="search-bar-container">
<<<<<<< HEAD
            <span className="search-icon"><SearchIcon size={16} /></span>
=======
            <SearchIcon className="search-input-icon" size={16} />
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {filteredEmployees.length > 0 ? (
          <div className="directory-grid">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        ) : (
          <div className="no-results">
<<<<<<< HEAD
            <div className="no-results-icon"><UsersIcon size={48} color="var(--text-muted)" /></div>
=======
            <FileTextIcon size={48} className="no-results-svg-icon" style={{ opacity: 0.5, color: 'var(--text-muted)' }} />
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
            <h3>No employees found</h3>
            <p>We couldn't find any results matching "{searchQuery}". Please check the spelling or try a different query.</p>
          </div>
        )}
      </section>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glassmorphism" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><UserPlusIcon size={20} style={{ marginRight: '8px' }} /> Add New Employee</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}><CloseIcon size={18} /></button>
            </div>
            
            <form onSubmit={handleAddEmployeeSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="add-name">Full Name *</label>
                <input
                  id="add-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-email">Email Address *</label>
                <input
                  id="add-email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-phone">Phone Number</label>
                <input
                  id="add-phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-role">Designated Role *</label>
                <select
                  id="add-role"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  required
                >
                  <option value="Employee">Regular Employee</option>
                  <option value="HR">HR Officer / Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="profile-btn btn-save">Create Employee</button>
                <button type="button" className="profile-btn btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
