import React from "react";
import { Routes, Route } from "react-router-dom";
import CaseResearch from "./CaseResearch";
import ResearchNav from "./ResearchNav";

const Placeholder = ({ name }) => (
  <div className="p-8">
    <h1>{name} Page</h1>
  </div>
);

const ResearchRoute = () => {
  return (
    <div>
      <ResearchNav />
      <Routes>
        <Route path="/" element={<CaseResearch />} />
        {/* <Route path="/" element={} /> */}
        {/* <Route path="/details" element={<Placeholder name="Details" />} />
        <Route path="/hearing" element={<Placeholder name="Hearing" />} />
        
        <Route path="/tickets" element={<Placeholder name="Tickets" />} /> */}
       
      </Routes>
    </div>
  );
};

export default ResearchRoute;
