import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
<<<<<<< HEAD
import { UserIcon, UsersIcon } from '../components/Icons';
=======
import { LockIcon, UsersIcon } from '../components/Icons';
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
import '../styles/login.css';

export default function Login() {
  const { 
    login, 
    signup, 
    showNotification 
  } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Stores email on signup, or email/ID on signin
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Employee');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setRole('Employee');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (!name.trim() || !email.trim()) {
          showNotification('Please fill in all required fields.', 'error');
          return;
        }
        if (password !== confirmPassword) {
          showNotification('Passwords do not match.', 'error');
          return;
        }
        if (password.length < 6) {
          showNotification('Password must be at least 6 characters long.', 'error');
          return;
        }
        const newUser = signup({ name, email, phone, password, role });
        showNotification(`Welcome to Dayflow, ${newUser.name}! Your ID: ${newUser.id}`, 'success');
      } else {
        if (!email.trim() || !password.trim()) {
          showNotification('Please enter both Employee ID/email and password.', 'error');
          return;
        }
        const user = login(email, password);
        showNotification(`Logged in as ${user.name}!`, 'success');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDemoLogin = (demoEmail) => {
    try {
      const user = login(demoEmail, 'password');
      showNotification(`Demo login as ${user.name}`, 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="login-screen-container">
      <div className="login-visual-sidebar">
        <div className="visual-logo-container">
          <div className="visual-logo">D</div>
          <h1>Dayflow</h1>
        </div>
        <p className="visual-subtitle">Every workday, perfectly aligned.</p>
        <div className="visual-graphics">
          <div className="graphic-circle graphic-1" />
          <div className="graphic-circle graphic-2" />
        </div>
      </div>

      <div className="login-form-sidebar">
        <div className="login-card glassmorphism">
          <div className="form-header">
            <h2>{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
            <p className="form-subtitle">
              {isSignUp 
                ? 'Join Dayflow to manage your profiles and attendance.' 
                : 'Welcome back! Please enter your details to access your dashboard.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name *</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">
                {isSignUp ? 'Email Address *' : 'Employee ID or Email Address *'}
              </label>
              <input
                id="auth-email"
                type={isSignUp ? 'email' : 'text'}
                placeholder={isSignUp ? 'john.doe@company.com' : 'e.g. ODOO20260001 or email@company.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="auth-phone">Phone Number</label>
                <input
                  id="auth-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-password">Password *</label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="form-group">
                  <label htmlFor="auth-confirm">Confirm Password *</label>
                  <input
                    id="auth-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="auth-role">Designated Role *</label>
                  <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="Employee">Regular Employee</option>
                    <option value="HR">HR Officer / Admin</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="submit-auth-btn">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="form-toggle-footer">
            <p>
              {isSignUp ? 'Already have an account?' : 'Need to register your profile?'}
              <button 
                type="button" 
                className="toggle-mode-btn"
                onClick={() => { setIsSignUp(!isSignUp); resetForm(); }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {!isSignUp && (
            <div className="demo-access-section">
              <div className="demo-divider"><span>Quick Demo Access</span></div>
              <div className="demo-btn-row">
                <button 
                  type="button" 
                  className="demo-btn demo-admin"
                  onClick={() => handleDemoLogin('sidharth@odoo.com')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
<<<<<<< HEAD
                  <UserIcon size={14} style={{ marginRight: '6px' }} /> Login as HR Admin
=======
                  <LockIcon size={14} />
                  <span>Login as HR Admin</span>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
                </button>
                <button 
                  type="button" 
                  className="demo-btn demo-employee"
                  onClick={() => handleDemoLogin('rujitha@odoo.com')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
<<<<<<< HEAD
                  <UsersIcon size={14} style={{ marginRight: '6px' }} /> Login as Employee
=======
                  <UsersIcon size={14} />
                  <span>Login as Employee</span>
>>>>>>> 5722d753479e178a5c40145c0e43abfbe62c46c2
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
