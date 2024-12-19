import React, { useState } from "react";
import { FaBriefcase, FaHome, FaUser } from "react-icons/fa";
import { RiArchiveFill } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex w-[200px] h-[100vh] fixed z-50 top-0 left-0">
      <div className="lg:translate-x-0 w-64 bg-[#484444] text-white shadow-lg lg:relative lg:inset-0 transition-transform duration-300 ease-in-out flex flex-col">
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

        {/* Sidebar Menu */}
        <nav className="mt-6">
          <ul className="space-y-2">
            <li className="flex items-center p-3 hover:bg-[#716868] rounded-lg  transition duration-200">
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </li>

            <li>
              <div
                className="flex items-center justify-between p-3 hover:bg-[#716868] transition duration-200 cursor-pointer rounded-lg"
                onClick={() => toggleSection("litigation")}
              >
                <div className="flex items-center">
                  <FaBriefcase className="mr-3" />
                  <span>Litigation</span>
                </div>
                {openSection === "litigation" ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </div>
              {openSection === "litigation" && (
                <ul className="pl-8 space-y-2 bg-[#716868] rounded-lg ">
                  <li className="py-2 hover:text-gray-300">My Council</li>
                  <li className="py-2 hover:text-gray-300">Tracked Cases</li>
                </ul>
              )}
            </li>

            <li>
              <div
                className="flex items-center justify-between p-3 hover:bg-[#716868] transition duration-200 cursor-pointer rounded-lg "
                onClick={() => toggleSection("users")}
              >
                <div className="flex items-center">
                  <FaUser className="mr-3" />
                  <span>Users</span>
                </div>
                {openSection === "users" ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </div>
              {openSection === "users" && (
                <ul className="pl-8 space-y-2 bg-[#716868] rounded-lg ">
                  <li className="py-2 hover:text-gray-300">Add User</li>
                  <li className="py-2 hover:text-gray-300">User Directory</li>
                </ul>
              )}
            </li>

            <li className="flex items-center p-3 hover:bg-[#716868] rounded-lg transition duration-200">
              <RiArchiveFill className="mr-3" />
              <span>Archive</span>
            </li>
          </ul>
        </nav>
        {/* <div className="mb-4 border-t border-gray-300 cursor-pointer">
          Logout
        </div> */}

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-0 w-full text-center border-t border-gray-300 cursor-pointer">
          <button className="w-full py-3 bg-[#484444] hover:bg-[#716868] transition duration-200 rounded-lg">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
