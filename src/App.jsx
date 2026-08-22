import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import './styles/global.css';

function MainApp() {
  const { currentUser } = useContext(AppContext);

  return (
    <div className="app-container">
      {currentUser && <Navbar />}
      <main className="content">
        <h1>Welcome to Dayflow HRMS</h1>
        <p>Your team project skeleton is set up. Pull the changes from GitHub to start implementing your assigned tasks!</p>
      </main>
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
