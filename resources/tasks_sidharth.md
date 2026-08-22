# Sidharth's Task Checklist (Lead & Integration)

## Phase 1: Setup & Global Context (10:00 AM - 11:00 AM)
- [x] Initialize Vite React Project
- [x] Configure global CSS design tokens (`src/styles/global.css`)
- [x] Implement unified `AppContext.jsx` state provider (Mock DB & local storage sync)
- [x] Configure git branches and set up github default branch

## Phase 2: Navigation & Dashboard Grid (11:00 AM - 1:00 PM)
- [x] Implement `src/components/Navbar.jsx`
  - Logo and links (Employees, Attendance, Time Off)
  - User profile picture dropdown with "My Profile" and "Log Out"
- [x] Implement `src/pages/Dashboard.jsx`
  - Employee list view (Grid of cards)
  - Integration of `EmployeeCard` components
  - Dynamic status indicator dots (Green = Present, Red = On Leave, Yellow = Absent)
- [x] Implement `src/components/EmployeeCard.jsx`
  - Displays avatar, name, designation, and status dot
  - Click event redirects to profile detail page

## Phase 3: Routing & Hook Integration (1:00 PM - 3:00 PM)
- [x] Implement route state (Simple state-based router in `App.jsx`)
- [x] Wire up login state redirect (Redirect to Login page if not authenticated)
- [x] Create global toast/notification helper in context and UI container

## Phase 4: Integration & Visual Polish (3:00 PM - 5:00 PM)
- [ ] Merge `feature/auth-profile` (Rujitha) and `feature/attendance-timeoff` (Shebha) into `main`
- [ ] Resolve merge conflicts
- [ ] Apply premium styling polish (Smooth transitions, hover effects, glassmorphism shadows)
- [ ] Verify responsively works on desktop, tablet, and mobile views

## Phase 5: Final Review & Deliver (5:00 PM - 5:30 PM)
- [ ] End-to-end user journey checks
- [ ] Build production version to verify no build warnings/errors (`npm run build`)
- [ ] Push clean final code to main
