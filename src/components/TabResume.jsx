import React from 'react';

export default function TabResume({ employee, isEditing, onChange }) {
  const resume = employee.resume || { summary: '', experience: '', interests: '', certifications: '' };

  const fields = [
    { key: 'summary', label: 'Professional Summary', placeholder: 'Brief summary of your professional background...' },
    { key: 'experience', label: 'Work History / Experience', placeholder: 'List your past positions and responsibilities...' },
    { key: 'interests', label: 'Personal Interests / Hobbies', placeholder: 'Coding, design, basketball, hiking...' },
    { key: 'certifications', label: 'Certifications & Credentials', placeholder: 'AWS Developer, Odoo Partner, Scrum Master...' }
  ];

  return (
    <div className="tab-resume-container">
      <div className="profile-form-grid">
        {fields.map((field) => (
          <div key={field.key} className="form-group-full">
            <label className="profile-input-label">{field.label}</label>
            {isEditing ? (
              <textarea
                className="profile-textarea"
                placeholder={field.placeholder}
                value={resume[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                rows={4}
              />
            ) : (
              <div className="profile-text-display">
                {resume[field.key] ? (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{resume[field.key]}</p>
                ) : (
                  <span className="text-light">No information provided yet.</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
