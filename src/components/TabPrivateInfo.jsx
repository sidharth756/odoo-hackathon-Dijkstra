import React, { useState } from 'react';
import '../styles/profile.css';

export default function TabPrivateInfo({ employee, updateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const isHR = employee.role === 'HR';

  // State fields
  const [dob, setDob] = useState(employee.privateInfo?.dob || '');
  const [gender, setGender] = useState(employee.privateInfo?.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(employee.privateInfo?.maritalStatus || '');
  const [nationality, setNationality] = useState(employee.privateInfo?.nationality || '');
  const [address, setAddress] = useState(employee.privateInfo?.address || '');
  const [personalEmail, setPersonalEmail] = useState(employee.privateInfo?.personalEmail || '');
  const [phone, setPhone] = useState(employee.phone || employee.privateInfo?.phone || '');
  const [bankName, setBankName] = useState(employee.privateInfo?.bankName || '');
  const [ifsc, setIfsc] = useState(employee.privateInfo?.ifsc || '');
  const [accountNo, setAccountNo] = useState(employee.privateInfo?.accountNo || '');

  const handleEdit = () => {
    setDob(employee.privateInfo?.dob || '');
    setGender(employee.privateInfo?.gender || '');
    setMaritalStatus(employee.privateInfo?.maritalStatus || '');
    setNationality(employee.privateInfo?.nationality || '');
    setAddress(employee.privateInfo?.address || '');
    setPersonalEmail(employee.privateInfo?.personalEmail || '');
    setPhone(employee.phone || employee.privateInfo?.phone || '');
    setBankName(employee.privateInfo?.bankName || '');
    setIfsc(employee.privateInfo?.ifsc || '');
    setAccountNo(employee.privateInfo?.accountNo || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    let updatedPrivateInfo = {};
    if (isHR) {
      // HR can edit all fields
      updatedPrivateInfo = {
        dob: dob.trim(),
        gender: gender.trim(),
        maritalStatus: maritalStatus.trim(),
        nationality: nationality.trim(),
        address: address.trim(),
        personalEmail: personalEmail.trim(),
        phone: phone.trim(),
        bankName: bankName.trim(),
        ifsc: ifsc.trim(),
        accountNo: accountNo.trim()
      };
    } else {
      // Regular employees can ONLY edit address and phone
      updatedPrivateInfo = {
        ...employee.privateInfo,
        address: address.trim(),
        phone: phone.trim()
      };
    }

    updateProfile(employee.id, {
      phone: phone.trim(),
      privateInfo: updatedPrivateInfo
    });
    setIsEditing(false);
  };

  return (
    <div className="tab-private-info">
      <div className="tab-header">
        <h2>Private Information</h2>
        {!isEditing && (
          <button type="button" className="btn-edit" onClick={handleEdit}>
            ✏️ Edit Private Info
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="private-info-view">
          <div className="info-section">
            <h3>📞 Contact &amp; Address</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="item-label">📱 Phone</span>
                <span className="item-value">{employee.phone || employee.privateInfo?.phone || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">🏠 Address</span>
                <span className="item-value">{employee.privateInfo?.address || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">✉️ Personal Email</span>
                <span className="item-value">{employee.privateInfo?.personalEmail || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>🪪 Personal Identity</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="item-label">🎂 Date of Birth</span>
                <span className="item-value">{employee.privateInfo?.dob || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">⚧ Gender</span>
                <span className="item-value">{employee.privateInfo?.gender || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">💍 Marital Status</span>
                <span className="item-value">{employee.privateInfo?.maritalStatus || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">🌍 Nationality</span>
                <span className="item-value">{employee.privateInfo?.nationality || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>🏦 Bank Account Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="item-label">🏛️ Bank Name</span>
                <span className="item-value">{employee.privateInfo?.bankName || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">🔢 IFSC Code</span>
                <span className="item-value">{employee.privateInfo?.ifsc || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="item-label">💳 Account Number</span>
                <span className="item-value">{employee.privateInfo?.accountNo || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="private-info-edit-form">

          {/* ── Contact & Address ── */}
          <div className="info-section">
            <h3>📞 Contact &amp; Address</h3>
            <div className="pi-grid">
              <div className="pi-field">
                <label htmlFor="phone">📱 Phone Number</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="pi-input"
                  />
                </div>
              </div>

              <div className="pi-field">
                <label htmlFor="address">🏠 Address</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 456 Silicon Valley, Bangalore"
                    className="pi-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Identity ── */}
          <div className="info-section">
            <h3>
              🪪 Personal Identity
              {!isHR && <span className="restricted-badge">View Only</span>}
            </h3>
            <div className="pi-grid">
              <div className="pi-field">
                <label htmlFor="dob">🎂 Date of Birth</label>
                <div className="pi-input-wrap">
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>

              <div className="pi-field">
                <label htmlFor="gender">⚧ Gender</label>
                <div className="pi-input-wrap">
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="pi-input"
                    disabled={!isHR}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pi-field">
                <label htmlFor="maritalStatus">💍 Marital Status</label>
                <div className="pi-input-wrap">
                  <select
                    id="maritalStatus"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="pi-input"
                    disabled={!isHR}
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="pi-field">
                <label htmlFor="nationality">🌍 Nationality</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Indian"
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>

              <div className="pi-field pi-field-full">
                <label htmlFor="personalEmail">✉️ Personal Email</label>
                <div className="pi-input-wrap">
                  <input
                    type="email"
                    id="personalEmail"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="e.g. personal@gmail.com"
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Bank Account Details ── */}
          <div className="info-section">
            <h3>
              🏦 Bank Account Details
              {!isHR && <span className="restricted-badge">View Only</span>}
            </h3>
            <div className="pi-grid">
              <div className="pi-field">
                <label htmlFor="bankName">🏛️ Bank Name</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>

              <div className="pi-field">
                <label htmlFor="ifsc">🔢 IFSC Code</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="ifsc"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="e.g. HDFC0001234"
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>

              <div className="pi-field pi-field-full">
                <label htmlFor="accountNo">💳 Account Number</label>
                <div className="pi-input-wrap">
                  <input
                    type="text"
                    id="accountNo"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    placeholder="e.g. 50100087654321"
                    className="pi-input"
                    disabled={!isHR}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">💾 Save Changes</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>✕ Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
