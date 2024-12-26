import React from "react";
import { Routes, Route } from "react-router-dom";
import CaseNav from "./CaseNav";
import Docs from "./Docs";

const Placeholder = ({ name }) => (
  <div className="p-8">
    <h1>{name} Page</h1>
  </div>
);

const CaseRoute = () => {
  return (
    <div>
      <CaseNav />
      <Docs />
      <Routes>
        {/* <Route path="/" element={} /> */}
        {/* <Route path="/details" element={<Placeholder name="Details" />} />
        <Route path="/hearing" element={<Placeholder name="Hearing" />} />
        <Route path="/tasks" element={<Placeholder name="Tasks" />} />
        <Route path="/tickets" element={<Placeholder name="Tickets" />} /> */}
      </Routes>
    </div>
  );
};

export default CaseRoute;
