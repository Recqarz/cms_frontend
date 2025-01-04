import React from "react";
import { Routes, Route } from "react-router-dom";
import CaseNav from "./CaseNav";
import Docs from "./Docs";
import TaskManagement from "./TaskManagement";
import CaseTicket from "./CaseTicket";
import CaseHearing from "./CaseHearing";
import CaseDetailss from "./CaseDetailss";

const Placeholder = ({ name }) => (
  <div className="p-8">
    <h1>{name} Page</h1>
  </div>
);

const CaseRoute = () => {
  return (
    <div>
      <CaseNav />
      <Routes>
        
         <Route path="/" element={ <Docs />} />
        {/* <Route path="/" element={} /> */}
        {/* <Route path="/details" element={<Placeholder name="Details" />} />
        <Route path="/hearing" element={<Placeholder name="Hearing" />} />
        
        <Route path="/tickets" element={<Placeholder name="Tickets" />} /> */}
         <Route path="/tasks" element={<TaskManagement/>} />
        <Route path="/tickets" element={<CaseTicket/>} />
        <Route path="/hearing" element={<CaseHearing/>} />
        <Route path="/details" element={<CaseDetailss/>} />
      </Routes>
    </div>
  );
};

export default CaseRoute;
