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

  // Get initials for profile picture placeholder
  const getInitials = () => {
    const nameParts = employee.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return employee.name.substring(0, 2).toUpperCase();
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
