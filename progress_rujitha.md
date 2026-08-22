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
- **Phase 4: Integration & Branch Merge**:
  - **Data Integration & Persistence**: Verified profile changes for Resume info, Personal Info, Address, Phone, Avatar/profile image, Password updates, and Salary info correctly bind to `AppContext` and persist automatically to local storage using the unified state management.
  - **Security Check on Save**: Added input filters inside `Profile.jsx`'s `handleSave` to reset any restricted fields to their original values if updated by standard employees.
  - **Style Cleanups**: Refined `login.css` with custom borders, transitions, and focus styles. Added missing `.avatar-upload-overlay`, `.tab-salary-container`, and `.btn-logout` classes to `profile.css` for a premium, unified visual experience.
  - **Pre-Merge Validation**: Successfully integrated and resolved all previous merge conflicts. Verified 0 conflict markers remain in the repository.
- **UI & Emoji Cleanup**:
  - **Lightweight SVG Icons**: Built `src/components/Icons.jsx` to provide outline SVG icons (matching Icons8 visual reference) without adding any heavy npm dependencies.
  - **Emoji Removal**: Scoured the entire source code and removed all user-facing emojis from buttons, tabs, headers, forms, empty states, and notifications.
  - **Icon Replacements**: Integrated SVG icons into `CheckInWidget`, `Login` demo buttons, `Dashboard` actions/search, `Profile` page controls, `TabPrivateInfo` labels, `TabSecurity` forms, `TabSalaryInfo` panels, `Attendance` tables, `TimeOff` balance cards, and global toast notifications.
- **New Requirements (Permissions & Attendance Dashboard)**:
  - **Strict Profile View Permissions**: Restructured edit controls so a regular employee can edit *only* address, phone, and avatar on their **own** profile (`loggedInUser.id === viewedProfile.id`), and can edit **nothing** (fully view-only with edit buttons hidden) when viewing another employee's profile. HR Admins can edit all fields as usual.
  - **Admin Attendance Daily & Weekly Dashboard**: Implemented Daily and Weekly attendance views for HR Admins in `Attendance.jsx`. Daily view displays calculated statuses (`Present`, `Absent`, `Half-day`, `Leave`) for all employees for a selected date. Weekly view displays grid statuses (Mon-Sun) using color-coded indicator icons. Regular employees can only view their personal check-in/out timestamps and are locked out of admin controls.

## Integration Issues Resolved
- Added safety checks in `Profile.jsx` to ensure newly registered or legacy employees without populated `salaryInfo` or `privateInfo` fields do not throw null pointer exceptions on profile render.
- Realigned regular employee tab permissions: confirmed Personal Email field is locked to HR-only.

## Git Merge & Conflict Status
- **Merge Status**: Completed integration with Shebha and Sidharth's attendance and time-off components.
- **Conflicts Resolved**: 0 merge conflicts.

## Current Status
- **On track** (All phases and new dashboard permissions fully completed).
