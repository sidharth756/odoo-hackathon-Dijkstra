import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/login.css';

export default function Login() {
  const { login, signup } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Feedback messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearForm = () => {
    setName('');
    setEmailOrId('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleToggleMode = (mode) => {
    setIsSignUp(mode);
    clearForm();
  };

  const validateEmail = (mail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const identifier = emailOrId.trim();
    const pwd = password.trim();

    if (!identifier) {
      setError('Employee ID or Email is required.');
      return;
    }

    if (!pwd) {
      setError('Password is required.');
      return;
    }

    try {
      login(identifier, pwd);
      setSuccess('Successfully signed in!');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const pwd = password;
    const confirmPwd = confirmPassword;

    if (!trimmedName) {
      setError('Full Name is required.');
      return;
    }

    if (!trimmedEmail) {
      setError('Email address is required.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!pwd) {
      setError('Password is required.');
      return;
    }

    if (pwd.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (pwd !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const newUser = signup({
        name: trimmedName,
        email: trimmedEmail,
        password: pwd,
        role: 'Employee' // Default role for self sign-up
      });
      setSuccess(`Account created successfully! Your Employee ID is ${newUser.id}`);
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-background-decor">
        <div className="decor-circle decor-1"></div>
        <div className="decor-circle decor-2"></div>
      </div>

      <div className="login-card">
        <div className="login-logo-container">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">day<span>flow</span></span>
        </div>

        <div className="login-tabs">
          <button 
            type="button" 
            className={`login-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => handleToggleMode(false)}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`login-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => handleToggleMode(true)}
          >
            Sign Up
          </button>
        </div>

        <div className="login-card-body">
          <h2 className="login-title">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="login-subtitle">
            {isSignUp ? 'Get started with Dayflow HRMS' : 'Sign in to access your dashboard'}
          </p>

          {error && <div className="login-alert error-alert">{error}</div>}
          {success && <div className="login-alert success-alert">{success}</div>}

          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="login-form">
              <div className="form-group">
                <label htmlFor="emailOrId">Employee ID or Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="emailOrId"
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="e.g. ODOO20260001 or employee@odoo.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-btn">
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="login-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rujitha Employee"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. employee@odoo.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-btn">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
