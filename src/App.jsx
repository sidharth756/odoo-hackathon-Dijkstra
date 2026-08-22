import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Attendance from './pages/Attendance';
import TimeOff from './pages/TimeOff';
import './styles/global.css';

function DevLogin() {
  const { employees, login } = useContext(AppContext);

  return (
    <div className="login-container">
      <h2>Dayflow HRMS</h2>
      <p>Developer Mode: Click a user to simulate logging in</p>
      <div className="user-selection-grid">
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => login(emp.email, 'password')}
            className="dev-login-btn"
          >
            <strong>{emp.name}</strong>
            <span>{emp.role}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MainApp() {
  const { currentUser, activeTab } = useContext(AppContext);

  if (!currentUser) {
    return <DevLogin />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <Attendance />;
      case 'timeoff':
        return <TimeOff />;
      case 'dashboard':
      default:
        return (
          <main className="content">
            <h1>Welcome to Dayflow HRMS, {currentUser.name}!</h1>
            <p>
              Your active role is: <strong>{currentUser.role}</strong>. Use the navigation links above to view your assigned modules.
            </p>
          </main>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      {renderContent()}
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
