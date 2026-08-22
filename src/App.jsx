import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import TimeOff from './pages/TimeOff';
import { CheckCircleIcon, CloseIcon, WarningIcon } from './components/Icons';
import './styles/global.css';

function ToastContainer() {
  const { notifications } = useContext(AppContext);
  return (
    <div className="toast-container">
      {notifications.map((notif) => (
        <div key={notif.id} className={`toast toast-${notif.type}`}>
          <span className="toast-icon">
            {notif.type === 'success' ? <CheckCircleIcon size={16} color="#ffffff" /> : notif.type === 'error' ? <CloseIcon size={16} color="#ffffff" /> : <WarningIcon size={16} color="#ffffff" />}
          </span>
          <span className="toast-message">{notif.message}</span>
        </div>
      ))}
    </div>
  );
}

function MainApp() {
  const { currentUser, currentTab } = useContext(AppContext);

  // If no user is logged in, show Auth screen (toasts still rendered via ToastContainer above)
  if (!currentUser) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  // State-based Tab Switcher
  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':  return <Dashboard />;
      case 'profile':    return <Profile />;
      case 'attendance': return <Attendance />;
      case 'timeoff':    return <TimeOff />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        {renderActivePage()}
      </main>
      <ToastContainer />
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
