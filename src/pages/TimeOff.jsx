import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  CalendarIcon, 
  PlusIcon, 
  WalletIcon, 
  HeartIcon, 
  ResumeIcon, 
  CheckCircleIcon, 
  CloseIcon 
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
  
  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'HR';

  // Retrieve leaves for current user (or all leaves for Admin view)
  const myLeaves = leaves.filter(l => l.employeeId === currentUser.id);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  
  // Calculate balances
  // Paid Leave allowance = 24 days. Sick Leave allowance = 10 days.
  const getApprovedDays = (type) => {
    return leaves
      .filter(l => l.employeeId === currentUser.id && l.type === type && l.status === 'Approved')
      .reduce((sum, l) => sum + (l.days || 0), 0);
  };

  const approvedPaid = getApprovedDays('Paid');
  const approvedSick = getApprovedDays('Sick');

  const paidBalance = Math.max(0, 24 - approvedPaid);
  const sickBalance = Math.max(0, 10 - approvedSick);

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

  // Resolve employee name for admin table
  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown Employee';
  };

  const handleApprove = (leaveId) => {
    updateLeaveStatus(leaveId, 'Approved', 'Approved by Admin');
    showNotification('Leave request approved.', 'success');
  };

  const handleReject = (leaveId) => {
    updateLeaveStatus(leaveId, 'Rejected', 'Rejected by Admin');
    showNotification('Leave request rejected.', 'info');
  };

  // Simple calendar render logic for active leaves
  const renderCalendar = () => {
    const daysInMonth = 30; // Mock current month
    const days = [];
    
    // Simple helper to check if a day number is covered by any of user's approved leaves
    const isDayOnLeave = (dayNum) => {
      // Mock month is August 2026 (year of hackathon)
      const dayDateStr = `2026-08-${String(dayNum).padStart(2, '0')}`;
      const checkDate = new Date(dayDateStr);

      return myLeaves.some(l => {
        if (l.status !== 'Approved') return false;
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        return checkDate >= start && checkDate <= end;
      });
    };

    for (let i = 1; i <= daysInMonth; i++) {
      const onLeave = isDayOnLeave(i);
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${onLeave ? 'day-on-leave' : ''}`}
          title={onLeave ? 'Approved Leave Day' : `August ${i}`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="timeoff-page-container">
      {/* Page Header */}
      <section className="timeoff-header-card card glassmorphism">
        <div className="timeoff-title-area">
          <span className="page-icon"><CalendarIcon size={24} /></span>
          <div>
            <h1>Time Off & Leaves</h1>
            <p className="subtitle">Submit leave requests, check your remaining balances, and track approvals.</p>
          </div>
        </div>
        <button className="timeoff-action-btn" onClick={() => setModalOpen(true)}>
          <PlusIcon size={14} style={{ marginRight: '6px' }} /> Request Time Off
        </button>
      </section>

      {/* Leave Balance Cards */}
      <section className="balances-grid">
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
            <p className="balance-days">-- <span>Days used</span></p>
            <p className="balance-total">Always available</p>
          </div>
          <span className="balance-icon"><ResumeIcon size={24} color="var(--text-muted)" /></span>
        </div>
      </section>

      {/* Main Content splits (Calendar vs Lists) */}
      <div className="timeoff-content-split">
        {/* Calendar Side */}
        <section className="calendar-section card">
          <h3 className="section-title">Leave Calendar (August 2026)</h3>
          <div className="calendar-grid-header">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="calendar-grid-days">
            {/* Shift calendar grid to start on Saturday for Aug 2026 */}
            <div className="calendar-day day-empty" />
            <div className="calendar-day day-empty" />
            <div className="calendar-day day-empty" />
            <div className="calendar-day day-empty" />
            <div className="calendar-day day-empty" />
            {renderCalendar()}
          </div>
          <div className="calendar-legend">
            <span className="legend-dot present-dot" /> Available
            <span className="legend-dot leave-dot" /> Leave Approved
          </div>
        </section>

        {/* Requests List Side */}
        <section className="requests-section card">
          <h3 className="section-title">My Leave History</h3>
          <div className="requests-list">
            {myLeaves.length > 0 ? (
              myLeaves.map((l) => (
                <div key={l.id} className="request-list-item">
                  <div className="request-meta">
                    <span className="request-type">{l.type} Leave</span>
                    <span className="request-dates">{l.startDate} to {l.endDate}</span>
                  </div>
                  <div className="request-details">
                    <span className="request-days-count">{l.days} day{l.days !== 1 ? 's' : ''}</span>
                    <span className={`status-pill status-${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </div>
                  {l.remarks && <p className="request-remarks">"{l.remarks}"</p>}
                </div>
              ))
            ) : (
              <div className="empty-requests">
                <p>You haven't submitted any leave requests yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Admin Approvals Section (HR only) */}
      {isAdmin && (
        <section className="admin-approvals-section card">
          <h3 className="section-title">Pending Approvals</h3>
          <div className="approvals-list">
            {pendingLeaves.length > 0 ? (
              <table className="approvals-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((l) => (
                    <tr key={l.id}>
                      <td className="font-bold">{getEmployeeName(l.employeeId)}</td>
                      <td>{l.type} Leave</td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td>{l.days} days</td>
                      <td className="remarks-td">"{l.remarks || 'No remarks'}"</td>
                      <td className="actions-td">
                        <button className="approve-btn" onClick={() => handleApprove(l.id)}>
                          Approve
                        </button>
                        <button className="reject-btn" onClick={() => handleReject(l.id)}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-approvals">
                <span className="empty-icon"><CheckCircleIcon size={48} color="var(--primary-color)" /></span>
                <h4>All caught up!</h4>
                <p>There are no pending leave requests to review.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Leave Request Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content card glassmorphism">
            <div className="modal-header">
              <h2>Request Time Off</h2>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}><CloseIcon size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-group">
                <label>Leave Type *</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                  <option value="Paid">Paid Time Off</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Remarks / Description</label>
                <textarea 
                  placeholder="Reason for requesting time off..." 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Attachment (Medical certificate/document)</label>
                <input 
                  type="file" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setAttachment(file.name);
                    }
                  }} 
                />
              </div>

              <button type="submit" className="submit-leave-btn">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
