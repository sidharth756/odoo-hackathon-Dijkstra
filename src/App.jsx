import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './styles/global.css';

function MainApp() {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Profile />
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
