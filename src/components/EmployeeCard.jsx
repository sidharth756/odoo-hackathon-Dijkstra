import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function EmployeeCard({ employee }) {
  const { getEmployeeStatus, setViewedEmployeeId, setCurrentTab } = useContext(AppContext);

  // Retrieve current status
  const status = getEmployeeStatus(employee.id);

  // Status dot styling
  const getStatusColor = () => {
    switch (status) {
      case 'Present':
        return 'var(--color-present)';
      case 'On Leave':
        return 'var(--color-on-leave)';
      case 'Absent':
      default:
        return 'var(--color-absent)';
    }
  };

  // Get initials — strip non-alpha chars (handles names like "Sidharth (Admin)")
  const getInitials = () => {
    const cleanName = employee.name.replace(/[^a-zA-Z ]/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'EM';
  };

  const handleCardClick = () => {
    setViewedEmployeeId(employee.id);
    setCurrentTab('profile');
  };

  return (
    <div className="employee-card card" onClick={handleCardClick}>
      {/* Top right status dot */}
      <span 
        className="card-status-dot" 
        style={{ backgroundColor: getStatusColor() }} 
        title={`Status: ${status}`}
      />

      <div className="card-avatar-container">
        {employee.avatar ? (
          <img src={employee.avatar} alt={employee.name} className="card-avatar-img" />
        ) : (
          <div className="card-avatar-placeholder">{getInitials()}</div>
        )}
      </div>

      <div className="card-info">
        <h3 className="card-name">{employee.name}</h3>
        <p className="card-id">{employee.id}</p>
        <p className="card-role">{employee.role === 'HR' ? 'HR Officer / Admin' : 'Employee'}</p>
        <p className="card-email">{employee.email}</p>
      </div>
    </div>
  );
}
