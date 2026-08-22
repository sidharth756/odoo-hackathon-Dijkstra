import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import TabResume from '../components/TabResume';
import TabPrivateInfo from '../components/TabPrivateInfo';
import TabSalaryInfo from '../components/TabSalaryInfo';
import TabSecurity from '../components/TabSecurity';
import '../styles/profile.css';

export default function Profile() {
  const { 
    currentUser, 
    viewedEmployeeId, 
    employees, 
    updateProfile, 
    showNotification,
    setCurrentTab
  } = useContext(AppContext);

  // Retrieve the employee being viewed
  const employee = employees.find(e => e.id === viewedEmployeeId) || currentUser;

  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);

  // Form states populated from the employee data
  const [formData, setFormData] = useState(null);

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData(JSON.parse(JSON.stringify(employee))); // deep clone
    }
  }, [employee, isEditing]);

  if (!currentUser || !employee || !formData) return null;

  const isOwnProfile = currentUser.id === employee.id;
  const isAdmin = currentUser.role === 'HR';
  
  // Rule checks
  const canEdit = isEditing;
  const isSalaryTabVisible = isAdmin; // Salary info is Admin-only

  // Update specific fields in nested form state
  const handleFieldChange = (section, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (section) {
        updated[section] = { ...updated[section], [field]: value };
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  const handleSave = () => {
    try {
      updateProfile(employee.id, formData);
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(JSON.parse(JSON.stringify(employee))); // revert
  };

  const getInitials = () => {
    const cleanName = employee.name.replace(/[^a-zA-Z ]/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'ME';
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <TabResume 
            employee={formData} 
            isEditing={canEdit} 
            onChange={(field, val) => handleFieldChange('resume', field, val)} 
          />
        );
      case 'private':
        return (
          <TabPrivateInfo 
            employee={formData} 
            isEditing={canEdit} 
            // regular employee can only edit phone, address, and avatar
            isRestricted={!isAdmin && isOwnProfile}
            onChange={(field, val) => handleFieldChange('private', field, val)}
            onBaseFieldChange={(field, val) => handleFieldChange(null, field, val)}
          />
        );
      case 'salary':
        if (!isSalaryTabVisible) return null;
        return (
          <TabSalaryInfo 
            employee={formData} 
            isEditing={canEdit} 
            onChange={(field, val) => handleFieldChange('salary', field, val)} 
          />
        );
      case 'security':
        return (
          <TabSecurity 
            employee={formData} 
            isEditing={isOwnProfile} // Security credentials only manageable by the profile owner
            onChange={(field, val) => handleFieldChange(null, field, val)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page-container">
      {/* Profile Header Details */}
      <section className="profile-hero-card card glassmorphism">
        <div className="profile-header-main">
          <div className="profile-avatar-wrapper">
            {formData.avatar ? (
              <img src={formData.avatar} alt={formData.name} className="profile-hero-avatar" />
            ) : (
              <div className="profile-hero-placeholder">{getInitials()}</div>
            )}
            
            {canEdit && (
              <label className="avatar-upload-label">
                📷 Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleFieldChange(null, 'avatar', reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="profile-title-details">
            <h1 className="profile-hero-name">{employee.name}</h1>
            <p className="profile-hero-id">ID: {employee.id}</p>
            <span className="profile-hero-role">
              {employee.role === 'HR' ? 'HR Administrator' : 'Company Employee'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="profile-action-controls">
          {!isEditing ? (
            <button 
              className="profile-btn btn-edit" 
              onClick={() => setIsEditing(true)}
            >
              📝 Edit Profile
            </button>
          ) : (
            <div className="action-button-group">
              <button className="profile-btn btn-save" onClick={handleSave}>
                💾 Save
              </button>
              <button className="profile-btn btn-cancel" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          )}
          
          {!isOwnProfile && (
            <button 
              className="profile-btn btn-back"
              onClick={() => setCurrentTab('dashboard')}
            >
              ⬅️ Back to List
            </button>
          )}
        </div>
      </section>

      {/* Profile Info Tabs Section */}
      <section className="profile-content-section card">
        <div className="profile-tabs-header">
          <button 
            className={`profile-tab-item ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button 
            className={`profile-tab-item ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            Private Info
          </button>
          {isSalaryTabVisible && (
            <button 
              className={`profile-tab-item ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              Salary Info
            </button>
          )}
          <button 
            className={`profile-tab-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security & Login
          </button>
        </div>

        <div className="profile-tab-content">
          {renderActiveTab()}
        </div>
      </section>
    </div>
  );
}
