import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/dashboard.css';

export default function CheckInWidget() {
  const { currentUser, attendance, checkIn, checkOut } = useContext(AppContext);
  const [time, setTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's log filter
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = attendance.find(
    (a) => a.employeeId === currentUser?.id && a.date === todayStr
  );

  // Compute elapsed time if checked in but not checked out
  useEffect(() => {
    if (todayLog && todayLog.checkIn && !todayLog.checkOut) {
      const calculateElapsed = () => {
        const [inH, inM] = todayLog.checkIn.split(':').map(Number);
        const now = new Date();
        const checkInDate = new Date();
        checkInDate.setHours(inH, inM, 0, 0);

        const diffMs = now - checkInDate;
        if (diffMs < 0) {
          setElapsedTime('00:00:00');
          return;
        }
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      };

      calculateElapsed();
      const interval = setInterval(calculateElapsed, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime('00:00:00');
    }
  }, [todayLog]);

  const handleCheckIn = () => {
    const hrs = String(time.getHours()).padStart(2, '0');
    const mins = String(time.getMinutes()).padStart(2, '0');
    checkIn(currentUser.id, `${hrs}:${mins}`);
  };

  const handleCheckOut = () => {
    const hrs = String(time.getHours()).padStart(2, '0');
    const mins = String(time.getMinutes()).padStart(2, '0');
    checkOut(currentUser.id, `${hrs}:${mins}`);
  };

  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="checkin-card" style={{
      background: 'var(--card-background)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {formattedDate}
      </h3>
      <h2 style={{ margin: '0 0 24px', fontSize: '2.2rem', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'monospace' }}>
        {formattedTime}
      </h2>

      {/* Connection State indicator */}
      {!todayLog ? (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--danger)', marginRight: '8px' }}></div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Not Checked In</span>
        </div>
      ) : todayLog.checkIn && !todayLog.checkOut ? (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)', marginRight: '8px', animation: 'pulse 1.5s infinite' }}></div>
          <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: '600' }}>Active Session</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '8px 0', color: 'var(--primary-color)', fontFamily: 'monospace' }}>
            {elapsedTime}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Checked in at {todayLog.checkIn}</span>
        </div>
      ) : (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', marginRight: '8px' }}></div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Shift Completed</span>
          <div style={{ margin: '12px 0 0', display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Check In</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{todayLog.checkIn}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Check Out</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{todayLog.checkOut}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hours</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>{todayLog.workHours} hrs</strong>
            </div>
          </div>
        </div>
      )}

      {/* Button controls */}
      {!todayLog ? (
        <button
          onClick={handleCheckIn}
          style={{
            background: 'var(--primary-color)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 10px rgba(113,75,103,0.2)'
          }}
          onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
          onMouseLeave={(e) => e.target.style.filter = 'none'}
        >
          Check In
        </button>
      ) : todayLog.checkIn && !todayLog.checkOut ? (
        <button
          onClick={handleCheckOut}
          style={{
            background: 'var(--secondary-color)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 10px rgba(1,160,157,0.2)'
          }}
          onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
          onMouseLeave={(e) => e.target.style.filter = 'none'}
        >
          Check Out
        </button>
      ) : (
        <button
          disabled
          style={{
            background: 'var(--border-color)',
            color: 'var(--text-secondary)',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            width: '100%',
            cursor: 'not-allowed'
          }}
        >
          Shift Completed
        </button>
      )}
      
      {/* Pulse Animation Definition */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

