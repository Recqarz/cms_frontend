import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';

const Content = () => (
  <div className="p-6 bg-gray-50 flex-1">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </div>
);

export default Content;
