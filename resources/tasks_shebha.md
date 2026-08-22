# Shebha's Task Checklist (Attendance & Time-Off)

## Phase 1: Check-In Widget (10:00 AM - 11:00 AM)
- [ ] Implement `src/components/CheckInWidget.jsx`
  - Render check-in status (checked-in / checked-out)
  - Live clock display
  - "Check In" button (updates status to present and logs time in `AppContext`)
  - "Check Out" button (calculates daily work hours and logs time in `AppContext`)

## Phase 2: Attendance Log Views (11:00 AM - 1:00 PM)
- [ ] Implement `src/pages/Attendance.jsx`
  - Tab navigation (Daily View / Weekly View)
  - Employee view: displays their own check-in/out records
  - Admin/HR view: displays logs for all employees (searchable by employee name)

## Phase 3: Time-Off Management & Leave Calendar (1:00 PM - 3:00 PM)
- [ ] Implement `src/pages/TimeOff.jsx`
  - Display cards for "Paid Time Off" and "Sick Leave" remaining balances
  - Render calendar visualization showing applied leaves
  - "Request Time Off" Modal: fields for Leave Type (Paid, Sick, Unpaid), Start Date, End Date, Remarks, and mock attachment field
  - Admin-only Approval View: list of pending leave requests with "Approve" and "Reject" actions

## Phase 4: State Hookups & Merge (3:00 PM - 5:00 PM)
- [ ] Wire leave approval logic to employee status dots (When a leave is approved for today, the employee's status dot on the main dashboard must automatically turn Red)
- [ ] Clean up styling in `src/styles/attendance.css` and `src/styles/timeoff.css`
- [ ] Merge changes into `main` branch and resolve any conflicts with Sidharth

## Phase 5: Verification (5:00 PM - 5:30 PM)
- [ ] Verify leave balance calculations (Leaves approved reduce remaining days)
- [ ] Verify check-in/out logs correctly calculate work hours
