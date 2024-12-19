import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes } from "react-router-dom";

const Allroutes = () => {
  return (
    <div className="">
      <div>
        <Navbar />
        <Sidebar />
      </div>
      <div className="ml-[198px] mt-[79px] px-4 py-2">
        <Routes></Routes>
      </div>
    </div>
  );
};

export default Allroutes;
