import React from 'react';

export default function TabPrivateInfo({ employee, isEditing, isRestricted, onChange, onBaseFieldChange }) {
  const privateInfo = employee.privateInfo || {
    dob: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    address: '',
    personalEmail: '',
    bankName: '',
    ifsc: '',
    accountNo: ''
  };

  const handleTextChange = (field, val) => {
    onChange(field, val);
  };

  // Determine if a field is editable based on edit state and user restrictions
  const canEditField = (isRestrictedField) => {
    if (!isEditing) return false;
    if (isRestricted && isRestrictedField) return false; // restricted fields are locked for regular employees
    return true;
  };

  return (
    <div className="tab-private-container">
      {/* SECTION 1: Personal Details */}
      <h3 className="section-subtitle">Personal Details</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Date of Birth</label>
          {canEditField(true) ? (
            <input
              type="date"
              className="profile-input"
              value={privateInfo.dob || ''}
              onChange={(e) => handleTextChange('dob', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.dob ? privateInfo.dob : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Gender</label>
          {canEditField(true) ? (
            <select
              className="profile-select"
              value={privateInfo.gender || ''}
              onChange={(e) => handleTextChange('gender', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <div className="profile-text-display">
              {privateInfo.gender ? privateInfo.gender : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Marital Status</label>
          {canEditField(true) ? (
            <select
              className="profile-select"
              value={privateInfo.maritalStatus || ''}
              onChange={(e) => handleTextChange('maritalStatus', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          ) : (
            <div className="profile-text-display">
              {privateInfo.maritalStatus ? privateInfo.maritalStatus : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Nationality</label>
          {canEditField(true) ? (
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. Indian"
              value={privateInfo.nationality || ''}
              onChange={(e) => handleTextChange('nationality', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.nationality ? privateInfo.nationality : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>
      </div>

      <hr className="profile-section-divider" />

      {/* SECTION 2: Contact Details */}
      <h3 className="section-subtitle">Contact Details</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Phone Number</label>
          {canEditField(false) ? ( // Contact details are editable by anyone
            <input
              type="tel"
              className="profile-input"
              placeholder="+91 98765 43210"
              value={employee.phone || ''}
              onChange={(e) => onBaseFieldChange('phone', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {employee.phone ? employee.phone : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Personal Email</label>
          {canEditField(false) ? (
            <input
              type="email"
              className="profile-input"
              placeholder="personal@gmail.com"
              value={privateInfo.personalEmail || ''}
              onChange={(e) => handleTextChange('personalEmail', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.personalEmail ? privateInfo.personalEmail : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-full">
          <label className="profile-input-label">Permanent Address</label>
          {canEditField(false) ? (
            <textarea
              className="profile-textarea"
              placeholder="House No, Street name, City, Pin code..."
              value={privateInfo.address || ''}
              onChange={(e) => handleTextChange('address', e.target.value)}
              rows={3}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.address ? (
                <p style={{ whiteSpace: 'pre-wrap' }}>{privateInfo.address}</p>
              ) : (
                <span className="text-light">Not specified</span>
              )}
            </div>
          )}
        </div>
      </div>

      <hr className="profile-section-divider" />

      {/* SECTION 3: Bank Details */}
      <h3 className="section-subtitle">Bank Details</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Bank Name</label>
          {canEditField(true) ? (
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. HDFC Bank"
              value={privateInfo.bankName || ''}
              onChange={(e) => handleTextChange('bankName', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.bankName ? privateInfo.bankName : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">IFSC Code</label>
          {canEditField(true) ? (
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. HDFC0001234"
              value={privateInfo.ifsc || ''}
              onChange={(e) => handleTextChange('ifsc', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.ifsc ? privateInfo.ifsc : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Account Number</label>
          {canEditField(true) ? (
            <input
              type="text"
              className="profile-input"
              placeholder="e.g. 501000987654"
              value={privateInfo.accountNo || ''}
              onChange={(e) => handleTextChange('accountNo', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              {privateInfo.accountNo ? privateInfo.accountNo : <span className="text-light">Not specified</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
