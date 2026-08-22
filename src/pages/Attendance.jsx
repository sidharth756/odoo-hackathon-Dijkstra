import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CalendarIcon, ResumeIcon } from '../components/Icons';
import '../styles/attendance.css';

export default function Attendance() {
  const { currentUser, attendance, employees } = useContext(AppContext);
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // today's date
  });
  const [searchEmployee, setSearchEmployee] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

  // Retrieve attendance log and match with employee data
  const getEnrichedLogs = () => {
    return attendance.map(log => {
      const emp = employees.find(e => e.id === log.employeeId) || { name: 'Unknown', email: '' };
      return {
        ...log,
        employeeName: emp.name,
        employeeEmail: emp.email
      };
    });
  };

  const enrichedLogs = getEnrichedLogs();

  // Filter logs depending on user permissions and selections
  const filteredLogs = enrichedLogs.filter(log => {
    // 1. Employee restriction
    if (!isAdmin && log.employeeId !== currentUser.id) {
      return false;
    }
    
    // 2. Date match (Daily view)
    const matchesDate = log.date === filterDate;
    
    // 3. Search query match (Admin only)
    const matchesSearch = !isAdmin || 
      log.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());

    return matchesDate && matchesSearch;
  });

  // Calculate stats for current list
  const totalPresent = filteredLogs.length;
  const totalHours = filteredLogs.reduce((sum, log) => sum + (log.workHours || 0), 0);

  return (
    <div className="attendance-page-container">
      {/* Page Header and Title */}
      <section className="attendance-header-card card glassmorphism">
        <div className="attendance-title-area">
          <span className="page-icon"><CalendarIcon size={24} /></span>
          <div>
            <h1>Attendance Tracking</h1>
            <p className="subtitle">
              {isAdmin 
                ? 'Manage and monitor daily work logs for all staff members.' 
                : 'Review your personal check-in/out timestamps and total hours.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Filter and stats controls card */}
      <section className="attendance-filters-card card">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="filter-date-select">Select Date</label>
            <input
              id="filter-date-select"
              type="date"
              className="filter-input-date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {isAdmin && (
            <div className="filter-group filter-grow">
              <label htmlFor="filter-emp-search">Search Employee</label>
              <input
                id="filter-emp-search"
                type="text"
                className="filter-input-search"
                placeholder="Search by name or employee ID..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Attendance stats */}
        <div className="stats-row">
          <div className="stat-badge">
            <span className="stat-badge-title">Total Logs</span>
            <span className="stat-badge-value">{totalPresent}</span>
          </div>
          <div className="stat-badge">
            <span className="stat-badge-title">Accumulated Hours</span>
            <span className="stat-badge-value">{totalHours.toFixed(1)} hrs</span>
          </div>
        </div>
      </section>

      {/* Logs Table Card */}
      <section className="attendance-table-card card">
        <div className="table-wrapper">
          {filteredLogs.length > 0 ? (
            <table className="attendance-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee ID</th>}
                  {isAdmin && <th>Name</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={`${log.employeeId}-${log.date}-${index}`}>
                    {isAdmin && <td className="font-bold">{log.employeeId}</td>}
                    {isAdmin && (
                      <td>
                        <div className="log-employee-name">{log.employeeName}</div>
                        <div className="log-employee-email">{log.employeeEmail}</div>
                      </td>
                    )}
                    <td>{log.date}</td>
                    <td className="time-cell">{log.checkIn || '--:--'}</td>
                    <td className="time-cell">{log.checkOut || '--:--'}</td>
                    <td className="hours-cell font-semibold">
                      {log.workHours ? `${log.workHours} hrs` : '0.0 hrs'}
                    </td>
                    <td>
                      <span className="status-pill status-present">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-table-state">
              <div className="empty-icon"><ResumeIcon size={48} color="var(--text-muted)" /></div>
              <h3>No attendance records found</h3>
              <p>There are no recorded check-ins for {filterDate} matching your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
