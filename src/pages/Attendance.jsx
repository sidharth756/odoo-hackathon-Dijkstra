import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CheckInWidget from '../components/CheckInWidget';
import '../styles/attendance.css';

export default function Attendance() {
  const { currentUser, employees, attendance, leaves, getEmployeeStatus } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [adminTab, setAdminTab] = useState('realtime'); // 'realtime' | 'weekly' | 'history'
  const [employeeTab, setEmployeeTab] = useState('daily'); // 'daily' | 'weekly'

  const isHR = currentUser?.role === 'HR';

  // --- REGULAR EMPLOYEE CALCULATIONS ---
  const myLogs = attendance
    .filter((a) => a.employeeId === currentUser?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalDays = myLogs.length;
  const totalHours = myLogs.reduce((acc, log) => acc + (log.workHours || 0), 0);
  const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(2) : 0;

  // --- HR ADMIN CALCULATIONS ---
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's status breakdown
  const statusBreakdown = employees.reduce(
    (acc, emp) => {
      const status = getEmployeeStatus(emp.id);
      if (status === 'Present') acc.present++;
      else if (status === 'On Leave') acc.leave++;
      else acc.absent++;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 }
  );

  // Filter historical logs
  const filteredLogs = attendance
    .filter((log) => {
      const employee = employees.find((e) => e.id === log.employeeId);
      const matchesSearch = employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = selectedDate ? log.date === selectedDate : true;
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // --- WEEKLY GRID HELPERS ---
  const getWeekDates = () => {
    const current = new Date();
    const week = [];
    const currentDay = current.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = getWeekDates();
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDayStatusAndDetails = (employeeId, dateStr) => {
    const today = new Date().toISOString().split('T')[0];

    // 1. Check if date is in the future
    if (dateStr > today) {
      return { status: 'Future', text: '--' };
    }

    // 2. Check for Approved Leave on this date
    const hasApprovedLeave = leaves.some(l => {
      if (l.employeeId !== employeeId || l.status !== "Approved") return false;
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });
    if (hasApprovedLeave) {
      return { status: 'On Leave', text: 'On Leave' };
    }

    // 3. Check for Attendance record
    const log = attendance.find(a => a.employeeId === employeeId && a.date === dateStr);
    if (log && log.checkIn) {
      const timeText = log.checkOut
        ? `${log.checkIn}-${log.checkOut} (${log.workHours}h)`
        : `${log.checkIn}-Active`;
      return { status: 'Present', text: timeText };
    }

    // 4. Default to Absent for today and past days
    return { status: 'Absent', text: 'Absent' };
  };

  return (
    <div className="content text-left attendance-page">
      <div className="header-section" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: '2.5rem', color: 'var(--text-h)' }}>Attendance</h1>
        <p style={{ margin: 0, color: 'var(--text)' }}>
          Manage daily check-ins, view historical work hours, and track team presence.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {isHR ? (
          <>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Employees</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--text-h)', fontWeight: '700' }}>{employees.length}</h2>
            </div>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Present Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--success)', fontWeight: '700' }}>{statusBreakdown.present}</h2>
            </div>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Absent Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--danger)', fontWeight: '700' }}>{statusBreakdown.absent}</h2>
            </div>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Leave Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--danger)', fontWeight: '700' }}>{statusBreakdown.leave}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Days Present</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--text-h)', fontWeight: '700' }}>{totalDays}</h2>
            </div>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Hours Worked</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--primary-color)', fontWeight: '700' }}>{totalHours.toFixed(2)} hrs</h2>
            </div>
            <div className="stat-card" style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Hours/Day</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--secondary-color)', fontWeight: '700' }}>{avgHours} hrs</h2>
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Split Layout */}
      <div className="main-layout" style={{
        display: 'flex',
        flexDirection: isHR ? 'column' : 'row',
        gap: '30px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>

        {/* Personal Clock-In Panel */}
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center', width: isHR ? '100%' : 'auto' }}>
          <CheckInWidget />
        </div>

        {/* Attendance Listing */}
        <div style={{ flex: '2', minWidth: '320px', width: '100%' }}>

          {!isHR ? (
            // REGULAR USER PROFILE VIEW
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>

              {/* Tab Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', gap: '20px' }}>
                <button
                  onClick={() => setEmployeeTab('daily')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: employeeTab === 'daily' ? 'var(--primary-color)' : 'var(--text)',
                    borderBottom: employeeTab === 'daily' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  Daily History
                </button>
                <button
                  onClick={() => setEmployeeTab('weekly')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: employeeTab === 'weekly' ? 'var(--primary-color)' : 'var(--text)',
                    borderBottom: employeeTab === 'weekly' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  Weekly View Grid
                </button>
              </div>

              {employeeTab === 'daily' ? (
                myLogs.length === 0 ? (
                  <p style={{ color: 'var(--text)', fontStyle: 'italic' }}>No attendance records found yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                          <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Status</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Check In</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Check Out</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myLogs.map((log, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{log.date}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                backgroundColor: log.status === 'Present' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
                                color: log.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                              }}>
                                {log.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px' }}>{log.checkIn || '--'}</td>
                            <td style={{ padding: '12px 8px' }}>{log.checkOut || '--'}</td>
                            <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                              {log.workHours ? `${log.workHours} hrs` : '--'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                // PERSONAL WEEKLY VIEW GRID
                <div style={{ overflowX: 'auto' }}>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-h)' }}>Weekly Summary (Monday - Sunday)</h4>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        {weekDaysShort.map((day, idx) => (
                          <th key={idx} style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>
                            {day} <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text)' }}>{weekDates[idx]}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {weekDates.map((dateStr, idx) => {
                          const info = getDayStatusAndDetails(currentUser.id, dateStr);
                          return (
                            <td key={idx} style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                              {info.status === 'Future' ? (
                                <span style={{ color: 'var(--text)' }}>--</span>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    width: 'fit-content',
                                    backgroundColor:
                                      info.status === 'Present' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
                                    color:
                                      info.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                                  }}>
                                    {info.status}
                                  </span>
                                  {info.status === 'Present' && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                      {info.text}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          ) : (
            // HR ADMIN DASHBOARD PANEL
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAdminTab('realtime')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: adminTab === 'realtime' ? 'var(--primary-color)' : 'var(--text)',
                    borderBottom: adminTab === 'realtime' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  Today's Status Grid
                </button>
                <button
                  onClick={() => setAdminTab('weekly')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: adminTab === 'weekly' ? 'var(--primary-color)' : 'var(--text)',
                    borderBottom: adminTab === 'weekly' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  Weekly Team Grid
                </button>
                <button
                  onClick={() => setAdminTab('history')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: adminTab === 'history' ? 'var(--primary-color)' : 'var(--text)',
                    borderBottom: adminTab === 'history' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  All Historical Logs
                </button>
              </div>

              {adminTab === 'realtime' ? (
                // REALTIME GRID
                <div>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-h)' }}>Real-Time Employee Directory Presence</h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px'
                  }}>
                    {employees.map((emp) => {
                      const status = getEmployeeStatus(emp.id);
                      const tLog = attendance.find(a => a.employeeId === emp.id && a.date === todayStr);
                      return (
                        <div key={emp.id} style={{
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          background: '#fcfcfc'
                        }}>
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(113,75,103,0.1)',
                            color: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <strong style={{ display: 'block', color: 'var(--text-h)', fontSize: '0.95rem' }}>{emp.name}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text)' }}>ID: {emp.id}</span>
                            {tLog && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                In: {tLog.checkIn || '--'} | Out: {tLog.checkOut || '--'}
                              </div>
                            )}
                          </div>
                          <div>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              // "On Leave" is styled with RED (var(--danger)), same as "Absent"
                              backgroundColor:
                                status === 'Present' ? 'rgba(40,167,69,0.12)' : 'rgba(220,53,69,0.12)',
                              color:
                                status === 'Present' ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : adminTab === 'weekly' ? (
                // WEEKLY TEAM GRID
                <div style={{ overflowX: 'auto' }}>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-h)' }}>Weekly Team Schedule (Monday - Sunday)</h4>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600', minWidth: '150px' }}>Employee</th>
                        {weekDaysShort.map((day, idx) => (
                          <th key={idx} style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>
                            {day} <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', color: 'var(--text)' }}>{weekDates[idx]}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: '600' }}>
                            <div>{emp.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 'normal' }}>{emp.role}</div>
                          </td>
                          {weekDates.map((dateStr, idx) => {
                            const info = getDayStatusAndDetails(emp.id, dateStr);
                            return (
                              <td key={idx} style={{ padding: '12px 8px', verticalAlign: 'top' }}>
                                {info.status === 'Future' ? (
                                  <span style={{ color: 'var(--text)' }}>--</span>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{
                                      display: 'inline-block',
                                      padding: '2px 6px',
                                      borderRadius: '10px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      width: 'fit-content',
                                      backgroundColor:
                                        info.status === 'Present' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)',
                                      color:
                                        info.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                      {info.status}
                                    </span>
                                    {info.status === 'Present' && (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                        {info.text}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // HISTORY LOGS TABLE WITH FILTERS
                <div>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Search Employee</label>
                      <input
                        type="text"
                        placeholder="Name or Employee ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ width: '180px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Filter by Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {filteredLogs.length === 0 ? (
                    <p style={{ color: 'var(--text)', fontStyle: 'italic' }}>No historical entries match your search/filters.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Employee</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Check In</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Check Out</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Total Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log, idx) => {
                            const emp = employees.find((e) => e.id === log.employeeId);
                            return (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '12px 8px', fontWeight: '500' }}>{log.date}</td>
                                <td style={{ padding: '12px 8px' }}>
                                  <strong style={{ display: 'block', color: 'var(--text-h)' }}>{emp?.name || 'Unknown'}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>ID: {log.employeeId}</span>
                                </td>
                                <td style={{ padding: '12px 8px' }}>{log.checkIn || '--'}</td>
                                <td style={{ padding: '12px 8px' }}>{log.checkOut || '--'}</td>
                                <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                  {log.workHours ? `${log.workHours} hrs` : '--'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
