import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { activeTab, setActiveTab, currentUser, logout } = useContext(AppContext);

  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 28px',
      backgroundColor: 'var(--primary-color)',
      color: '#ffffff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="brand" style={{
        fontWeight: 'bold',
        fontSize: '1.35rem',
        cursor: 'pointer',
        letterSpacing: '0.5px'
      }} onClick={() => setActiveTab('dashboard')}>
        Dayflow HRMS
      </div>

      {currentUser && (
        <div className="nav-links" style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'dashboard' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: activeTab === 'dashboard' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '0.95rem',
              borderBottom: activeTab === 'dashboard' ? '3px solid var(--secondary-color)' : '3px solid transparent',
              padding: '6px 4px',
              transition: 'all 0.2s ease'
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'attendance' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: activeTab === 'attendance' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '0.95rem',
              borderBottom: activeTab === 'attendance' ? '3px solid var(--secondary-color)' : '3px solid transparent',
              padding: '6px 4px',
              transition: 'all 0.2s ease'
            }}
          >
            Attendance
          </button>

          <button
            onClick={() => setActiveTab('timeoff')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'timeoff' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: activeTab === 'timeoff' ? '600' : '400',
              cursor: 'pointer',
              fontSize: '0.95rem',
              borderBottom: activeTab === 'timeoff' ? '3px solid var(--secondary-color)' : '3px solid transparent',
              padding: '6px 4px',
              transition: 'all 0.2s ease'
            }}
          >
            Time Off
          </button>

          <div className="user-profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginLeft: '20px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
            paddingLeft: '20px'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {currentUser.name} <span style={{ opacity: 0.8, fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '12px', marginLeft: '6px' }}>{currentUser.role}</span>
            </span>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.color = '#ffffff';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
