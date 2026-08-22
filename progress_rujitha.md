# Progress Log - Rujitha (Authentication & Profile management)

## Tasks Completed
- **Phase 1: Authentication View & Logic**:
  - Toggle between Sign In and Sign Up modes.
  - Connected Sign In to `login()` from `AppContext`.
  - Connected Sign Up to `signup()` from `AppContext`.
  - Validated Employee ID/email and password.
  - Auto-generated Employee ID during signup using format: `[CO][First two letters of first and last name][Year][Serial]`.
  - Wired routing in `src/App.jsx` to render the `Login` page if no user is authenticated.
  - Designed high-end glassmorphic theme in `src/styles/login.css`.
- **Phase 2: Profile Page & Employee Tabs**:
  - Created modular sub-tabs: `TabResume.jsx`, `TabPrivateInfo.jsx`, `TabSecurity.jsx` inside `/src/components/`.
  - Implemented client-side base64 profile picture uploads in `Profile.jsx`.
  - Implemented local draft/edit state toggles and save integration for the Resume tab.
  - Enforced strict role-based permissions on Private Info tab: standard employees have restricted fields disabled.
  - Configured Security tab to handle secure password updates, checking old password constraints strictly.
  - Designed comprehensive style rules for Profile views in `src/styles/profile.css`.
  - Rendered the `Profile` page inside `src/App.jsx` when a user session is active.
- **Phase 3: Admin Actions & Salary Info**:
  - **Salary Management Authorization**: Restricted `TabSalaryInfo.jsx` to users with the `HR` role using context authorizations.
  - **Salary Calculations & Recalculations**: Connected dynamic formulas to Monthly Wage input: Basic is 50%, HRA is 40% of Basic, LTA is 10% of Basic, PF is 12% of Basic, and Yearly Wage is 12x of Monthly Wage.
  - **Profile Initialization Safety**: Enforced default schemas for `salaryInfo` and `privateInfo` inside `Profile.jsx`'s `useEffect` hook to prevent runtime errors on newly created employees.
  - **Admin Add Employee Form**: Added a modal and actions inside `Dashboard.jsx` for HR administrators to register new employees.
  - **ID Prefix Alignment**: Aligned the employee ID generator format inside `createEmployeeByAdmin` in `AppContext.jsx` to use the standardized `OD` prefix.

## Issues Faced / Pending Dependencies
- Windows spawner security prevents direct CLI execution, but dev server runs correctly and hot-reloads all updates immediately.

## Current Status
- **On track** (Phase 1, Phase 2, and Phase 3 completed).
