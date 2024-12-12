import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import { FaBriefcase, FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCaseStatusOpen, setIsCaseStatusOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCaseStatus = () => {
    setIsCaseStatusOpen(!isCaseStatusOpen);
  };

  return (
    <div className="flex  w-[200px] h-[100vh] fixed z-50 ">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-gray-200 bg-gray-900 h-full hover:bg-gray-800 transition-colors duration-200 z-20 flex relative"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-20 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 bg-gray-900 text-white shadow-lg lg:relative lg:inset-0 transition-transform duration-300 ease-in-out`}
      >
        <h2 className="p-6 font-bold text-xl text-gray-100 border-b border-gray-700">
          Dashboard
        </h2>
        <nav className="p-6">
          <ul>
            <li className="mb-4">
              <Link
                to="/home"
                className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <FaHome size={18} />
                Home
              </Link>
            </li>

            {/* Case Status Section */}
            <li className="mb-4">
              <Link
                to="/home/party-name"
                className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  toggleCaseStatus(); // Toggle the Case Status submenu
                }}
              >
                <FaBriefcase size={18} />
                Case Status
              </Link>
              {/* Conditionally render the submenu when isCaseStatusOpen is true */}
              {isCaseStatusOpen && (
                <div className="mt-2 pl-6">
                  <ul>
                    <li className="mb-2">
                      <Link
                        to="/home/party-name"
                        className="flex items-center gap-3 p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Party Name
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/home/case-number"
                        className="flex items-center gap-3 p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Case Number
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link
                        to="/home/filing-number"
                        className="flex items-center gap-3 p-2 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Filing Number
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li className="mb-4">
              <Link
                to="settings"
                className="flex items-center gap-3 p-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <IoMdSettings size={18} />
                Settings
              </Link>
            </li>
            <li className="mb-4">
              <Logout />
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
