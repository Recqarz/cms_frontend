import React from "react";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  let name = JSON.parse(localStorage.getItem("cmsusername"));
  return (
    <div className="w-full z-50 fixed h-[80px] flex items-center justify-end bg-[#484444] top-0 left-0">
      <div className="flex items-center mr-[20px] p-2">
        <h1 className="text-[16px] font-bold text-white mr-2">
          Hello {name?.split(" ")[0]}
        </h1>
        <div className="p-2 bg-white w-[40px] h-[40px] rounded-full">
          <CgProfile className="text-2xl text-[#A38A00]" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
