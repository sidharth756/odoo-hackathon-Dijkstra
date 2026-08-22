import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
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
  const [filterDate, setFilterDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // default to today
  });
  const [searchEmployee, setSearchEmployee] = useState('');
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly'

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

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

  const weekDates = getWeekDates(filterDate);

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

  return (
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
            </div>
          )}
        </div>
      </section>

      {/* Render selected view */}
      {isAdmin ? renderAdminView() : renderEmployeeView()}
    </div>
  );
}
