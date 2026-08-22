import React, { useState } from 'react';
import '../styles/profile.css';

export default function TabResume({ employee, updateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(employee.resume?.summary || '');
  const [experience, setExperience] = useState(employee.resume?.experience || '');
  const [interests, setInterests] = useState(employee.resume?.interests || '');
  const [certifications, setCertifications] = useState(employee.resume?.certifications || '');

  const handleEdit = () => {
    setSummary(employee.resume?.summary || '');
    setExperience(employee.resume?.experience || '');
    setInterests(employee.resume?.interests || '');
    setCertifications(employee.resume?.certifications || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(employee.id, {
      resume: {
        summary: summary.trim(),
        experience: experience.trim(),
        interests: interests.trim(),
        certifications: certifications.trim()
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="tab-resume">
      <div className="tab-header">
        <h2>Resume Details</h2>
        {!isEditing && (
          <button type="button" className="btn-edit" onClick={handleEdit}>
            Edit Resume
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="resume-view-mode">
          <div className="resume-section">
            <h3>Professional Summary</h3>
            <p className="resume-text">{employee.resume?.summary || 'No summary provided yet.'}</p>
          </div>

          <div className="resume-section">
            <h3>Work Experience</h3>
            <p className="resume-text">{employee.resume?.experience || 'No work experience listed yet.'}</p>
          </div>

          <div className="resume-section">
            <h3>Interests & Hobbies</h3>
            <p className="resume-text">{employee.resume?.interests || 'No interests listed yet.'}</p>
          </div>

          <div className="resume-section">
            <h3>Certifications</h3>
            <p className="resume-text">{employee.resume?.certifications || 'No certifications listed yet.'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="resume-edit-form">
          <div className="form-group">
            <label htmlFor="summary">Professional Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Briefly describe your career, key achievements, or professional background..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Work Experience</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Detail your employment history, roles, responsibilities, and key projects..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interests">Interests & Hobbies</label>
            <textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="What are your hobbies or outside interests?"
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="certifications">Certifications</label>
            <textarea
              id="certifications"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="List professional courses, degrees, or certifications (e.g. React Developer Cert)..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save Changes</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
