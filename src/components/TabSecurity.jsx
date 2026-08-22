import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function TabSecurity({ employee, isEditing, onChange }) {
  const { showNotification } = useContext(AppContext);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!isEditing) {
    return (
      <div className="tab-security-container">
        <p className="security-notice">
          ℹ️ Security details can only be edited by the profile owner. Regular view is restricted.
        </p>
      </div>
    );
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    // Verification check
    const currentActualPassword = employee.password || '123456'; // fallback to default mock password
    
    if (currentPass !== currentActualPassword) {
      showNotification('Incorrect current password.', 'error');
      return;
    }

    if (newPass.length < 6) {
      showNotification('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (newPass !== confirmPass) {
      showNotification('New passwords do not match.', 'error');
      return;
    }

    // Save password
    onChange('password', newPass);
    showNotification('Password updated successfully! Don\'t forget to save changes on the header to commit this update.', 'success');
    
    // Clear form
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="tab-security-container">
      <h3 className="section-subtitle">Change Password</h3>
      
      <form onSubmit={handlePasswordUpdate} className="profile-security-form">
        <div className="form-group-half">
          <label className="profile-input-label">Current Password *</label>
          <input
            type="password"
            className="profile-input"
            placeholder="••••••••"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            required
          />
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">New Password *</label>
          <input
            type="password"
            className="profile-input"
            placeholder="Min 6 characters"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Confirm New Password *</label>
          <input
            type="password"
            className="profile-input"
            placeholder="••••••••"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="profile-btn btn-save" style={{ marginTop: '16px', width: 'fit-content' }}>
          🔒 Update Password
        </button>
      </form>
    </div>
  );
}
