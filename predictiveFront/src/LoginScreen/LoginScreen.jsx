import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (email) => {
      try {
        const response = await fetch(`http://localhost:8080/utilisateur/${email}`);
        if (response.ok) {
          const userData = await response.json();
          // Save user ID to localStorage
          localStorage.setItem('userId', userData.id);
          console.log('User ID set in localStorage:', userData.id);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check if user is already logged in
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = localStorage.getItem('isAdmin');

    if (userEmail) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        // If the user ID is not in localStorage, fetch it from the backend
        fetchUserData(userEmail);
      }

      // Redirect to the appropriate dashboard based on admin status
      navigate(isAdmin === 'true' ? '/admin' : '/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: email, password: password }),
      });

      if (response.ok) {
        const result = await response.json();
        // Handle successful authentication
        console.log(result);
        // Save user info to localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', result.isAdmin);
        localStorage.setItem('isConnected', true);

        // Fetch and set user ID
        const userResponse = await fetch(`http://localhost:8080/utilisateur/${email}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('userId', userData.id);
        } else {
          console.error('Failed to fetch user data after login');
        }

        // Redirect to the appropriate dashboard
        navigate(result.isAdmin ? '/admin' : '/');
      } else {
        console.error('Authentication failed');
        // Handle failed authentication (show an error message, etc.)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <img src="src/assets/predictive_logo.png" alt="Predictive Logo" className="login-image" />
      </div>
      <div className="right-half">
        <h1 className="login-title">Connexion</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder='email@maitenance-predictive.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="login-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Se connecter</button>
        </form>
        <a href="/forgot-password" className="forgot-password">Mot de passe oublié?</a>
      </div>
    </div>
  );
};

export default LoginScreen;