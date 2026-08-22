import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CheckInWidget from '../components/CheckInWidget';
import '../styles/attendance.css';

export default function Attendance() {
  const { currentUser, employees, attendance, leaves, getEmployeeStatus } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [adminTab, setAdminTab] = useState('realtime'); // 'realtime' | 'history'

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

  return (
    <div className="content text-left">
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
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Leave Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--secondary-color)', fontWeight: '700' }}>{statusBreakdown.leave}</h2>
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
        
        {/* Personal Clock-In Panel (Left side for regular employees, top section for HR if desired) */}
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center', width: isHR ? '100%' : 'auto' }}>
          <CheckInWidget />
        </div>

        {/* Attendance Listing (Right side for employees, Full bottom section for HR admins) */}
        <div style={{ flex: '2', minWidth: '320px', width: '100%' }}>
          
          {!isHR ? (
            // REGULAR USER PROFILE VIEW
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: 'var(--text-h)' }}>Your Attendance History</h3>
              {myLogs.length === 0 ? (
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
              )}
            </div>
          ) : (
            // HR ADMIN DASHBOARD PANEL
            <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
              
              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', gap: '20px' }}>
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
                              backgroundColor: 
                                status === 'Present' ? 'rgba(40,167,69,0.12)' : 
                                status === 'On Leave' ? 'rgba(1,160,157,0.12)' : 
                                'rgba(220,53,69,0.12)',
                              color: 
                                status === 'Present' ? 'var(--success)' : 
                                status === 'On Leave' ? 'var(--secondary-color)' : 
                                'var(--danger)'
                            }}>
                              {status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
