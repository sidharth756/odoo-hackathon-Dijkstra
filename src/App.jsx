import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import TimeOff from './pages/TimeOff';
import './styles/global.css';

function MainApp() {
  const { currentUser, currentTab, notifications } = useContext(AppContext);

  // If no user is logged in, show the Auth screen
  if (!currentUser) {
    return <Login />;
  }

  // State-based Tab Switcher (custom router)
  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'attendance':
        return <Attendance />;
      case 'timeoff':
        return <TimeOff />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        {renderActivePage()}
      </main>

      {/* Floating Toast Notification Container */}
      <div className="toast-container">
        {notifications.map((notif) => (
          <div key={notif.id} className={`toast toast-${notif.type}`}>
            <span className="toast-icon">
              {notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span className="toast-message">{notif.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
