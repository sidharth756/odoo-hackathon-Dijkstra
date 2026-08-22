import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
<<<<<<< HEAD
import { 
  CalendarIcon, 
  ResumeIcon, 
  CheckCircleIcon, 
  CloseIcon, 
  ClockIcon 
} from '../components/Icons';
import '../styles/attendance.css';

export default function Attendance() {
  const { currentUser, attendance, leaves, employees } = useContext(AppContext);
=======
import { CalendarIcon } from '../components/Icons';
import CheckInWidget from '../components/CheckInWidget';
import '../styles/attendance.css';

export default function Attendance() {
  const { currentUser, employees, attendance, leaves, getEmployeeStatus } = useContext(AppContext);
  const [adminTab, setAdminTab] = useState('realtime'); // 'realtime' | 'weekly' | 'history'
  const [employeeTab, setEmployeeTab] = useState('daily'); // 'daily' | 'weekly'
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // default to today
  });
  const [searchEmployee, setSearchEmployee] = useState('');
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

<<<<<<< HEAD
  // Dynamic status check for any employee and date
  const getEmployeeStatusForDate = (empId, dateStr) => {
    // 1. Check approved leaves
    const hasApprovedLeave = leaves.some(l => {
      if (l.employeeId !== empId || l.status !== "Approved") return false;
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const target = new Date(dateStr);
      // Strip time parts
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);
      return target >= start && target <= end;
=======
  // --- REGULAR EMPLOYEE CALCULATIONS ---
  const myLogs = attendance
    .filter((a) => a.employeeId === currentUser?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalDays = myLogs.length;
  const myTotalHours = myLogs.reduce((acc, log) => acc + (log.workHours || 0), 0);
  const avgHours = totalDays > 0 ? (myTotalHours / totalDays).toFixed(2) : '0.00';

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

  // Retrieve enriched logs
  const getEnrichedLogs = () => {
    return attendance.map(log => {
      const emp = employees.find(e => e.id === log.employeeId) || { name: 'Unknown', email: '' };
      return {
        ...log,
        employeeName: emp.name,
        employeeEmail: emp.email
      };
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
    });

    if (hasApprovedLeave) return "Leave";

    // 2. Check check-in log
    const log = attendance.find(a => a.employeeId === empId && a.date === dateStr);
    if (log) {
      if (log.status === "Half-day" || log.status === "Leave" || log.status === "Absent") {
        return log.status;
      }
      if (log.workHours && log.workHours > 0 && log.workHours < 4) {
        return "Half-day";
      }
      if (log.checkIn) {
        return "Present";
      }
    }

    // 3. Otherwise, Absent
    return "Absent";
  };

<<<<<<< HEAD
  // Helper to fetch dates of a selected week (starting Mon)
  const getWeekDates = (selectedDateStr) => {
    const selected = new Date(selectedDateStr);
    const day = selected.getDay();
    // 0 is Sunday, 1 is Monday.
    // Subtract to align to Monday
    const diff = selected.getDate() - (day === 0 ? 6 : day - 1);
    const startOfWeek = new Date(selected.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
=======
  const enrichedLogs = getEnrichedLogs();

  // Filter logs depending on selections
  const filteredLogs = enrichedLogs.filter(log => {
    // 1. Employee restriction
    if (!isAdmin && log.employeeId !== currentUser.id) {
      return false;
    }
    
    // 2. Date match
    const matchesDate = log.date === filterDate;
    
    // 3. Search query match (Admin only)
    const matchesSearch = !isAdmin || 
      log.employeeName.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2

  const weekDates = getWeekDates(filterDate);

<<<<<<< HEAD
  // Status visual indicator renderer
  const renderStatusIndicator = (status) => {
    switch (status) {
      case 'Present':
        return (
          <div className="status-cell-wrapper" title="Present">
            <span className="status-indicator-icon indicator-present">
              <CheckCircleIcon size={15} />
            </span>
          </div>
        );
      case 'Absent':
        return (
          <div className="status-cell-wrapper" title="Absent">
            <span className="status-indicator-icon indicator-absent">
              <CloseIcon size={15} />
            </span>
          </div>
        );
      case 'Half-day':
        return (
          <div className="status-cell-wrapper" title="Half-day">
            <span className="status-indicator-icon indicator-halfday">
              <ClockIcon size={15} />
            </span>
          </div>
        );
      case 'Leave':
        return (
          <div className="status-cell-wrapper" title="Leave">
            <span className="status-indicator-icon indicator-leave">
              <CalendarIcon size={15} />
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // ----------------------------------------------------
  // ADMIN VIEW LOGIC
  // ----------------------------------------------------
  const renderAdminView = () => {
    // Filter employees based on search query
    const filteredEmployees = employees.filter(emp => {
      const query = searchEmployee.toLowerCase();
      return emp.name.toLowerCase().includes(query) || emp.id.toLowerCase().includes(query);
    });

    if (viewMode === 'daily') {
      return (
        <section className="attendance-table-card card">
          <div className="table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => {
                  const status = getEmployeeStatusForDate(emp.id, filterDate);
                  return (
                    <tr key={emp.id}>
                      <td className="font-bold">{emp.id}</td>
                      <td>
                        <div className="log-employee-name">{emp.name}</div>
                        <div className="log-employee-email">{emp.email}</div>
                      </td>
                      <td>{filterDate}</td>
                      <td>
                        <span className={`status-pill status-${status.toLowerCase().replace(' ', '')}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      );
    } else {
      // Weekly view
      return (
        <section className="attendance-table-card card">
          <div className="table-wrapper">
            <table className="attendance-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th style={{ textAlign: 'center' }}>Mon<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[0]}</span></th>
                  <th style={{ textAlign: 'center' }}>Tue<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[1]}</span></th>
                  <th style={{ textAlign: 'center' }}>Wed<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[2]}</span></th>
                  <th style={{ textAlign: 'center' }}>Thu<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[3]}</span></th>
                  <th style={{ textAlign: 'center' }}>Fri<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[4]}</span></th>
                  <th style={{ textAlign: 'center' }}>Sat<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[5]}</span></th>
                  <th style={{ textAlign: 'center' }}>Sun<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>{weekDates[6]}</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="log-employee-name">{emp.name}</div>
                      <div className="log-employee-email">{emp.id}</div>
                    </td>
                    {weekDates.map((dateStr) => {
                      const status = getEmployeeStatusForDate(emp.id, dateStr);
                      return (
                        <td key={dateStr} style={{ textAlign: 'center' }}>
                          {renderStatusIndicator(status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="calendar-legend" style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span className="status-indicator-icon indicator-present" style={{ width: '20px', height: '20px' }}><CheckCircleIcon size={12} /></span> Present
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span className="status-indicator-icon indicator-absent" style={{ width: '20px', height: '20px' }}><CloseIcon size={12} /></span> Absent
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span className="status-indicator-icon indicator-halfday" style={{ width: '20px', height: '20px' }}><ClockIcon size={12} /></span> Half-day
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span className="status-indicator-icon indicator-leave" style={{ width: '20px', height: '20px' }}><CalendarIcon size={12} /></span> Approved Leave
            </div>
          </div>
        </section>
      );
    }
  };

  // ----------------------------------------------------
  // EMPLOYEE PERSONAL VIEW LOGIC
  // ----------------------------------------------------
  const renderEmployeeView = () => {
    // Filter check-in logs for logged-in employee matching selected date
    const myLogs = attendance.filter(log => log.employeeId === currentUser.id && log.date === filterDate);

    return (
      <section className="attendance-table-card card">
        <div className="table-wrapper">
          {myLogs.length > 0 ? (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myLogs.map((log, index) => (
                  <tr key={`${log.date}-${index}`}>
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
              <p>There are no recorded check-ins for {filterDate}. Please check in to log your hours.</p>
            </div>
          )}
        </div>
      </section>
    );
  };
=======
  const filteredLogsSorted = [...filteredLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Stats for current list
  const totalPresent = filteredLogs.length;
  const totalHours = filteredLogs.reduce((sum, log) => sum + (log.workHours || 0), 0);
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2

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

    // 4. Default to Absent
    return { status: 'Absent', text: 'Absent' };
  };

  return (
<<<<<<< HEAD
    <div className="attendance-page-container">
      {/* Page Header */}
      <section className="attendance-header-card card glassmorphism" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div className="attendance-title-area">
          <span className="page-icon"><CalendarIcon size={24} /></span>
          <div>
            <h1>Attendance Tracking</h1>
            <p className="subtitle">
              {isAdmin 
                ? 'Manage and monitor daily and weekly work logs for all staff members.' 
                : 'Review your personal check-in/out timestamps and work logs.'
              }
            </p>
          </div>
        </div>

        {/* View Toggle (Admin Only) */}
        {isAdmin && (
          <div className="view-toggle-container">
            <button 
              className={`view-toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
              onClick={() => setViewMode('daily')}
            >
              Daily View
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => setViewMode('weekly')}
            >
              Weekly View
            </button>
          </div>
        )}
      </section>

      {/* Filter and stats controls card */}
      <section className="attendance-filters-card card">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="filter-date-select">
              {viewMode === 'weekly' ? 'Select Week (Any date within week)' : 'Select Date'}
            </label>
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
=======
    <div className="content text-left attendance-page">
      {/* Page Header and Title */}
      <div className="attendance-header-card card glassmorphism" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', padding: '20px' }}>
        <CalendarIcon size={32} className="page-svg-icon" style={{ color: 'var(--primary-color)' }} />
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', color: 'var(--text-primary)' }}>Attendance</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isAdmin
              ? 'Manage and monitor daily work logs for all staff members.'
              : 'Review your personal check-in/out timestamps and total hours.'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        {isAdmin ? (
          <>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Employees</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--text-primary)', fontWeight: '700' }}>{employees.length}</h2>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
            </div>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Present Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--success)', fontWeight: '700' }}>{statusBreakdown.present}</h2>
            </div>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Absent Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--danger)', fontWeight: '700' }}>{statusBreakdown.absent}</h2>
            </div>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Leave Today</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--danger)', fontWeight: '700' }}>{statusBreakdown.leave}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Days Present</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--text-primary)', fontWeight: '700' }}>{totalDays}</h2>
            </div>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Hours Worked</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--primary-color)', fontWeight: '700' }}>{myTotalHours.toFixed(2)} hrs</h2>
            </div>
            <div className="stat-card">
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Hours/Day</span>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', color: 'var(--secondary-color)', fontWeight: '700' }}>{avgHours} hrs</h2>
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Split Layout */}
      <div className="main-layout" style={{
        display: 'flex',
        flexDirection: isAdmin ? 'column' : 'row',
        gap: '30px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>

        {/* Personal Clock-In Panel */}
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center', width: isAdmin ? '100%' : 'auto' }}>
          <CheckInWidget />
        </div>
<<<<<<< HEAD
      </section>

      {/* Render selected view */}
      {isAdmin ? renderAdminView() : renderEmployeeView()}
=======

        {/* Attendance Listing */}
        <div style={{ flex: '2', minWidth: '320px', width: '100%' }}>

          {!isAdmin ? (
            // REGULAR USER PROFILE VIEW
            <div style={{ background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>

              {/* Tab Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', gap: '20px' }}>
                <button
                  onClick={() => setEmployeeTab('daily')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: employeeTab === 'daily' ? 'var(--primary-color)' : 'var(--text-secondary)',
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
                    color: employeeTab === 'weekly' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    borderBottom: employeeTab === 'weekly' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  Weekly View Grid
                </button>
              </div>

              {employeeTab === 'daily' ? (
                myLogs.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No attendance records found yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                          <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Status</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Check In</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Check Out</th>
                          <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myLogs.map((log, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
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
                <div className="table-responsive">
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-primary)' }}>Weekly Summary (Monday - Sunday)</h4>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        {weekDaysShort.map((day, idx) => (
                          <th key={idx} style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>
                            {day} <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{weekDates[idx]}</span>
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
                                <span style={{ color: 'var(--text-secondary)' }}>--</span>
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
            <div style={{ background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAdminTab('realtime')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '10px 0 14px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: adminTab === 'realtime' ? 'var(--primary-color)' : 'var(--text-secondary)',
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
                    color: adminTab === 'weekly' ? 'var(--primary-color)' : 'var(--text-secondary)',
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
                    color: adminTab === 'history' ? 'var(--primary-color)' : 'var(--text-secondary)',
                    borderBottom: adminTab === 'history' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  }}
                >
                  All Historical Logs
                </button>
              </div>

              {adminTab === 'realtime' ? (
                // REALTIME GRID
                <div>
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-primary)' }}>Real-Time Employee Directory Presence</h4>
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
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          background: 'var(--card-background)'
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
                            <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{emp.name}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {emp.id}</span>
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
                                status === 'On Leave' ? 'rgba(113,75,103,0.12)' :
                                'rgba(220,53,69,0.12)',
                              color:
                                status === 'Present' ? 'var(--success)' :
                                status === 'On Leave' ? 'var(--primary-color)' :
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
              ) : adminTab === 'weekly' ? (
                // WEEKLY TEAM GRID
                <div className="table-responsive">
                  <h4 style={{ margin: '0 0 16px', color: 'var(--text-primary)' }}>Weekly Team Schedule (Monday - Sunday)</h4>
                  <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600', minWidth: '150px' }}>Employee</th>
                        {weekDaysShort.map((day, idx) => (
                          <th key={idx} style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>
                            {day} <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{weekDates[idx]}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: '600' }}>
                            <div>{emp.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{emp.role}</div>
                          </td>
                          {weekDates.map((dateStr, idx) => {
                            const info = getDayStatusAndDetails(emp.id, dateStr);
                            return (
                              <td key={idx} style={{ padding: '12px 8px', verticalAlign: 'top' }}>
                                {info.status === 'Future' ? (
                                  <span style={{ color: 'var(--text-secondary)' }}>--</span>
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
                                        info.status === 'Present' ? 'rgba(40,167,69,0.1)' :
                                        info.status === 'On Leave' ? 'rgba(113,75,103,0.1)' :
                                        'rgba(220,53,69,0.1)',
                                      color:
                                        info.status === 'Present' ? 'var(--success)' :
                                        info.status === 'On Leave' ? 'var(--primary-color)' :
                                        'var(--danger)'
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
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Search Employee</label>
                      <input
                        type="text"
                        placeholder="Name or Employee ID..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box',
                          background: 'var(--card-background)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div style={{ width: '180px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Filter by Date</label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box',
                          background: 'var(--card-background)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Attendance stats for selection */}
                  <div className="stats-row" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div className="stat-badge" style={{ background: 'var(--background-color)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span className="stat-badge-title" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Total Logs:</span>
                      <strong className="stat-badge-value" style={{ color: 'var(--text-primary)' }}>{totalPresent}</strong>
                    </div>
                    <div className="stat-badge" style={{ background: 'var(--background-color)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span className="stat-badge-title" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Accumulated Hours:</span>
                      <strong className="stat-badge-value" style={{ color: 'var(--text-primary)' }}>{totalHours.toFixed(1)} hrs</strong>
                    </div>
                  </div>

                  {filteredLogs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No historical entries match your search/filters.</p>
                  ) : (
                    <div className="table-responsive">
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Employee</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Check In</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Check Out</th>
                            <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Total Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogsSorted.map((log, idx) => {
                            const emp = employees.find((e) => e.id === log.employeeId);
                            return (
                              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '12px 8px', fontWeight: '500' }}>{log.date}</td>
                                <td style={{ padding: '12px 8px' }}>
                                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{emp?.name || 'Unknown'}</strong>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {log.employeeId}</span>
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
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
    </div>
  );
}
