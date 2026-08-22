# Rujitha's Task Checklist (Auth & Profiles)

## Phase 1: Authentication View & Logic (10:00 AM - 11:00 AM)
- [ ] Implement `src/pages/Login.jsx`
  - Toggle between Sign In and Sign Up modes
  - Hook up inputs to `login()` and `signup()` from `AppContext`
  - Handle login credentials validation (ID/email and password)
  - Auto-generate ID on Sign Up: format `[CO][First two letters of first and last name][Year][Serial]` (e.g. `ODOO20260001`)

## Phase 2: Profile Page & Employee Tabs (11:00 AM - 1:00 PM)
- [ ] Implement `src/pages/Profile.jsx`
  - Profile header with profile image upload, employee ID, role, and tab navigation
  - Sub-views for tab switching (Resume, Private Info, Salary Info, Security)
- [ ] Implement `src/components/TabResume.jsx`
  - Fields for Summary, Work Experience, Interests, Certifications
  - View-only vs Edit-only state logic
- [ ] Implement `src/components/TabPrivateInfo.jsx`
  - Fields for DOB, Gender, Marital Status, Nationality, Address, Personal Email, Phone, Bank Account Details (Bank Name, IFSC, Account Number)
  - View-only vs Edit-only state logic (Regular employees can edit only Address, Phone, and Avatar)
- [ ] Implement `src/components/TabSecurity.jsx`
  - Change Password fields (Current Password, New Password, Confirm New Password)

## Phase 3: Admin Actions & Salary Info (1:00 PM - 3:00 PM)
- [ ] Implement `src/components/TabSalaryInfo.jsx`
  - Visible ONLY to Admin (Role: HR)
  - Shows Monthly Wage, Yearly Wage, Working Days
  - Lists salary components (Basic, HRA, Standard Allowance, Performance Bonus, LTA, Food Allowance)
  - Shows deductions (PF Contribution, Professional Tax)
  - Auto-calculates components (e.g. Basic is 50% of Wage, HRA is 40% of Basic, etc.)
- [ ] Implement Admin "Add Employee" Form
  - HR Admin can add a new employee, which automatically generates system credentials (default password: 'password')

## Phase 4: Integration & Branch Merge (3:00 PM - 5:00 PM)
- [ ] Connect profile changes to local storage via AppContext
- [ ] Clean up styling in `src/styles/login.css` and `src/styles/profile.css`
- [ ] Merge changes into `main` branch and resolve any conflicts with Sidharth

## Phase 5: Verification (5:00 PM - 5:30 PM)
- [ ] Verify profile limits (Regular employee cannot edit job title or salary info)
- [ ] Verify new user signups can log in successfully
