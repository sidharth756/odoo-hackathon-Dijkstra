import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import TabResume from '../components/TabResume';
import TabPrivateInfo from '../components/TabPrivateInfo';
import TabSalaryInfo from '../components/TabSalaryInfo';
import TabSecurity from '../components/TabSecurity';
import { PencilIcon, SaveIcon, CloseIcon, LogoutIcon, BackIcon, CameraIcon } from '../components/Icons';
import '../styles/profile.css';

export default function Profile() {
  const { 
    currentUser, 
    viewedEmployeeId, 
    employees, 
    updateProfile, 
    showNotification,
    setCurrentTab,
    logout
  } = useContext(AppContext);

  // Retrieve the employee being viewed
  const employee = employees.find(e => e.id === viewedEmployeeId) || currentUser;

  const [activeTab, setActiveTab] = useState('resume');
  const [isEditing, setIsEditing] = useState(false);

  // Form states populated from the employee data
  const [formData, setFormData] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee) {
      const cloned = JSON.parse(JSON.stringify(employee));
      if (!cloned.privateInfo) {
        cloned.privateInfo = {
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
      }
      if (!cloned.salaryInfo) {
        cloned.salaryInfo = {
          monthlyWage: 50000,
          yearlyWage: 600000,
          workingDays: 5,
          basic: 25000,
          hra: 10000,
          standardAllowance: 5000,
          performanceBonus: 5000,
          lta: 2500,
          foodAllowance: 2500,
          pfEmployee: 3000,
          pfEmployer: 3000,
          professionalTax: 200
        };
      }
      setFormData(cloned);
    }
  }, [employee, isEditing]);

  if (!currentUser || !employee || !formData) return null;

  const isOwnProfile = currentUser.id === employee.id;
  const isAdmin = currentUser.role === 'HR';
  const canUserEditProfile = isAdmin || isOwnProfile;
  
  // Rule checks
  const canEdit = isEditing && canUserEditProfile;
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
      let finalData = { ...formData };
      if (!isAdmin) {
        // If not admin, restore all restricted fields to original values to enforce permissions
        finalData.name = employee.name;
        finalData.email = employee.email;
        finalData.role = employee.role;
        finalData.privateInfo.dob = employee.privateInfo?.dob || '';
        finalData.privateInfo.gender = employee.privateInfo?.gender || '';
        finalData.privateInfo.maritalStatus = employee.privateInfo?.maritalStatus || '';
        finalData.privateInfo.nationality = employee.privateInfo?.nationality || '';
        finalData.privateInfo.personalEmail = employee.privateInfo?.personalEmail || '';
        finalData.privateInfo.bankName = employee.privateInfo?.bankName || '';
        finalData.privateInfo.ifsc = employee.privateInfo?.ifsc || '';
        finalData.privateInfo.accountNo = employee.privateInfo?.accountNo || '';
        finalData.salaryInfo = employee.salaryInfo;
      }

      if (!isAdmin && !isOwnProfile) {
        // Double check standard employee cannot change other profile details at all
        finalData.phone = employee.phone;
        finalData.privateInfo.address = employee.privateInfo?.address || '';
        finalData.avatar = employee.avatar;
      }

      updateProfile(employee.id, finalData);
      showNotification('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showNotification(err.message || 'Failed to update profile.', 'error');
    }
  };

  const handleCancel = () => {
    // Reset to the original employee data
    setFormData(JSON.parse(JSON.stringify(employee)));
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showNotification('File size too large. Max 1MB allowed.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(null, 'avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (canEdit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Render sub-components based on active tab
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
            isRestricted={!isAdmin}
            onChange={(field, val) => handleFieldChange('privateInfo', field, val)}
            onBaseFieldChange={(field, val) => handleFieldChange(null, field, val)}
          />
        );
      case 'salary':
        if (!isSalaryTabVisible) return null;
        return (
          <TabSalaryInfo 
            employee={formData} 
            isEditing={canEdit} 
            onChange={(field, val) => handleFieldChange('salaryInfo', field, val)} 
          />
        );
      case 'security':
        return (
          <TabSecurity 
            employee={formData} 
            isEditing={isOwnProfile} 
            onChange={(field, val) => handleFieldChange(null, field, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page-container">
      {/* Profile Hero Card */}
      <section className="profile-hero-card card glassmorphism">
        <div className="profile-hero-main">
          {/* Avatar wrapper */}
          <div 
            className={`profile-avatar-wrapper ${canEdit ? 'editable' : ''}`}
            onClick={handleAvatarClick}
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                {(formData.name || 'EM').substring(0, 2).toUpperCase()}
              </div>
            )}
            
            {canEdit && (
              <div className="avatar-upload-overlay">
                <span><CameraIcon size={14} style={{ marginRight: '4px' }} /> Upload</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" 
              style={{ display: 'none' }}
            />
          </div>

          <div className="profile-title-details">
            <h1 className="profile-hero-name">{employee.name}</h1>
            <p className="profile-hero-id">ID: {employee.id}</p>
            <span className="profile-hero-role">
              {employee.role === 'HR' ? 'HR Administrator' : 'Company Employee'}
            </span>
          </div>
        </div>

        <div className="profile-action-controls">
          {canUserEditProfile && !isEditing ? (
            <button 
              className="profile-btn btn-edit" 
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon size={14} style={{ marginRight: '6px' }} /> Edit Profile
            </button>
          ) : canUserEditProfile && isEditing ? (
            <div className="action-button-group">
              <button className="profile-btn btn-save" onClick={handleSave}>
                <SaveIcon size={14} style={{ marginRight: '6px' }} /> Save
              </button>
              <button className="profile-btn btn-cancel" onClick={handleCancel}>
                <CloseIcon size={14} style={{ marginRight: '6px' }} /> Cancel
              </button>
            </div>
          ) : null}
          
          {!isOwnProfile && (
            <button 
              className="profile-btn btn-back"
              onClick={() => setCurrentTab('dashboard')}
            >
              <BackIcon size={14} style={{ marginRight: '6px' }} /> Back to List
            </button>
          )}

          {isOwnProfile && (
            <button className="profile-btn btn-logout" onClick={logout}>
              <LogoutIcon size={14} style={{ marginRight: '6px' }} /> Sign Out
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
