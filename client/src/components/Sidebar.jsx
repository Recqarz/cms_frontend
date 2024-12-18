import React from "react";

import { FaBriefcase, FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { RiArchiveFill } from "react-icons/ri";
import { MdPending } from "react-icons/md";

const Sidebar = () => {
  //     const [isOpen, setIsOpen] = useState(false);
  //   const [isCaseStatusOpen, setIsCaseStatusOpen] = useState(false);

  //   const toggleSidebar = () => {
  //     setIsOpen(!isOpen);
  //   };

  //   const toggleCaseStatus = () => {
  //     setIsCaseStatusOpen(!isCaseStatusOpen);
  //   };
  return (
    <div className="flex w-[200px] h-[100vh] fixed z-50 border">
      <div className="lg:translate-x-0 w-64 bg-blue-900 text-white shadow-lg lg:relative lg:inset-0 transition-transform duration-300 ease-in-out flex flex-col">
        {/* {`fixed inset-y-0 left-0 z-20 transform ${
  isOpen ? "translate-x-0" : "-translate-x-full" */}

        <img
          src="/cms_logo.png"
          alt="CMS"
          style={{
            width: "100px",
            height: "100px",
            marginTop: "10px",
            marginLeft: "30px",
            marginBottom: "10px",
          }}
        />
        <div className="p-2 flex-grow ">
          <ul>
            <li className=" mb-2 border">
              <FaHome size={16} />
              Dashboard
            </li>
            <li className=" mb-2 border">
            <FaBriefcase size={16} />
              Case
            </li>
            <li className=" mb-2 border">
            InProgress
            </li>
            <li className=" mb-2 border">
              All Cases
            </li>
            <li className=" mb-2 border">
            <RiArchiveFill size={16} />
            Archive
            </li>
            <li className=" mb-2 border">
            <MdPending size={16} />
            Pending Status
            </li>
           
          </ul>
          
        </div>

        <div className="mb-4 border-t border-gray-300">
            Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;