import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { UsersIcon, CalendarIcon, PalmIcon, LogOutIcon } from './Icons';

export default function Navbar() {
  const { currentUser, currentTab, setCurrentTab, logout } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  // Render user initials — strip non-alpha chars (handles "Sidharth (Admin)")
  const getInitials = () => {
    const cleanName = currentUser.name.replace(/[^a-zA-Z ]/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'ME';
  };

  return (
    <header className="main-header glassmorphism">
      <div className="header-container">
        {/* Brand/Logo */}
        <div className="brand" onClick={() => setCurrentTab('dashboard')}>
          <div className="logo-icon">D</div>
          <span className="logo-text">Dayflow</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dashboard')}
          >
            <UsersIcon size={16} className="nav-icon" />
            <span>Employees</span>
          </button>
          <button
            className={`nav-item ${currentTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentTab('attendance')}
          >
            <CalendarIcon size={16} className="nav-icon" />
            <span>Attendance</span>
          </button>
          <button
            className={`nav-item ${currentTab === 'timeoff' ? 'active' : ''}`}
            onClick={() => setCurrentTab('timeoff')}
          >
            <PalmIcon size={16} className="nav-icon" />
            <span>Time Off</span>
          </button>
        </nav>

        {/* Profile Dropdown */}
        <div className="profile-container" ref={dropdownRef}>
          <button
            className="avatar-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{getInitials()}</div>
            )}
            <span className="profile-dot" style={{
              backgroundColor: 'var(--color-present)' // Active user is always present
            }} />
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown card">
              <div className="dropdown-user-info">
                <p className="user-name">{currentUser.name}</p>
                <p className="user-email">{currentUser.email}</p>
                <p className="user-role">{currentUser.role === 'HR' ? 'Admin / HR' : 'Employee'}</p>
              </div>
              <hr className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  setCurrentTab('profile');
                  setDropdownOpen(false);
                }}
              >
                <UsersIcon size={14} className="dropdown-icon" />
                <span>My Profile</span>
              </button>
              <button
                className="dropdown-item text-danger"
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
              >
                <LogOutIcon size={14} className="dropdown-icon" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
