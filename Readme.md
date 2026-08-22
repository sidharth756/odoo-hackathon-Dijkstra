# 🏢 Dayflow HRMS — Human Resource Management System

> **Team Dijkstra** · Odoo Hackathon 2026 · React + Vite · Zero-backend, fully browser-based

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Team & Responsibilities](#2-team--responsibilities)
3. [Tech Stack](#3-tech-stack)
4. [Feature Summary](#4-feature-summary)
5. [Getting Started](#5-getting-started)
6. [Demo Credentials & Seed Data](#6-demo-credentials--seed-data)
7. [Architecture & State Management](#7-architecture--state-management)
8. [Module-by-Module Breakdown](#8-module-by-module-breakdown)
   - [8.1 Authentication (Login/Signup)](#81-authentication-loginsignup)
   - [8.2 Employee Dashboard (Directory)](#82-employee-dashboard-directory)
   - [8.3 Profile Page](#83-profile-page)
   - [8.4 Resume Tab](#84-resume-tab)
   - [8.5 Personal Info Tab](#85-personal-info-tab)
   - [8.6 Salary Info Tab](#86-salary-info-tab)
   - [8.7 Security & Login Tab](#87-security--login-tab)
   - [8.8 Attendance Tracking](#88-attendance-tracking)
   - [8.9 Time Off & Leave Management](#89-time-off--leave-management)
   - [8.10 Check-In / Check-Out Widget](#810-check-in--check-out-widget)
   - [8.11 Toast Notifications](#811-toast-notifications)
   - [8.12 Icon Library](#812-icon-library)
9. [Permission & Role Model](#9-permission--role-model)
10. [Attendance Status Logic](#10-attendance-status-logic)
11. [Data Schema Reference](#11-data-schema-reference)
12. [Salary Calculation Formulas](#12-salary-calculation-formulas)
13. [File & Directory Reference](#13-file--directory-reference)
14. [Branch Strategy](#14-branch-strategy)
15. [Design System](#15-design-system)
16. [Known Limitations](#16-known-limitations)

---

## 1. Project Overview

**Dayflow** is a browser-based Human Resource Management System (HRMS) built for the Odoo Hackathon 2026. It covers the full HR employee lifecycle — onboarding, profile management, attendance tracking, and leave administration — within a single-page React application.

**Key design goals:**
- **Zero backend** — all data stored in `localStorage` via React Context
- **Role-aware** — HR Admin and Employee roles each get a distinct, gated experience
- **Production-grade UI** — glassmorphic dark-tinted cards, smooth transitions, outline SVG icon library, consistent Odoo-style design tokens
- **Clean codebase** — no emoji in source, no inline styles except where strictly necessary, modular component architecture

---

## 2. Team & Responsibilities

| Developer | Git Branch | Ownership |
|-----------|------------|-----------|
| **Sidharth** | `dev-sidhu` | AppContext state design, localStorage architecture, Check-In/Check-Out widget, Employee Directory (EmployeeCard, Navbar) |
| **Rujitha** | `dev-ruji` | Authentication (Login/Signup), Profile page, all four Profile tabs, Salary Info, Admin "Add Employee" modal, Attendance Daily/Weekly dashboard, SVG Icon Library, UI emoji cleanup |
| **Shebha** | `dev-shebha` | Time Off & Leave management (request, balance tracking, calendar, admin approval) |

All branches merged into `main`; merge conflicts resolved cleanly.

---

## 3. Tech Stack

| Concern | Choice | Reason |
|---------|--------|--------|
| UI Framework | **React 19** | Concurrent features, fast re-renders |
| Build Tool | **Vite 8** | Instant HMR, minimal config |
| Styling | **Vanilla CSS + CSS Custom Properties** | Full design-token control, no utility bloat |
| Icons | **Custom SVG components** (`Icons.jsx`) | Zero dependencies, consistent outline style |
| State | **React Context API** | Fits zero-backend scope; avoids Redux overhead |
| Persistence | **`localStorage`** | Instant persistence, no server needed |
| Linting | **OxLint** | Fast Rust-based linter |
| Language | **JSX / ES Modules** | Standard React stack |

---

## 4. Feature Summary

| Feature | HR Admin | Employee |
|---------|----------|----------|
| Sign In / Sign Up | ✅ | ✅ |
| View employee directory | ✅ | ✅ |
| Add new employee | ✅ | ❌ |
| View any employee profile | ✅ | ✅ |
| Edit own profile (Address/Phone/Avatar) | ✅ | ✅ |
| Edit another employee's profile | ✅ | ❌ |
| View Salary Info tab | ✅ | ❌ |
| Edit Salary Info | ✅ | ❌ |
| Check In / Check Out | ✅ | ✅ |
| Attendance — Daily View (all employees) | ✅ | ❌ |
| Attendance — Weekly View (all employees) | ✅ | ❌ |
| View own attendance log | ✅ | ✅ |
| Submit leave request | ✅ | ✅ |
| Approve / Reject leave requests | ✅ | ❌ |
| View leave calendar | ✅ | ✅ |

---

## 5. Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd odoo-hackathon-Dijkstra

# Install dependencies
npm install

# Start the development server
npm run dev
```

App runs at **http://localhost:5173**

### Other Scripts

```bash
npm run build    # Production bundle (output: dist/)
npm run preview  # Serve the production build locally
npm run lint     # Run OxLint static analysis
```

---

## 6. Demo Credentials & Seed Data

The app ships with three pre-seeded employees. On first load, data is written from `initialEmployees` to `localStorage`. Clearing localStorage resets the app to this seed state.

| Name | Employee ID | Email | Role | Password |
|------|-------------|-------|------|----------|
| Sidharth (Admin) | `ODOO20260001` | sidharth@odoo.com | HR Admin | `password` |
| Rujitha | `ODOO20260002` | rujitha@odoo.com | Employee | `password` |
| Shebha | `ODOO20260003` | shebha@odoo.com | Employee | `password` |

> The Login page has **Quick Demo Access** buttons that log you in instantly as either role.

> Sign Up creates a new employee with a system-generated ID and default `Employee` role.

---

## 7. Architecture & State Management

### Central State — `AppContext.jsx`

All application state lives in a single React Context provider (`AppProvider`) wrapping the app root. Every state slice auto-syncs to `localStorage` via a dedicated `useEffect`.

```
AppProvider
  ├── employees[]          → dayflow_employees
  ├── attendance[]         → dayflow_attendance
  ├── leaves[]             → dayflow_leaves
  ├── currentUser          → dayflow_current_user
  ├── currentTab           (in-memory, no persistence)
  ├── viewedEmployeeId     (in-memory)
  └── notifications[]      (in-memory, auto-cleared after 4 s)
```

### Context API Surface

```js
// Auth
login(emailOrId, password)       // throws on failure
logout()
signup(userData)                 // auto-generates Employee ID

// Profile
updateProfile(employeeId, fields)        // deep-merges resume/privateInfo/salaryInfo
createEmployeeByAdmin(userData)          // HR-only; default password = "password"

// Attendance
checkIn(employeeId, timeString)
checkOut(employeeId, timeString)         // calculates workHours automatically
getEmployeeStatus(employeeId)            // returns "Present" | "On Leave" | "Absent" (today)

// Leave
requestLeave(leaveData)
updateLeaveStatus(leaveId, status, comments)

// UI
showNotification(message, type)          // type: 'success' | 'error' | 'info'
setCurrentTab(tab)                       // 'dashboard' | 'profile' | 'attendance' | 'timeoff'
setViewedEmployeeId(id)
```

### Data Flow

```
User Action
    │
    ▼
Component calls Context function (e.g. updateProfile)
    │
    ▼
State updated via setState
    │
    ├──► useEffect syncs slice to localStorage
    │
    └──► All subscribed components re-render
```

---

## 8. Module-by-Module Breakdown

### 8.1 Authentication (Login/Signup)

**File:** `src/pages/Login.jsx` | **Styles:** `src/styles/login.css`

The login page is a split-layout with a branded gradient sidebar (left) and a glassmorphic auth card (right).

**Sign In flow:**
1. User enters Employee ID **or** Email and their password
2. Calls `login(emailOrId, password)` from context
3. On success → `currentUser` set → app routes to Dashboard
4. On failure → error toast shown

**Sign Up flow:**
1. User enters Full Name, Email, Password
2. Employee ID auto-generated:
   ```
   OD + [First initial of first name] + [First initial of last name] + [Year] + [4-digit serial]
   Example: "Riya Mehta" → ODRM20260004
   ```
3. New employee record created with blank `resume`, `privateInfo`, and default `salaryInfo`
4. User is immediately logged in

**Quick Demo Access:** Two buttons log in instantly as Admin or Employee (for hackathon demo convenience).

---

### 8.2 Employee Dashboard (Directory)

**File:** `src/pages/Dashboard.jsx` | **Styles:** `src/styles/dashboard.css`

Displays all employees as a responsive card grid. Each card (`EmployeeCard.jsx`) shows:
- Avatar or initials placeholder
- Name, Employee ID, role, email
- A status dot (green = Present, yellow = On Leave, red = Absent) from `getEmployeeStatus()`

**Clicking a card** sets `viewedEmployeeId` and navigates to the Profile page.

**HR Admin extras:**
- **Search bar** — filter employees by name or ID in real-time
- **Add Employee button** — opens a glassmorphic modal form
  - Required fields: Name, Email, Job Title (optional)
  - Calls `createEmployeeByAdmin()` → auto-generates ID, sets default password `"password"`
  - New employee appears immediately in the directory

---

### 8.3 Profile Page

**File:** `src/pages/Profile.jsx` | **Styles:** `src/styles/profile.css`

The profile page resolves the employee being viewed from `viewedEmployeeId`:
```js
const employee = employees.find(e => e.id === viewedEmployeeId) || currentUser;
```

**Key state variables:**
- `formData` — deep clone of the employee object; mutated locally during editing
- `isEditing` — toggles between view and edit mode
- `activeTab` — which sub-tab is shown (`resume` | `private` | `salary` | `security`)

**Edit flow:**
1. Click **Edit Profile** → `isEditing = true`, inputs become editable
2. `handleFieldChange(section, field, value)` updates `formData` (deep nested path)
3. Click **Save** → `handleSave()` applies permission filters then calls `updateProfile()`
4. Click **Cancel** → `handleCancel()` resets `formData` from live employee record

**Permission gate (before Save):**
```
if (!isAdmin) {
  reset: name, email, role, dob, gender, maritalStatus,
         nationality, personalEmail, bankName, ifsc, accountNo,
         salaryInfo (entire object)
}
if (!isAdmin && !isOwnProfile) {
  reset: phone, address, avatar as well
}
```
This means a regular employee can *never* persist unauthorized field changes even if they manipulate the DOM.

**Avatar upload:** File input triggers a `FileReader` to convert the image to a base64 data URL stored directly in `employee.avatar`.

---

### 8.4 Resume Tab

**File:** `src/components/TabResume.jsx`

| Field | Type | Both roles editable? |
|-------|------|---------------------|
| Professional Summary | Textarea | ✅ (own profile only) |
| Work Experience | Textarea | ✅ |
| Interests & Hobbies | Text input | ✅ |
| Certifications | Text input | ✅ |

When `isEditing` is false, all fields render as read-only text. When viewing another employee's profile, the parent sets `isEditing={false}` regardless.

---

### 8.5 Personal Info Tab

**File:** `src/components/TabPrivateInfo.jsx`

Divided into three visual sections:

**Section 1 — Personal Identity**
| Field | HR Admin | Own Profile (Employee) | Other Profile (Employee) |
|-------|----------|----------------------|------------------------|
| Date of Birth | Edit | View only | View only |
| Gender | Edit | View only | View only |
| Marital Status | Edit | View only | View only |
| Nationality | Edit | View only | View only |

**Section 2 — Contact & Address** *(heading centered)*
| Field | HR Admin | Own Profile (Employee) | Other Profile (Employee) |
|-------|----------|----------------------|------------------------|
| Phone Number | Edit | **Edit** | View only |
| Personal Email | Edit | View only | View only |
| Permanent Address | Edit | **Edit** | View only |

**Section 3 — Banking Details**
| Field | HR Admin | Own Profile (Employee) | Other Profile (Employee) |
|-------|----------|----------------------|------------------------|
| Bank Name | Edit | View only | View only |
| IFSC Code | Edit | View only | View only |
| Account Number | Edit | View only | View only |

The `canEditField(isRestrictedField)` helper centralises the permission check:
```js
const canEditField = (isRestrictedField) => {
  if (!isEditing) return false;
  if (isRestricted && isRestrictedField) return false;
  return true;
};
// isRestricted = !isAdmin (always true for regular employees)
```

---

### 8.6 Salary Info Tab

**File:** `src/components/TabSalaryInfo.jsx`

**Visible only to HR Admin.** If `currentUser.role !== 'HR'`, a lock notice is displayed and the tab content is not rendered.

**Salary structure displayed:**

| Component | Category |
|-----------|---------|
| Monthly Wage | Base |
| Yearly Wage | Derived |
| Working Days / Week | Config |
| Basic | Earning |
| HRA | Earning |
| Standard Allowance | Earning |
| Performance Bonus | Earning |
| LTA | Earning |
| Food Allowance | Earning |
| PF (Employee contribution) | Deduction |
| PF (Employer contribution) | Info |
| Professional Tax | Deduction |
| **Net Monthly Pay** | Computed total |

When editing, changing **Monthly Wage** triggers `handleWageChange()` which auto-recalculates all components (see [Salary Calculation Formulas](#12-salary-calculation-formulas)).

---

### 8.7 Security & Login Tab

**File:** `src/components/TabSecurity.jsx`

Allows the profile owner (own profile only, both roles) to change their password.

**Change Password flow:**
1. Enter current password → validated against `employee.password` (fallback: `"123456"`)
2. Enter new password (minimum 6 characters)
3. Confirm new password (must match)
4. On valid submission → calls `onChange('password', newPass)` → parent `handleFieldChange` updates `formData`
5. Password only commits to storage when the user clicks the global **Save** button on the profile header

When `isEditing` is false, a notice is shown: *"Security details can only be edited by the profile owner."*

---

### 8.8 Attendance Tracking

**File:** `src/pages/Attendance.jsx` | **Styles:** `src/styles/attendance.css`

The page adapts its entire content based on `currentUser.role`.

#### HR Admin View

A **Daily / Weekly toggle** appears in the page header.

**Daily View:**
- Date picker → select any calendar date
- Employee search → filter by name or ID
- Full employee table: `Employee ID | Name | Date | Status`
- Status is computed live (see [§10](#10-attendance-status-logic))
- Status is displayed as a colour-coded pill badge

**Weekly View:**
- Date picker → select any date within the desired week
- Week automatically derived as Mon–Sun from that date:
  ```js
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  const startOfWeek = new Date(date.setDate(diff));
  // → 7 dates from Monday to Sunday
  ```
- Grid table: `Employee | Mon | Tue | Wed | Thu | Fri | Sat | Sun`
- Each cell shows a circular icon indicator:

  | Status | Icon | CSS class | Colour |
  |--------|------|-----------|--------|
  | Present | CheckCircleIcon | `indicator-present` | Green |
  | Absent | CloseIcon | `indicator-absent` | Red |
  | Half-day | ClockIcon | `indicator-halfday` | Amber |
  | Leave | CalendarIcon | `indicator-leave` | Blue |

- A colour legend is shown below the table

#### Employee (Personal) View

- Date picker → select date
- Shows only the **logged-in employee's** own check-in/out log for that date:
  `Date | Check In | Check Out | Work Hours | Status`
- Admin toggle and admin employee table are completely hidden

---

### 8.9 Time Off & Leave Management

**File:** `src/pages/TimeOff.jsx` | **Styles:** `src/styles/timeoff.css`

#### Employee Features
- **Leave balance cards**: Paid Time Off (24 days) and Sick Leave (10 days), showing days used and remaining
- **Leave history list**: all submitted requests with type, dates, day count, and status pill
- **Leave calendar**: August 2026 month grid with approved-leave days highlighted
- **Request Time Off button**: opens a modal form
  - Select leave type (Paid / Sick / Unpaid)
  - Pick start and end dates (validates end ≥ start)
  - Add remarks and optional attachment
  - Checks remaining balance before submitting
  - Calls `requestLeave()` → new record with `status: "Pending"`

#### HR Admin Extras
- **Pending Approvals table**: lists all pending requests with employee name, type, dates, days, remarks
- **Approve / Reject buttons**: call `updateLeaveStatus(leaveId, status, comments)`

---

### 8.10 Check-In / Check-Out Widget

**File:** `src/components/CheckInWidget.jsx`

Displayed on the Dashboard sidebar. Features:
- **Live clock** — updates every second via `setInterval`
- Shows current time in `HH:MM:SS` format and short date
- Detects if the employee has already checked in today by searching `attendance` for `date === today`
- **Check In** button → calls `checkIn(employeeId, timeString)`
- **Check Out** button → calls `checkOut(employeeId, timeString)` → calculates `workHours` from difference of check-in and check-out times
- Shows check-in time after clocking in

---

### 8.11 Toast Notifications

**File:** `src/App.jsx` (ToastContainer component)

- `showNotification(message, type)` adds a notification object `{ id, message, type }` to the `notifications[]` array
- After **4000 ms**, the notification is auto-removed via `setTimeout`
- Three types: `success` (green) | `error` (red) | `info` (blue)
- Each toast shows an SVG icon:
  - `success` → `CheckCircleIcon`
  - `error` → `CloseIcon`
  - `info` → `WarningIcon`

---

### 8.12 Icon Library

**File:** `src/components/Icons.jsx`

A zero-dependency, inline SVG component library. All icons are 24×24 viewBox Feather/Icons8-style thin outlines, accepting `size`, `color`, `className`, and `style` props.

**Full icon list:**

| Export Name | Used For |
|-------------|---------|
| `DashboardIcon` | Navbar dashboard link |
| `UserIcon` | Login demo button, general user |
| `UsersIcon` | Login demo button, directory empty state |
| `UserPlusIcon` | Add Employee button |
| `LockIcon` | Security tab headings, Salary lock notice |
| `WalletIcon` | Salary Info tab, Paid Leave balance card |
| `CalendarIcon` | Attendance page header, Leave status icon |
| `PhoneIcon` | Contact & Address section, Phone label |
| `MailIcon` | Personal Email label |
| `LocationIcon` | Permanent Address label |
| `BankIcon` | Bank Name label |
| `KeyIcon` | IFSC Code label |
| `CardIcon` | Account Number label |
| `ClockIcon` | Check-In widget, Half-day attendance status |
| `WarningIcon` | Security notice, Info toast icon |
| `CheckInIcon` | Check-in action |
| `CheckOutIcon` | Check-out action |
| `PlusIcon` | Request Time Off button |
| `PencilIcon` | Edit Profile button |
| `TrashIcon` | Delete actions |
| `SaveIcon` | Save button |
| `LogoutIcon` | Sign Out button |
| `SearchIcon` | Dashboard search bar |
| `CloseIcon` | Cancel / modal close / Absent status |
| `BackIcon` | Back to List button |
| `CameraIcon` | Avatar upload overlay |
| `HeartIcon` | Sick Leave balance card |
| `CheckCircleIcon` | Success toast, Present attendance status |
| `ResumeIcon` | Resume tab, Unpaid Leave card, empty state |
| `GenderIcon` | Gender field label |
| `MaritalIcon` | Marital Status field label |
| `NationalityIcon` | Nationality field label |

---

## 9. Permission & Role Model

### Role definitions

| Role value | Description |
|------------|-------------|
| `"HR"` | Full administrator — unrestricted access to all employee data |
| `"Employee"` | Standard staff — self-service profile editing with limited scope |

Role is stored per employee record in the `employees[]` array and checked at runtime via `currentUser.role`.

### Profile editing permissions matrix

| Capability | HR Admin | Employee (own profile) | Employee (other profile) |
|-----------|----------|----------------------|-------------------------|
| View all tabs | ✅ | ✅ | ✅ |
| Edit Resume | ✅ | ✅ | ❌ |
| Edit Phone | ✅ | ✅ | ❌ |
| Edit Address | ✅ | ✅ | ❌ |
| Upload Avatar | ✅ | ✅ | ❌ |
| Edit DOB | ✅ | ❌ | ❌ |
| Edit Gender | ✅ | ❌ | ❌ |
| Edit Marital Status | ✅ | ❌ | ❌ |
| Edit Nationality | ✅ | ❌ | ❌ |
| Edit Personal Email | ✅ | ❌ | ❌ |
| Edit Bank Details | ✅ | ❌ | ❌ |
| View Salary Info tab | ✅ | ❌ | ❌ |
| Edit Salary Info | ✅ | ❌ | ❌ |
| Change password | ✅ (any) | ✅ (own) | ❌ |
| See Edit / Save buttons | ✅ | ✅ (own) | ❌ |

### Enforcement layers

Permission is enforced at **two independent layers** to prevent bypassing:

1. **UI layer** — Edit inputs are rendered as read-only `<div>` text elements. Save/Edit buttons are not rendered for unauthorized views.
2. **Save layer** — `handleSave()` in `Profile.jsx` resets any unauthorized fields to their original values before calling `updateProfile()`, so even a manually mutated DOM cannot persist disallowed changes.

---

## 10. Attendance Status Logic

The Attendance page computes employee status for any given date using this priority chain:

```
getEmployeeStatusForDate(empId, dateStr):
  1. Check leaves[] for an Approved leave covering dateStr
     → if found: return "Leave"

  2. Check attendance[] for a log entry matching (empId, dateStr)
     a. If log.status is "Half-day" | "Leave" | "Absent" → return that status
     b. If log.workHours > 0 AND < 4 → return "Half-day"
     c. If log.checkIn exists → return "Present"

  3. Default → return "Absent"
```

**The four allowed status values are strictly:**

| Value | Meaning | Visual |
|-------|---------|--------|
| `Present` | Employee checked in | Green check circle |
| `Absent` | No record for that date | Red X circle |
| `Half-day` | Work hours < 4 or explicit flag | Amber clock |
| `Leave` | Approved leave covers that date | Blue calendar |

---

## 11. Data Schema Reference

### Employee Object
```js
{
  id: "ODRJ20260004",           // auto-generated
  name: "Riya Mehta",
  email: "riya@odoo.com",
  phone: "+91 9876543210",
  role: "Employee",             // "Employee" | "HR"
  password: "password",
  avatar: "",                   // base64 data URL or empty string

  resume: {
    summary: "",
    experience: "",
    interests: "",
    certifications: ""
  },

  privateInfo: {
    dob: "",                    // "YYYY-MM-DD"
    gender: "",
    maritalStatus: "",          // "Single" | "Married" | "Divorced" | "Widowed"
    nationality: "",
    address: "",
    personalEmail: "",
    bankName: "",
    ifsc: "",
    accountNo: ""
  },

  salaryInfo: {
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
  }
}
```

### Attendance Log Object
```js
{
  employeeId: "ODRJ20260004",
  date: "2026-08-22",           // ISO date string (YYYY-MM-DD)
  checkIn: "09:05",             // "HH:MM" 24-hour
  checkOut: "18:30",
  status: "Present",            // "Present" | "Half-day" | "Absent" | "Leave"
  workHours: 9.42               // float, calculated on checkOut
}
```

### Leave Request Object
```js
{
  id: 1724311234567,            // Date.now() timestamp
  employeeId: "ODRJ20260004",
  type: "Paid",                 // "Paid" | "Sick" | "Unpaid"
  startDate: "2026-08-25",      // YYYY-MM-DD
  endDate: "2026-08-27",
  days: 3,
  remarks: "Family vacation",
  attachment: "medical.pdf",    // filename or empty string
  status: "Pending",            // "Pending" | "Approved" | "Rejected"
  comments: ""                  // HR admin comment on approval/rejection
}
```

---

## 12. Salary Calculation Formulas

When the HR Admin changes **Monthly Wage**, all salary components auto-recalculate:

| Component | Formula |
|-----------|---------|
| Yearly Wage | `monthlyWage × 12` |
| Basic | `monthlyWage × 0.50` |
| HRA | `basic × 0.40` |
| LTA | `basic × 0.10` |
| PF (Employee) | `basic × 0.12` |
| PF (Employer) | `basic × 0.12` |
| Standard Allowance | `monthlyWage × 0.10` |
| Performance Bonus | `monthlyWage × 0.10` |
| Food Allowance | `monthlyWage × 0.05` |
| Professional Tax | Fixed **₹200** |
| **Net Monthly Pay** | `basic + hra + standardAllowance + performanceBonus + lta + foodAllowance − pfEmployee − professionalTax` |

All intermediate values are rounded to the nearest integer using `Math.round()`.

---

## 13. File & Directory Reference

```
odoo-hackathon-Dijkstra/
│
├── index.html                      # Vite HTML shell (mounts #root)
├── vite.config.js                  # Vite config with React plugin
├── package.json                    # Dependencies: react, react-dom, vite, oxlint
├── .oxlintrc.json                  # OxLint rules
├── .gitignore
│
├── resources/                      # Hackathon planning docs
│   └── tasks_rujitha.md            # Rujitha's phase checklist
│
├── progress_rujitha.md             # Detailed progress log (Rujitha's work)
├── progress_shebha.md              # Progress log (Shebha's work)
│
└── src/
    ├── main.jsx                    # ReactDOM.createRoot entry point
    ├── index.css                   # Minimal global reset
    │
    ├── App.jsx
    │   ├── AppProvider wrapper
    │   ├── ToastContainer          # Renders notifications[] with SVG icons
    │   └── MainApp                 # Route switcher: dashboard/profile/attendance/timeoff
    │
    ├── context/
    │   └── AppContext.jsx          # All state, localStorage sync, API functions
    │
    ├── components/
    │   ├── Icons.jsx               # 31 custom outline SVG icon components
    │   ├── Navbar.jsx              # Sidebar nav (role-aware links, active state)
    │   ├── CheckInWidget.jsx       # Live clock + Check In/Out button
    │   ├── EmployeeCard.jsx        # Directory card (avatar, name, status dot)
    │   ├── TabResume.jsx           # Resume sub-tab
    │   ├── TabPrivateInfo.jsx      # Personal Info sub-tab (permission-aware)
    │   ├── TabSalaryInfo.jsx       # Salary Info sub-tab (HR Admin only)
    │   └── TabSecurity.jsx         # Password change sub-tab
    │
    ├── pages/
    │   ├── Login.jsx               # Split-layout auth page (Sign In + Sign Up)
    │   ├── Dashboard.jsx           # Employee directory + Add Employee modal
    │   ├── Profile.jsx             # Profile shell (header + 4 tabs + permission gate)
    │   ├── Attendance.jsx          # Daily/Weekly admin + personal log for employees
    │   └── TimeOff.jsx             # Leave requests, balances, calendar, approvals
    │
    └── styles/
        ├── global.css              # Design tokens, card, glassmorphism, toast, button
        ├── login.css               # Auth page layout, sidebar, input styles
        ├── dashboard.css           # Directory grid, employee card, add-employee modal
        ├── profile.css             # Profile header, avatar, tabs, form inputs, pi-grid
        ├── attendance.css          # Attendance table, filters, toggle, status indicators
        └── timeoff.css             # Balance cards, calendar, requests list, modal
```

---

## 14. Branch Strategy

```
main  (production-ready merged state)
 ├── dev-sidhu   Sidharth — AppContext, CheckInWidget, EmployeeCard, Navbar
 ├── dev-ruji    Rujitha  — Login, Profile, all tabs, Attendance dashboard, Icons
 └── dev-shebha  Shebha   — TimeOff, Leave management
```

All three branches have been merged into `main`. Merge conflicts (primarily in `App.jsx` and `AppContext.jsx`) were resolved manually, preserving all three developers' work.

---

## 15. Design System

### CSS Custom Properties (from `global.css`)

```css
--primary-color      /* Brand purple/blue */
--primary-light      /* Tinted background for highlights */
--bg-color           /* Page background */
--card-bg            /* Card surface */
--border-color       /* Dividers */
--text-main          /* Primary text */
--text-muted         /* Secondary / placeholder text */
--text-light         /* Lightest text */

--color-present      /* Green — attendance */
--color-on-leave     /* Red/orange — leave/absent */
--color-absent       /* Muted — absent */
--color-pending      /* Blue — pending status */

--border-radius      /* Standard card radius */
--border-radius-sm   /* Smaller radius (badges, inputs) */
--shadow-sm          /* Subtle elevation */
--shadow-md          /* Medium elevation */
--transition-fast    /* Quick hover transitions */
```

### Utility Classes

| Class | Effect |
|-------|--------|
| `.card` | Standard card surface (border, radius, shadow, bg) |
| `.glassmorphism` | Glassmorphic overlay effect |
| `.font-bold` | `font-weight: 700` |
| `.font-semibold` | `font-weight: 600` |
| `.text-light` | Muted placeholder text colour |
| `.status-pill` | Badge for status values |
| `.status-present` | Green pill |
| `.status-pending` | Blue pill |
| `.status-approved` | Green pill |
| `.status-rejected` | Red pill |

---

## 16. Known Limitations

| Area | Limitation |
|------|-----------|
| **Persistence** | `localStorage` — cleared if the user clears browser storage; no cloud sync |
| **Authentication** | Passwords stored in plaintext in localStorage (no hashing — suitable for demo only) |
| **Attendance** | Half-day status must be set manually in the log object; there is no UI to mark Half-day directly |
| **Leave calendar** | Hardcoded to August 2026 for the hackathon; would need dynamic month rendering for production |
| **Avatar** | Stored as base64 in localStorage; large images may hit storage size limits |
| **Multi-tab** | No cross-tab synchronisation; two browser tabs may diverge |
| **Offline** | Works fully offline (no network calls), but localStorage is device-local |
| **Mobile** | Responsive breakpoints exist; full mobile optimisation is partial |

---

*Built with care by **Team Dijkstra** for the Odoo Hackathon 2026* 🚀
