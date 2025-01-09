import React from "react";
import { Routes, Route } from "react-router-dom";
import CaseNav from "./CaseNav";
import Docs from "./Docs";
import TaskManagement from "./Tasks/TaskManagement";
import CaseTicket from "./CaseTicket";
import CaseHearing from "./CaseHearing";
import CaseDetailss from "./CaseDetailss";
import ExpiredTask from "./Tasks/ExpiredTask";
 
const CaseRoute = () => {
  return (
    <div>
      <CaseNav />
      <Routes>
        <Route path="/" element={<Docs />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/tickets" element={<CaseTicket />} />
        <Route path="/hearing" element={<CaseHearing />} />
        <Route path="/details" element={<CaseDetailss />} />
        <Route path="/expired" element={<ExpiredTask />} />
      </Routes>
    </div>
  );
};
 
export default CaseRoute;