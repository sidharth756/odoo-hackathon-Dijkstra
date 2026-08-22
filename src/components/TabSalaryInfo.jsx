import React, { useEffect } from 'react';

export default function TabSalaryInfo({ employee, isEditing, onChange }) {
  const salary = employee.salaryInfo || {
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

  // Run dynamic recalculations when monthlyWage changes
  const handleWageChange = (newWage) => {
    const wage = Number(newWage) || 0;
    
    // Auto-calculate components
    const basic = Math.round(wage * 0.5);            // 50% of Monthly Wage
    const hra = Math.round(basic * 0.4);             // 40% of Basic
    const lta = Math.round(basic * 0.1);             // 10% of Basic
    const pfEmployee = Math.round(basic * 0.12);     // 12% of Basic
    const pfEmployer = Math.round(basic * 0.12);     // 12% of Basic
    const yearlyWage = wage * 12;

    // Trigger parent updates
    onChange('monthlyWage', wage);
    onChange('yearlyWage', yearlyWage);
    onChange('basic', basic);
    onChange('hra', hra);
    onChange('lta', lta);
    onChange('pfEmployee', pfEmployee);
    onChange('pfEmployer', pfEmployer);
  };

  const handleFieldUpdate = (field, val) => {
    onChange(field, Number(val) || 0);
  };

  return (
    <div className="tab-salary-container">
      {/* SECTION 1: Base Wages */}
      <h3 className="section-subtitle">Wage Details</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Monthly Wage (₹) *</label>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={salary.monthlyWage || ''}
              onChange={(e) => handleWageChange(e.target.value)}
              required
            />
          ) : (
            <div className="profile-text-display font-bold">
              ₹{(salary.monthlyWage || 0).toLocaleString('en-IN')} / month
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Yearly Wage (₹)</label>
          <div className="profile-text-display font-semibold bg-light-gray">
            ₹{(salary.yearlyWage || salary.monthlyWage * 12 || 0).toLocaleString('en-IN')} / year
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Working Days per Week</label>
          {isEditing ? (
            <select
              className="profile-select"
              value={salary.workingDays || 5}
              onChange={(e) => handleFieldUpdate('workingDays', e.target.value)}
            >
              <option value={5}>5 Days (Mon-Fri)</option>
              <option value={6}>6 Days (Mon-Sat)</option>
            </select>
          ) : (
            <div className="profile-text-display">
              {salary.workingDays || 5} days a week
            </div>
          )}
        </div>
      </div>

      <hr className="profile-section-divider" />

      {/* SECTION 2: Allowances (Salary Components) */}
      <h3 className="section-subtitle">Monthly Allowances</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Basic Salary (50% of Wage)</label>
          <div className="profile-text-display">
            ₹{(salary.basic || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">HRA (40% of Basic)</label>
          <div className="profile-text-display">
            ₹{(salary.hra || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">LTA (10% of Basic)</label>
          <div className="profile-text-display">
            ₹{(salary.lta || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Standard Allowance (₹)</label>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={salary.standardAllowance || ''}
              onChange={(e) => handleFieldUpdate('standardAllowance', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              ₹{(salary.standardAllowance || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Performance Bonus (₹)</label>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={salary.performanceBonus || ''}
              onChange={(e) => handleFieldUpdate('performanceBonus', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              ₹{(salary.performanceBonus || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Food Allowance (₹)</label>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={salary.foodAllowance || ''}
              onChange={(e) => handleFieldUpdate('foodAllowance', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              ₹{(salary.foodAllowance || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>

      <hr className="profile-section-divider" />

      {/* SECTION 3: Provident Fund & Deductions */}
      <h3 className="section-subtitle">Deductions & Contributions</h3>
      <div className="profile-form-grid">
        <div className="form-group-half">
          <label className="profile-input-label">Employee PF Contribution (12% of Basic)</label>
          <div className="profile-text-display">
            ₹{(salary.pfEmployee || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Employer PF Contribution (12% of Basic)</label>
          <div className="profile-text-display">
            ₹{(salary.pfEmployer || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="form-group-half">
          <label className="profile-input-label">Professional Tax (₹)</label>
          {isEditing ? (
            <input
              type="number"
              className="profile-input"
              value={salary.professionalTax || ''}
              onChange={(e) => handleFieldUpdate('professionalTax', e.target.value)}
            />
          ) : (
            <div className="profile-text-display">
              ₹{(salary.professionalTax || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
