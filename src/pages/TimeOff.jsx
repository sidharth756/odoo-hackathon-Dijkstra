import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  CalendarIcon, 
  PlusIcon, 
  WalletIcon, 
  HeartIcon, 
  ResumeIcon, 
  CheckCircleIcon, 
  CloseIcon,
  PalmIcon,
  XIcon
} from '../components/Icons';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachment, setAttachment] = useState('');

  // Review states (HR Admin)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewStatus, setReviewStatus] = useState(''); // 'Approved' | 'Rejected'
  const [reviewingLeaveId, setReviewingLeaveId] = useState(null);

  // Calendar navigation states
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-11
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  // Filter/Search states (HR Admin)
  const [searchEmployee, setSearchEmployee] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

  // Retrieve leaves for current user
  const myRequests = leaves
    .filter(l => l.employeeId === currentUser.id)
    .sort((a, b) => b.id - a.id);

  // Balances calculation for logged-in user
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

  // HR Admin filtering
  const adminFilteredLeaves = leaves.filter(l => {
    const emp = employees.find(e => e.id === l.employeeId);
    const empName = emp ? emp.name.toLowerCase() : 'unknown';
    const empId = l.employeeId.toLowerCase();
    const query = searchEmployee.toLowerCase();
    
    const matchesSearch = empName.includes(query) || empId.includes(query);
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.id - a.id);

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

    // Calculate days
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

  // Trigger review comments modal
  const handleReviewTrigger = (leaveId, status) => {
    setReviewingLeaveId(leaveId);
    setReviewStatus(status);
    setReviewComments('');
    setReviewModalOpen(true);
  };

  // Submit HR review decision
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewingLeaveId) return;

    updateLeaveStatus(reviewingLeaveId, reviewStatus, reviewComments);
    showNotification(`Leave request ${reviewStatus.toLowerCase()} successfully.`, 'success');
    
    setReviewingLeaveId(null);
    setReviewStatus('');
    setReviewComments('');
    setReviewModalOpen(false);
  };

  // Calendar logic helpers
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  // Get calendar days array
  const getCalendarDays = () => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // Sun=0, Mon=1...
    // Align so Monday is the first day (0=Mon, 1=Tue, ..., 6=Sun)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="timeoff-page-container">
      {/* Page Header */}
      <section className="timeoff-header-card card glassmorphism" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '24px 32px' }}>
        <div className="timeoff-title-area">
          <span className="page-icon"><PalmIcon size={24} /></span>
          <div>
            <h1>Time Off & Leaves</h1>
            <p className="subtitle">
              {isAdmin 
                ? 'Review leave history and manage administrative leave approvals.' 
                : 'Submit leave requests, check your remaining balances, and track approvals.'
              }
            </p>
          </div>
        </div>
        {!isAdmin && (
          <button className="timeoff-action-btn" onClick={() => setModalOpen(true)}>
            <PlusIcon size={14} style={{ marginRight: '6px' }} /> Request Time Off
          </button>
        )}
      </section>

      {/* Leave Balance Cards (Employee only) */}
      {!isAdmin && (
        <section className="balances-grid" style={{ marginBottom: '32px' }}>
          <div className="balance-card card">
            <div className="balance-info">
              <h3>Paid Time Off</h3>
              <p className="balance-days">{paidBalance} <span>Days left</span></p>
              <p className="balance-total">Used: {approvedPaid} of 24 days</p>
            </div>
            <span className="balance-icon"><WalletIcon size={24} color="var(--primary-color)" /></span>
          </div>

          <div className="balance-card card">
            <div className="balance-info">
              <h3>Sick Leave</h3>
              <p className="balance-days">{sickBalance} <span>Days left</span></p>
              <p className="balance-total">Used: {approvedSick} of 10 days</p>
            </div>
            <span className="balance-icon"><HeartIcon size={24} color="var(--color-on-leave)" /></span>
          </div>

          <div className="balance-card card">
            <div className="balance-info">
              <h3>Unpaid Leave</h3>
              <p className="balance-days">{approvedUnpaid} <span>Days used</span></p>
              <p className="balance-total">Always available</p>
            </div>
            <span className="balance-icon"><ResumeIcon size={24} color="var(--text-muted)" /></span>
          </div>
        </section>
      )}

      {/* Graphical Calendar Card */}
      <section className="calendar-section card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            {isAdmin ? "Leave Calendar (All Employees)" : "Your Leave Calendar"}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handlePrevMonth}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-color)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &lt;
            </button>
            <strong style={{ minWidth: '130px', textAlign: 'center', fontSize: '14px', color: 'var(--text-main)' }}>
              {monthNames[calendarMonth]} {calendarYear}
            </strong>
            <button
              onClick={handleNextMonth}
              style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-color)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', overflowX: 'auto' }}>
          {weekDaysShort.map((day, idx) => (
            <div key={idx} style={{ fontWeight: 'bold', padding: '8px 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '13px' }}>
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="calendar-day day-empty" style={{ minHeight: '80px', border: '1px solid transparent' }}></div>;
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
                minHeight: '80px',
                padding: '6px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: activeLeaves.length > 0 ? 'var(--primary-light)' : 'var(--bg-color)',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>{day}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto', maxHeight: '55px' }}>
                  {activeLeaves.map((l, lIdx) => {
                    const emp = employees.find((e) => e.id === l.employeeId);
                    return (
                      <span key={lIdx} title={`${emp?.name || 'User'}: ${l.type} - ${l.status}\n"${l.remarks}"`} style={{
                        display: 'block',
                        fontSize: '9px',
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
                          l.status === 'Approved' ? 'var(--color-present)' :
                          l.status === 'Pending' ? 'var(--color-absent)' :
                          'var(--color-on-leave)'
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
      </section>

      {/* Requests Lists */}
      <section className="requests-section card" style={{ padding: '24px' }}>
        {!isAdmin ? (
          // USER PORTAL: LEAVE REQUEST HISTORY
          <div>
            <h3 className="section-title" style={{ marginBottom: '16px' }}>Your Time Off Requests</h3>
            {myRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>No leave requests submitted yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="attendance-table" style={{ width: '100%', fontSize: '13.5px' }}>
                  <thead>
                    <tr>
                      <th>Leave Details</th>
                      <th>Duration</th>
                      <th>Remarks</th>
                      <th>Attachment</th>
                      <th>Status</th>
                      <th>HR Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{req.type} Leave</div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{req.id}</span>
                        </td>
                        <td>
                          <strong>{req.days} {req.days === 1 ? 'day' : 'days'}</strong>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                            {req.startDate} to {req.endDate}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-main)' }}>{req.remarks || '--'}</td>
                        <td>
                          {req.attachment ? (
                            <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>📄 {req.attachment}</span>
                          ) : '--'}
                        </td>
                        <td>
                          <span className={`status-pill status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
          <div>
            <h3 className="section-title" style={{ marginBottom: '20px' }}>Leave Management Dashboard</h3>

            {/* Filter and Search Panel */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>Search Employee</label>
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="filter-input-search"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
              <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    height: '42px'
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
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13.5px' }}>No leave requests found.</p>
            ) : (
              <div className="table-wrapper">
                <table className="attendance-table" style={{ width: '100%', fontSize: '13.5px' }}>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave Details</th>
                      <th>Duration</th>
                      <th>Remarks</th>
                      <th>Attachment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminFilteredLeaves.map((l) => {
                      const emp = employees.find((e) => e.id === l.employeeId);
                      return (
                        <tr key={l.id}>
                          <td>
                            <strong style={{ display: 'block', color: 'var(--text-main)' }}>{emp?.name || 'Unknown'}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {l.employeeId}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{l.type} Leave</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{l.id}</span>
                          </td>
                          <td>
                            <strong>{l.days} {l.days === 1 ? 'day' : 'days'}</strong>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>{l.startDate} to {l.endDate}</span>
                          </td>
                          <td style={{ color: 'var(--text-main)' }}>{l.remarks || '--'}</td>
                          <td>
                            {l.attachment ? (
                              <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>📄 {l.attachment}</span>
                            ) : '--'}
                          </td>
                          <td>
                            <span className={`status-pill status-${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                          <td>
                            {l.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleReviewTrigger(l.id, 'Approved')}
                                  style={{
                                    backgroundColor: 'var(--color-present)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewTrigger(l.id, 'Rejected')}
                                  style={{
                                    backgroundColor: 'var(--color-on-leave)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
      </section>

      {/* --- FORM MODAL: REQUEST TIME OFF --- */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card glassmorphism" style={{ maxWidth: '500px', width: '90%', padding: '24px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Request Time Off</h2>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}><CloseIcon size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    height: '42px'
                  }}
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Start Date *</label>
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
                      fontSize: '14px',
                      background: 'var(--bg-color)',
                      color: 'var(--text-main)',
                      boxSizing: 'border-box',
                      height: '42px'
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>End Date *</label>
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
                      fontSize: '14px',
                      background: 'var(--bg-color)',
                      color: 'var(--text-main)',
                      boxSizing: 'border-box',
                      height: '42px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Remarks / Reason</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Explain why you are requesting this leave..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)'
                  }}
                ></textarea>
              </div>

              {/* ATTACHMENT/FILE INPUT */}
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Attachment (Medical certificate/document)</label>
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
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)'
                  }}
                />
                {attachment && (
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-present)', marginTop: '6px', fontWeight: '600' }}>
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
                  className="profile-btn btn-cancel"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-btn btn-save"
                  style={{ minWidth: '120px' }}
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
        <div className="modal-backdrop">
          <div className="modal-content card glassmorphism" style={{ maxWidth: '450px', width: '90%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text-main)' }}>
              Provide Review Comments
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Are you sure you want to <strong>{reviewStatus.toLowerCase()}</strong> this leave request? Please provide any feedback or reason for this decision below.
            </p>
            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Reviewer Comments</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Enter comments here (optional)..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--bg-color)',
                    color: 'var(--text-main)'
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
                  className="profile-btn btn-cancel"
                  style={{ minWidth: '100px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: reviewStatus === 'Approved' ? 'var(--color-present)' : 'var(--color-on-leave)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontSize: '14px',
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
