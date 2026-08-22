import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import TabResume from '../components/TabResume';
import TabPrivateInfo from '../components/TabPrivateInfo';
import TabSecurity from '../components/TabSecurity';
import '../styles/profile.css';

export default function Profile() {
  const { currentUser, logout, updateProfile } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('resume');
  const fileInputRef = useRef(null);

  if (!currentUser) {
    return <div className="profile-loading">Please log in to view your profile.</div>;
  }

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (limit to 2MB to prevent localStorage overflow)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile(currentUser.id, { avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resume':
        return <TabResume employee={currentUser} updateProfile={updateProfile} />;
      case 'private':
        return <TabPrivateInfo employee={currentUser} updateProfile={updateProfile} />;
      case 'salary':
        // Show view-only salary info fields according to structural data, but no editing features
        return (
          <div className="tab-salary-info-view">
            <h3>Salary Info Overview</h3>
            <p className="tab-salary-notice">Detailed salary editing is restricted to HR Administrators. Your basic wage details are summarized below.</p>
            <div className="salary-grid">
              <div className="salary-field">
                <span className="field-label">Monthly Wage</span>
                <span className="field-value">₹ {currentUser.salaryInfo?.monthlyWage?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="salary-field">
                <span className="field-label">Yearly Wage</span>
                <span className="field-value">₹ {currentUser.salaryInfo?.yearlyWage?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="salary-field">
                <span className="field-label">Working Days / Week</span>
                <span className="field-value">{currentUser.salaryInfo?.workingDays || '5'} days</span>
              </div>
            </div>
            <div className="salary-disclaimer">
              Note: Contact HR for adjustments to standard allowances, performance bonuses, or deductions.
            </div>
          </div>
        );
      case 'security':
        return <TabSecurity employee={currentUser} updateProfile={updateProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header-card">
        <div className="profile-cover-banner"></div>
        <div className="profile-header-info">
          <div className="avatar-wrapper" onClick={handleAvatarClick}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-fallback">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
              </div>
            )}
            <div className="avatar-hover-overlay">
              <span>📷</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="profile-meta">
            <h1 className="profile-name">{currentUser.name}</h1>
            <div className="profile-meta-sub">
              <span className="profile-badge-role">{currentUser.role}</span>
              <span className="profile-meta-id">ID: {currentUser.id}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>

        <nav className="profile-nav-tabs">
          <button 
            className={`nav-tab-link ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button 
            className={`nav-tab-link ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            Private Info
          </button>
          <button 
            className={`nav-tab-link ${activeTab === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            Salary Info
          </button>
          <button 
            className={`nav-tab-link ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </nav>
      </div>

      <div className="profile-tab-content-card">
        {renderTabContent()}
      </div>
    </div>
  );
}
