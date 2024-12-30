import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import TrackedCases from "../components/TrackedCases/TrackedCases.jsx";
import CaseTable from "../components/CaseTable/CaseTable.jsx";
import FilterData from "../components/FilterData/FilterData.jsx";
import CaseDetail from "../components/Case Detail/CaseDetail.jsx";
import SettingPages from "../components/SettingPages.jsx";
import UserDirectory from "@/components/User Directory/UserDirectory";
import Archive from "@/components/Archive/Archive";
import CaseResearch from "@/components/Case Research/CaseResearch";
import CaseRoute from "@/Case Explorer/CaseRoute";
import DisposedCaseTable from "@/components/disposeCase/disposeCasetable";
import Calendar from "@/components/calendar/calendar";

const Allroutes = () => {
  return (
    <div className="">
      <div>
        <Navbar />
        <Sidebar />
      </div>
      <div className="ml-[198px] mt-[79px] px-4 py-2">
        <Routes>
          <Route path="/tracked-cases" element={<TrackedCases />} />
          <Route path="/case-table" element={<CaseTable />} />
          <Route path="/disposed-case-table" element={<DisposedCaseTable />} />
          <Route path="/add-case" element={<FilterData />} />
          <Route path="/case-detail/:cnrNumber" element={<CaseDetail />} />
          <Route path="/user-directory" element={<UserDirectory />} />
          <Route path="/case-research" element={<CaseResearch />} />
          <Route path="/case-route" element={<CaseRoute />} />

          <Route path="/archive" element={<Archive />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/setting" element={<SettingPages />} />
        </Routes>
      </div>
    </div>
  );
};

export default Allroutes;
