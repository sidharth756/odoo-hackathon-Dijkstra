import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import EmployeeCard from '../components/EmployeeCard';
import CheckInWidget from '../components/CheckInWidget';
import { SearchIcon, FileTextIcon } from '../components/Icons';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { employees, currentUser } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

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
            <p className="directory-count">Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}</p>
          </div>
          
          {/* Search bar */}
          <div className="search-bar-container">
            <SearchIcon className="search-input-icon" size={16} />
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
            <FileTextIcon size={48} className="no-results-svg-icon" style={{ opacity: 0.5, color: 'var(--text-muted)' }} />
            <h3>No employees found</h3>
            <p>We couldn't find any results matching "{searchQuery}". Please check the spelling or try a different query.</p>
          </div>
        )}
      </section>
    </div>
  );
}
