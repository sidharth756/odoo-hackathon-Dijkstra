import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/timeoff.css';

export default function TimeOff() {
  const { currentUser, leaves, employees, requestLeave, updateLeaveStatus } = useContext(AppContext);
  const isHR = currentUser?.role === 'HR';

  // State for request leave modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [days, setDays] = useState(1);

  // State for review/comment modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved'); // 'Approved' | 'Rejected'
  const [adminComments, setAdminComments] = useState('');

  // --- LEAVE CALCULATIONS & BALANCES ---
  const myRequests = leaves
    .filter((l) => l.employeeId === currentUser?.id)
    .sort((a, b) => b.id - a.id);

  // Calculate used leaves
  const approvedLeaves = leaves.filter((l) => l.employeeId === currentUser?.id && l.status === 'Approved');
  const paidUsed = approvedLeaves.filter((l) => l.type === 'Paid').reduce((acc, curr) => acc + curr.days, 0);
  const sickUsed = approvedLeaves.filter((l) => l.type === 'Sick').reduce((acc, curr) => acc + curr.days, 0);
  const unpaidUsed = approvedLeaves.filter((l) => l.type === 'Unpaid').reduce((acc, curr) => acc + curr.days, 0);

  const balances = {
    Paid: { limit: 15, used: paidUsed, label: 'Paid Leave' },
    Sick: { limit: 8, used: sickUsed, label: 'Sick Leave' },
    Unpaid: { limit: 30, used: unpaidUsed, label: 'Unpaid Leave' }
  };

  // --- HR ADMIN FILTER & DATA ---
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [searchEmployee, setSearchEmployee] = useState('');

  const adminFilteredLeaves = leaves
    .filter((l) => {
      const emp = employees.find((e) => e.id === l.employeeId);
      const matchesSearch = emp?.name.toLowerCase().includes(searchEmployee.toLowerCase()) || 
                            l.employeeId.toLowerCase().includes(searchEmployee.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : l.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.id - a.id);

  // --- ACTIONS ---
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please fill in start and end dates.");
      return;
    }
    requestLeave({
      type: leaveType,
      startDate,
      endDate,
      days: Number(days),
      remarks
    });
    // Reset state
    setLeaveType('Paid');
    setStartDate('');
    setEndDate('');
    setRemarks('');
    setDays(1);
    setShowApplyModal(false);
  };

  const handleReviewTrigger = (leaveId, action) => {
    setActiveReviewId(leaveId);
    setReviewAction(action);
    setAdminComments('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
    if (!activeReviewId) return;
    updateLeaveStatus(activeReviewId, reviewAction, adminComments);
    setShowReviewModal(false);
    setActiveReviewId(null);
  };

  // Auto calculate days from dates
  const handleDateChange = (start, end) => {
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(diffDays > 0 ? diffDays : 1);
    }
  };

  return (
    <div className="content text-left">
      <div className="header-section" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '2.5rem', color: 'var(--text-h)' }}>Time Off & Leaves</h1>
          <p style={{ margin: 0, color: 'var(--text)' }}>
            Request leaves, track your balances, and manage administrative leave approvals.
          </p>
        </div>
        {!isHR && (
          <button
            onClick={() => setShowApplyModal(true)}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(113,75,103,0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'none'}
          >
            Request Time Off
          </button>
        )}
      </div>

      {/* Leave Balances Grid (Shown to regular users and admins can see their own) */}
      {!isHR && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {Object.entries(balances).map(([key, item]) => {
            const remaining = item.limit - item.used;
            return (
              <div key={key} style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '16px' }}>
                  <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-h)', fontWeight: '700' }}>
                    {remaining} <span style={{ fontSize: '1rem', color: 'var(--text)', fontWeight: '400' }}>days left</span>
                  </h2>
                </div>
                <div style={{ marginTop: '16px', backgroundColor: '#e9ecef', height: '6px', borderRadius: '3px', position: 'relative' }}>
                  <div style={{
                    width: `${Math.min(100, (item.used / item.limit) * 100)}%`,
                    backgroundColor: key === 'Sick' ? 'var(--warning)' : key === 'Unpaid' ? 'var(--danger)' : 'var(--secondary-color)',
                    height: '100%',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text)', marginTop: '8px' }}>
                  <span>Used: {item.used} days</span>
                  <span>Quota: {item.limit} days</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Layout Split */}
      <div style={{ width: '100%' }}>
        {!isHR ? (
          // USER PORTAL: LEAVE REQUEST HISTORY
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: 'var(--text-h)' }}>Your Time Off Requests</h3>
            {myRequests.length === 0 ? (
              <p style={{ color: 'var(--text)', fontStyle: 'italic' }}>No leave requests submitted yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Leave Details</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Duration</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Remarks</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>HR Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-h)' }}>{req.type} Leave</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: #{req.id}</span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <strong>{req.days} {req.days === 1 ? 'day' : 'days'}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text)' }}>
                            {req.startDate} to {req.endDate}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text)', fontSize: '0.9rem' }}>{req.remarks || '--'}</td>
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
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.25rem', color: 'var(--text-h)' }}>Leave Management Dashboard</h3>
            
            {/* Filter and Search Panel */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Search Employee</label>
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Status Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    background: 'white'
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
              <p style={{ color: 'var(--text)', fontStyle: 'italic' }}>No leave requests found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Employee</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Leave Details</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Duration</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Remarks</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-h)', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminFilteredLeaves.map((l) => {
                      const emp = employees.find((e) => e.id === l.employeeId);
                      return (
                        <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <strong style={{ display: 'block', color: 'var(--text-h)' }}>{emp?.name || 'Unknown'}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>ID: {l.employeeId}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ fontWeight: '600' }}>{l.type} Leave</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: #{l.id}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <strong>{l.days} {l.days === 1 ? 'day' : 'days'}</strong>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text)' }}>{l.startDate} to {l.endDate}</span>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'var(--text)', fontSize: '0.9rem' }}>{l.remarks || '--'}</td>
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
      {showApplyModal && (
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
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '1.4rem', color: 'var(--text-h)' }}>Request Time Off</h3>
            <form onSubmit={handleApplyLeave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
                >
                  <option value="Paid">Paid Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      handleDateChange(e.target.value, endDate);
                    }}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      handleDateChange(startDate, e.target.value);
                    }}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Calculated Days</label>
                <input
                  type="number"
                  disabled
                  value={days}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', background: '#f1f3f5', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Remarks / Reason</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Explain why you are requesting this leave..."
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  style={{
                    backgroundColor: '#e9ecef',
                    color: 'var(--text-primary)',
                    border: 'none',
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

      {/* --- REVIEW MODAL: APPROVE/REJECT COMMENT DIALOG --- */}
      {showReviewModal && (
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
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{
              margin: '0 0 16px',
              fontSize: '1.3rem',
              color: reviewAction === 'Approved' ? 'var(--success)' : 'var(--danger)'
            }}>
              Confirm {reviewAction === 'Approved' ? 'Approval' : 'Rejection'}
            </h3>
            <p style={{ margin: '0 0 20px', color: 'var(--text)', fontSize: '0.95rem' }}>
              Are you sure you want to <strong>{reviewAction.toLowerCase()}</strong> this leave request? You can add review comments below.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>Manager Comments (Optional)</label>
              <textarea
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder="Write optional feedback or review notes here..."
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', minHeight: '80px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{
                  backgroundColor: '#e9ecef',
                  color: 'var(--text-primary)',
                  border: 'none',
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
                onClick={handleReviewSubmit}
                style={{
                  backgroundColor: reviewAction === 'Approved' ? 'var(--success)' : 'var(--danger)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm {reviewAction}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
