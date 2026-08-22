import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { PalmIcon, XIcon, PlusIcon } from '../components/Icons';
import '../styles/timeoff.css';

export default function TimeOff() {
  const { 
    currentUser, 
    leaves, 
    employees, 
    requestLeave, 
    updateLeaveStatus, 
    showNotification 
  } = useContext(AppContext);

  // States
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachment, setAttachment] = useState('');

  // Admin filters
  const [searchEmployee, setSearchEmployee] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Admin approval comments modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingLeaveId, setReviewingLeaveId] = useState(null);
  const [reviewStatus, setReviewStatus] = useState(''); // 'Approved' | 'Rejected'
  const [reviewComments, setReviewComments] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

  // Calculate balances (Only Approved leaves reduce balances)
  const getApprovedDays = (type) => {
    return leaves
      .filter(l => l.employeeId === currentUser.id && l.type === type && l.status === 'Approved')
      .reduce((sum, l) => sum + (l.days || 0), 0);
  };

  const approvedPaid = getApprovedDays('Paid');
  const approvedSick = getApprovedDays('Sick');
  const approvedUnpaid = getApprovedDays('Unpaid');

  const paidBalance = Math.max(0, 24 - approvedPaid);
  const sickBalance = Math.max(0, 10 - approvedSick);

  // Filtered leaves list for HR Admin Dashboard
  const adminFilteredLeaves = leaves
    .filter((l) => {
      const emp = employees.find((e) => e.id === l.employeeId) || { name: 'Unknown' };
      const matchesSearch = emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
                            l.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : l.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.id - a.id);

  const myRequests = leaves
    .filter((l) => l.employeeId === currentUser.id)
    .sort((a, b) => b.id - a.id);

  // Submit leave request
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      showNotification('Please select both start and end dates.', 'error');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      showNotification('End date cannot be before start date.', 'error');
      return;
    }

    // Calculate inclusive leave days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check balances
    if (leaveType === 'Paid' && diffDays > paidBalance) {
      showNotification(`Insufficient Paid Time Off balance. Requested: ${diffDays} days, Available: ${paidBalance} days.`, 'error');
      return;
    }

    if (leaveType === 'Sick' && diffDays > sickBalance) {
      showNotification(`Insufficient Sick Leave balance. Requested: ${diffDays} days, Available: ${sickBalance} days.`, 'error');
      return;
    }

    requestLeave({
      type: leaveType,
      startDate,
      endDate,
      days: diffDays,
      remarks,
      attachment
    });

    showNotification('Leave request submitted successfully!', 'success');
    
    // Reset and close
    setLeaveType('Paid');
    setStartDate('');
    setEndDate('');
    setRemarks('');
    setAttachment('');
    setModalOpen(false);
  };

  // Approval review trigger
  const handleReviewTrigger = (leaveId, status) => {
    setReviewingLeaveId(leaveId);
    setReviewStatus(status);
    setReviewComments('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewingLeaveId || !reviewStatus) return;

    updateLeaveStatus(reviewingLeaveId, reviewStatus, reviewComments);
    showNotification(`Leave request ${reviewStatus.toLowerCase()} successfully.`, 'success');

    // Reset and close
    setReviewingLeaveId(null);
    setReviewStatus('');
    setReviewComments('');
    setReviewModalOpen(false);
  };

  // --- CALENDAR GENERATION ---
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();

  const handlePrevMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));

  const getCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    // Get Mon-based start day index (0=Mon, 1=Tue, ..., 6=Sun)
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysArr = [];

    // Pad previous month days
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArr.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      daysArr.push(i);
    }

    return daysArr;
  };

  const calendarDays = getCalendarDays();
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="content text-left timeoff-page">
      {/* Page Header */}
      <div className="timeoff-header-card card glassmorphism" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <PalmIcon size={32} className="page-svg-icon" style={{ color: 'var(--primary-color)' }} />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '2rem', color: 'var(--text-primary)' }}>Time Off & Leaves</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Request leaves, track your balances, and manage administrative leave approvals.
            </p>
          </div>
        </div>
        {!isAdmin && (
          <button className="timeoff-action-btn" onClick={() => setModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusIcon size={16} />
            <span>Request Time Off</span>
          </button>
        )}
      </div>

      {/* Leave Balance Cards (Employee only) */}
      {!isAdmin && (
        <div className="balances-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Paid Leave Card */}
          <div className="balance-card" style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Paid Time Off</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                {paidBalance} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>days left</span>
              </h2>
            </div>
            <div style={{ marginTop: '16px', backgroundColor: 'var(--background-color)', height: '6px', borderRadius: '3px', position: 'relative', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: `${Math.min(100, (approvedPaid / 24) * 100)}%`,
                backgroundColor: 'var(--secondary-color)',
                height: '100%',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Used: {approvedPaid} days</span>
              <span>Quota: 24 days</span>
            </div>
          </div>

          {/* Sick Leave Card */}
          <div className="balance-card" style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Sick Leave</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                {sickBalance} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>days left</span>
              </h2>
            </div>
            <div style={{ marginTop: '16px', backgroundColor: 'var(--background-color)', height: '6px', borderRadius: '3px', position: 'relative', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: `${Math.min(100, (approvedSick / 10) * 100)}%`,
                backgroundColor: 'var(--warning)',
                height: '100%',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Used: {approvedSick} days</span>
              <span>Quota: 10 days</span>
            </div>
          </div>

          {/* Unpaid Leave Card */}
          <div className="balance-card" style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Unpaid Leave</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                {approvedUnpaid} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>days used</span>
              </h2>
            </div>
            <div style={{ marginTop: '16px', backgroundColor: 'var(--background-color)', height: '6px', borderRadius: '3px', position: 'relative', border: '1px solid var(--border-color)' }}>
              <div style={{
                width: `${Math.min(100, (approvedUnpaid / 30) * 100)}%`,
                backgroundColor: 'var(--danger)',
                height: '100%',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Used: {approvedUnpaid} days</span>
              <span>Unlimited</span>
            </div>
          </div>
        </div>
      )}

      {/* GRAPHICAL MONTHLY LEAVE CALENDAR */}
      <div className="table-responsive" style={{ background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {isAdmin ? "Leave Calendar (All Employees)" : "Your Leave Calendar"}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrevMonth}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--background-color)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &lt;
            </button>
            <strong style={{ minWidth: '150px', textAlign: 'center', fontSize: '1rem', color: 'var(--text-primary)' }}>
              {monthNames[calendarMonth]} {calendarYear}
            </strong>
            <button
              onClick={handleNextMonth}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--background-color)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', minWidth: '650px' }}>
          {weekDaysShort.map((day, idx) => (
            <div key={idx} style={{ fontWeight: 'bold', padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={idx} style={{ background: 'var(--background-color)', borderRadius: '8px', minHeight: '70px', border: '1px solid transparent' }}></div>;
            }

            const cellDateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Filter leaves covering this cell date
            const activeLeaves = leaves.filter((l) => {
              const isOwner = isAdmin ? true : l.employeeId === currentUser?.id;
              return isOwner && cellDateStr >= l.startDate && cellDateStr <= l.endDate;
            });

            return (
              <div key={idx} className="calendar-day" style={{
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                minHeight: '70px',
                padding: '4px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: activeLeaves.length > 0 ? 'var(--background-color)' : 'var(--card-background)',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{day}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', maxHeight: '50px' }}>
                  {activeLeaves.map((l, lIdx) => {
                    const emp = employees.find((e) => e.id === l.employeeId);
                    return (
                      <span key={lIdx} title={`${emp?.name || 'User'}: ${l.type} - ${l.status}\n"${l.remarks}"`} style={{
                        display: 'block',
                        fontSize: '0.65rem',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        backgroundColor:
                          l.status === 'Approved' ? 'rgba(40,167,69,0.12)' :
                          l.status === 'Pending' ? 'rgba(255,193,7,0.15)' :
                          'rgba(220,53,69,0.12)',
                        color:
                          l.status === 'Approved' ? 'var(--success)' :
                          l.status === 'Pending' ? '#d39e00' :
                          'var(--danger)'
                      }}>
                        {isAdmin ? `${emp?.name.split(' ')[0]}: ` : ""}{l.type}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requests Lists */}
      <div style={{ width: '100%' }}>
        {!isAdmin ? (
          // USER PORTAL: LEAVE REQUEST HISTORY
          <div style={{ background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Your Time Off Requests</h3>
            {myRequests.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave requests submitted yet.</p>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Leave Details</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Duration</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Remarks</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Attachment</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>HR Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{req.type} Leave</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: #{req.id}</span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <strong>{req.days} {req.days === 1 ? 'day' : 'days'}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {req.startDate} to {req.endDate}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{req.remarks || '--'}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {req.attachment ? (
                            <span style={{ color: 'var(--secondary-color)', fontWeight: '500' }}>📄 {req.attachment}</span>
                          ) : '--'}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            backgroundColor:
                              req.status === 'Approved' ? 'rgba(40,167,69,0.1)' :
                              req.status === 'Pending' ? 'rgba(255,193,7,0.1)' :
                              'rgba(220,53,69,0.1)',
                            color:
                              req.status === 'Approved' ? 'var(--success)' :
                              req.status === 'Pending' ? 'var(--warning)' :
                              'var(--danger)'
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                          {req.comments || '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          // HR ADMIN VIEW: APPROVALS & FILTER PANEL
          <div style={{ background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Leave Management Dashboard</h3>

            {/* Filter and Search Panel */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Search Employee</label>
                <input
                  type="text"
                  placeholder="Search name or ID..."
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Approval Table */}
            {adminFilteredLeaves.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave requests found.</p>
            ) : (
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Employee</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Leave Details</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Duration</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Remarks</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Attachment</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminFilteredLeaves.map((l) => {
                      const emp = employees.find((e) => e.id === l.employeeId);
                      return (
                        <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{emp?.name || 'Unknown'}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {l.employeeId}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{l.type} Leave</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: #{l.id}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <strong>{l.days} {l.days === 1 ? 'day' : 'days'}</strong>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.startDate} to {l.endDate}</span>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{l.remarks || '--'}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {l.attachment ? (
                              <span style={{ color: 'var(--secondary-color)', fontWeight: '500' }}>📄 {l.attachment}</span>
                            ) : '--'}
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              backgroundColor:
                                l.status === 'Approved' ? 'rgba(40,167,69,0.1)' :
                                l.status === 'Pending' ? 'rgba(255,193,7,0.1)' :
                                'rgba(220,53,69,0.1)',
                              color:
                                l.status === 'Approved' ? 'var(--success)' :
                                l.status === 'Pending' ? 'var(--warning)' :
                                'var(--danger)'
                            }}>
                              {l.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            {l.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleReviewTrigger(l.id, 'Approved')}
                                  style={{
                                    backgroundColor: 'var(--success)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewTrigger(l.id, 'Rejected')}
                                  style={{
                                    backgroundColor: 'var(--danger)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                Comments: {l.comments || 'None'}
                              </span>
                            )}
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

      {/* --- FORM MODAL: REQUEST TIME OFF --- */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>Request Time Off</h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <XIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    background: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Start Date *</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'var(--card-background)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>End Date *</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required 
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      background: 'var(--card-background)',
                      color: 'var(--text-primary)',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Remarks / Reason</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Explain why you are requesting this leave..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '60px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                ></textarea>
              </div>

              {/* ATTACHMENT/FILE INPUT */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Attachment (Medical certificate/document)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setAttachment(file.name);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    background: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                />
                {attachment && (
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--success)', marginTop: '6px', fontWeight: '600' }}>
                    Selected: {attachment}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment('');
                    setModalOpen(false);
                  }}
                  style={{
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REVIEW MODAL: APPROVE/REJECT WITH COMMENTS --- */}
      {reviewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2001
        }}>
          <div style={{
            background: 'var(--card-background)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Provide Review Comments
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to <strong>{reviewStatus.toLowerCase()}</strong> this leave request? Please provide any feedback or reason for this decision below.
            </p>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>Reviewer Comments</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Enter comments here (optional)..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setReviewingLeaveId(null);
                    setReviewStatus('');
                    setReviewComments('');
                    setReviewModalOpen(false);
                  }}
                  style={{
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: reviewStatus === 'Approved' ? 'var(--success)' : 'var(--danger)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Confirm {reviewStatus}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
