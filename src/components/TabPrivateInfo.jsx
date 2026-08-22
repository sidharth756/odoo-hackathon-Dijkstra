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
    <div className="tab-private-info private-info-edit-form">
      {/* SECTION 1: Personal Identity */}
      <div className="info-section">
        <h3>
          🪪 Personal Identity
          {isRestricted && <span className="restricted-badge">View Only</span>}
        </h3>
        <div className="pi-grid">
          <div className="pi-field">
            <label htmlFor="dob">🎂 Date of Birth</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <input
                  type="date"
                  id="dob"
                  className="pi-input"
                  value={privateInfo.dob || ''}
                  onChange={(e) => handleTextChange('dob', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.dob ? privateInfo.dob : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field">
            <label htmlFor="gender">⚧ Gender</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <select
                  id="gender"
                  className="pi-input"
                  value={privateInfo.gender || ''}
                  onChange={(e) => handleTextChange('gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.gender ? privateInfo.gender : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field">
            <label htmlFor="maritalStatus">💍 Marital Status</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <select
                  id="maritalStatus"
                  className="pi-input"
                  value={privateInfo.maritalStatus || ''}
                  onChange={(e) => handleTextChange('maritalStatus', e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.maritalStatus ? privateInfo.maritalStatus : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field">
            <label htmlFor="nationality">🌍 Nationality</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <input
                  type="text"
                  id="nationality"
                  className="pi-input"
                  placeholder="e.g. Indian"
                  value={privateInfo.nationality || ''}
                  onChange={(e) => handleTextChange('nationality', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.nationality ? privateInfo.nationality : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Contact & Address */}
      <div className="info-section">
        <h3>📞 Contact &amp; Address</h3>
        <div className="pi-grid">
          <div className="pi-field">
            <label htmlFor="phone">📱 Phone Number</label>
            {canEditField(false) ? (
              <div className="pi-input-wrap">
                <input
                  type="tel"
                  id="phone"
                  className="pi-input"
                  placeholder="+91 98765 43210"
                  value={employee.phone || ''}
                  onChange={(e) => onBaseFieldChange('phone', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {employee.phone ? employee.phone : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field">
            <label htmlFor="personalEmail">✉️ Personal Email</label>
            {canEditField(false) ? (
              <div className="pi-input-wrap">
                <input
                  type="email"
                  id="personalEmail"
                  className="pi-input"
                  placeholder="personal@gmail.com"
                  value={privateInfo.personalEmail || ''}
                  onChange={(e) => handleTextChange('personalEmail', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.personalEmail ? privateInfo.personalEmail : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field pi-field-full">
            <label htmlFor="address">🏠 Permanent Address</label>
            {canEditField(false) ? (
              <div className="pi-input-wrap">
                <input
                  type="text"
                  id="address"
                  className="pi-input"
                  placeholder="House No, Street name, City, Pin code..."
                  value={privateInfo.address || ''}
                  onChange={(e) => handleTextChange('address', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.address ? privateInfo.address : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Bank Details */}
      <div className="info-section">
        <h3>
          🏦 Bank Details
          {isRestricted && <span className="restricted-badge">View Only</span>}
        </h3>
        <div className="pi-grid">
          <div className="pi-field">
            <label htmlFor="bankName">🏛️ Bank Name</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <input
                  type="text"
                  id="bankName"
                  className="pi-input"
                  placeholder="e.g. HDFC Bank"
                  value={privateInfo.bankName || ''}
                  onChange={(e) => handleTextChange('bankName', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.bankName ? privateInfo.bankName : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field">
            <label htmlFor="ifsc">🔢 IFSC Code</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <input
                  type="text"
                  id="ifsc"
                  className="pi-input"
                  placeholder="e.g. HDFC0001234"
                  value={privateInfo.ifsc || ''}
                  onChange={(e) => handleTextChange('ifsc', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.ifsc ? privateInfo.ifsc : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>

          <div className="pi-field pi-field-full">
            <label htmlFor="accountNo">💳 Account Number</label>
            {canEditField(true) ? (
              <div className="pi-input-wrap">
                <input
                  type="text"
                  id="accountNo"
                  className="pi-input"
                  placeholder="e.g. 501000987654"
                  value={privateInfo.accountNo || ''}
                  onChange={(e) => handleTextChange('accountNo', e.target.value)}
                />
              </div>
            ) : (
              <div className="profile-text-display">
                {privateInfo.accountNo ? privateInfo.accountNo : <span className="text-light">Not specified</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
