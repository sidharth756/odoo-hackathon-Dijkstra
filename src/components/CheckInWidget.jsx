import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ClockIcon } from './Icons';

export default function CheckInWidget() {
  const { currentUser, attendance, checkIn, checkOut, showNotification } = useContext(AppContext);
  const [time, setTime] = useState(new Date());

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = attendance.find(a => a.employeeId === currentUser.id && a.date === todayStr);

  const isCheckedIn = todayLog && todayLog.checkIn && !todayLog.checkOut;

  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleAction = () => {
    const currentTimeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    if (!isCheckedIn) {
      checkIn(currentUser.id, currentTimeStr);
      showNotification(`Successfully checked in at ${formatTime(time)}!`, 'success');
    } else {
      checkOut(currentUser.id, currentTimeStr);
      showNotification(`Successfully checked out at ${formatTime(time)}!`, 'info');
    }
  };

  return (
    <div className="checkin-widget card glassmorphism">
      <div className="widget-clock-section">
        <ClockIcon size={24} className="clock-svg-icon" style={{ opacity: 0.9, marginBottom: '6px' }} />
        <div className="clock-time">{formatTime(time)}</div>
        <div className="clock-date">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="widget-status-section">
        <div className="status-label-container">
          <span className="status-indicator-pulse" style={{
            backgroundColor: isCheckedIn ? 'var(--color-present)' : 'var(--color-absent)'
          }} />
          <span className="status-text">
            Status: <strong>{isCheckedIn ? 'Checked In' : todayLog?.checkOut ? 'Checked Out' : 'Not Checked In'}</strong>
          </span>
        </div>

        {todayLog?.checkIn && (
          <div className="status-times">
            <p>In: <strong>{todayLog.checkIn}</strong></p>
            {todayLog.checkOut && <p>Out: <strong>{todayLog.checkOut}</strong></p>}
          </div>
        )}
      </div>

      <button 
        className={`widget-btn ${isCheckedIn ? 'btn-checkout' : 'btn-checkin'}`}
        onClick={handleAction}
      >
        {isCheckedIn ? 'Check Out' : 'Check In'}
      </button>
    </div>
  );
}

