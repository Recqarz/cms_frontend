import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Auth/SignUp';
import Login from './Auth/Login';
import Home from './components/Home';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

          <Route path="/home/*" element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
