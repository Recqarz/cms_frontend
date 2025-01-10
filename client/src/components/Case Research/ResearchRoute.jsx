import React from "react";
import { Routes, Route } from "react-router-dom";
import ResearchNav from "./ResearchNav";
import PanIndia from "./PanIndia";
import State from "./State";
import CaseResearch from "./CaseResearch";

const ResearchRoute = () => {
  return (
    <div>
      <ResearchNav />
      <Routes>
        <Route path="/" element={<CaseResearch />} />
        <Route path="pan-india" element={<PanIndia />} />
        <Route path="state" element={<State />} />
      </Routes>
    </div>
  );
};

export default ResearchRoute;
