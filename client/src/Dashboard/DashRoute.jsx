import React from "react";
import { Routes, Route } from "react-router-dom";
import DashCaseRepo from "./DashCaseRepo";
import DashDisposedCases from "./DashDisposedCases";
import DashTrackedCase from "./DashTrackedCase";

import DashNav from "./DashNav";

const DashRoute = () => {
  return (
    <div>
      <DashNav />
      <Routes>
        <Route path="/" element={<DashCaseRepo />} />
        <Route path="dash-dispo-cases" element={<DashDisposedCases />} />
        <Route path="dash-tracked-cases" element={<DashTrackedCase />} />
      </Routes>
    </div>
  );
};

export default DashRoute;
