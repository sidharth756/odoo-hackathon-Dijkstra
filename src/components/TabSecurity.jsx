import React, { useState } from 'react';
import '../styles/profile.css';

export default function TabSecurity({ employee, updateProfile }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      return;
    }

    // Verify current password
    if (employee.password !== currentPassword) {
      setError('Current password is incorrect.');
      return;
    }

    // Verify new password constraints
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    // Check confirmation matches
    if (newPassword !== confirmPassword) {
      setError('Confirm password does not match your new password.');
      return;
    }

    // Update password
    try {
      updateProfile(employee.id, { password: newPassword });
      setSuccess('Password updated successfully!');
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="tab-security">
      <div className="tab-header">
        <h2>Security Settings</h2>
      </div>

      <div className="security-card">
        <h3>Change Password</h3>
        <p className="security-subtitle">Provide your current password to update and confirm a new one.</p>

        {error && <div className="security-alert error-alert">{error}</div>}
        {success && <div className="security-alert success-alert">{success}</div>}

        <form onSubmit={handlePasswordChange} className="security-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-security-submit">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
