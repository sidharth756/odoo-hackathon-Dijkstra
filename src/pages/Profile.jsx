import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import TabResume from '../components/TabResume';
import TabPrivateInfo from '../components/TabPrivateInfo';
import TabSalaryInfo from '../components/TabSalaryInfo';
import TabSecurity from '../components/TabSecurity';
<<<<<<< HEAD
import { PencilIcon, SaveIcon, CloseIcon, LogoutIcon, BackIcon, CameraIcon } from '../components/Icons';
=======
import { EditIcon, CheckIcon, XIcon, ChevronDownIcon, UploadIcon } from '../components/Icons';
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
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
        finalData.id = employee.id;
        
        if (employee.privateInfo) {
          finalData.privateInfo = {
            ...formData.privateInfo,
            dob: employee.privateInfo.dob,
            gender: employee.privateInfo.gender,
            maritalStatus: employee.privateInfo.maritalStatus,
            nationality: employee.privateInfo.nationality,
            personalEmail: employee.privateInfo.personalEmail,
            bankName: employee.privateInfo.bankName,
            ifsc: employee.privateInfo.ifsc,
            accountNo: employee.privateInfo.accountNo
          };
        }
        
        if (employee.salaryInfo) {
          finalData.salaryInfo = { ...employee.salaryInfo };
        }
      }

      updateProfile(employee.id, finalData);
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
    if (!employee.name) return 'ME';
    const cleanName = employee.name.replace(/[^a-zA-Z ]/g, '').trim();
    const parts = cleanName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'ME';
  };

  const handleAvatarClick = () => {
    if (canEdit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (limit to 2MB to prevent localStorage overflow)
      if (file.size > 2 * 1024 * 1024) {
        showNotification("Image must be smaller than 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(null, 'avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
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
            // regular employee is restricted to allowed personal fields
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
          <div 
            className={`profile-avatar-wrapper ${canEdit ? 'editable' : ''}`} 
            onClick={handleAvatarClick}
            style={{ cursor: canEdit ? 'pointer' : 'default' }}
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt={formData.name} className="profile-hero-avatar" />
            ) : (
              <div className="profile-hero-placeholder">{getInitials()}</div>
            )}
            
            {canEdit && (
<<<<<<< HEAD
              <div className="avatar-upload-overlay">
                <span><CameraIcon size={14} style={{ marginRight: '4px' }} /> Upload</span>
              </div>
=======
              <label className="avatar-upload-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UploadIcon size={12} />
                <span>Upload</span>
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
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
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
<<<<<<< HEAD
              <PencilIcon size={14} style={{ marginRight: '6px' }} /> Edit Profile
=======
              <EditIcon size={14} />
              <span>Edit Profile</span>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
            </button>
          ) : canUserEditProfile && isEditing ? (
            <div className="action-button-group">
              <button className="profile-btn btn-save" onClick={handleSave}>
<<<<<<< HEAD
                <SaveIcon size={14} style={{ marginRight: '6px' }} /> Save
              </button>
              <button className="profile-btn btn-cancel" onClick={handleCancel}>
                <CloseIcon size={14} style={{ marginRight: '6px' }} /> Cancel
=======
                <CheckIcon size={14} />
                <span>Save</span>
              </button>
              <button className="profile-btn btn-cancel" onClick={handleCancel}>
                <XIcon size={14} />
                <span>Cancel</span>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
              </button>
            </div>
          ) : null}
          
          {!isOwnProfile && (
            <button 
              className="profile-btn btn-back"
              onClick={() => setCurrentTab('dashboard')}
            >
<<<<<<< HEAD
              <BackIcon size={14} style={{ marginRight: '6px' }} /> Back to List
            </button>
          )}

          {isOwnProfile && (
            <button className="profile-btn btn-logout" onClick={logout}>
              <LogoutIcon size={14} style={{ marginRight: '6px' }} /> Sign Out
=======
              <ChevronDownIcon size={14} style={{ transform: 'rotate(90deg)' }} />
              <span>Back to List</span>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
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
