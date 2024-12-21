import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import TrackedCases from "../components/TrackedCases/TrackedCases.jsx";
import CaseTable from "../components/CaseTable/CaseTable.jsx"
import FilterData from "../components/FilterData/FilterData.jsx"
import AddUser from "../components/Add User/AddUser.jsx";
import CaseDetail from "../components/Case Detail/CaseDetail.jsx";
import SettingPages from "../components/SettingPages.jsx";
import UserDirectory from "@/components/User Directory/UserDirectory";




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
        <Route path="/case-table" element={<CaseTable/>}/>
        <Route path="/add-case" element={<FilterData/>}/>
        {/* <Route path="/add-user" element={<AddUser/>}/> */}
        <Route path="/case-detail/:cnrNumber" element={<CaseDetail />} />
        <Route path="/user-directory" element={<UserDirectory/>}/>

        <Route path="/setting" element={<SettingPages/>}/>

        </Routes>
      </div>
    </div>
  );
};

export default Allroutes;
