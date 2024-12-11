import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import PartyName from '../CaseStatus/PartyName';
import CaseNumber from '../CaseStatus/CaseNumber';
import FilingNumber from '../CaseStatus/FilingNumber';

const Home = () => {
  return (
    <div className="flex w-[100px] ">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className=" bg-gray-50 flex-1">
          <Routes>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/casestatus" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/party-name" element={<PartyName />} />
            <Route path="/case-number" element={<CaseNumber />} />
            <Route path="/filing-number" element={<FilingNumber />} />



            {/* Optional: Add a fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
