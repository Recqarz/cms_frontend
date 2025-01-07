import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isLogin, roleUpdater } from "@/global/action";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  let name = JSON.parse(localStorage.getItem("cmsusername"));

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("cmstoken");
    localStorage.removeItem("cmsrole");
    localStorage.removeItem("cmsusername");
    dispatch(isLogin(false));
    dispatch(roleUpdater(""));
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full z-50 fixed h-[80px] flex items-center justify-end bg-[#484444] top-0 left-0">
      <div className="flex items-center mr-[20px] p-2 relative">
        <h1 className="text-[16px] font-bold text-white mr-2">
          Hello {name?.split(" ")[0]}
        </h1>
        <div
          className="p-2 bg-white w-[40px] h-[40px] rounded-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={toggleDropdown}
        >
          <CgProfile className="text-2xl text-[#A38A00]" />
        </div>

        {dropdownVisible && (
          <div
            ref={dropdownRef}
            className="absolute top-[70px] right-0 bg-white shadow-lg rounded-md py-2 w-[200px] border"
          >
            <div className="border-t my-1 border-2 border-green-700"></div>

            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleLogout}
            >
              <FiLogOut className="text-xl text-red-500 mr-3" />
              <span className="text-[#484444] font-bold">Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
