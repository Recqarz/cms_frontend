import React from "react";

// import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
 
  return (
    <div className=" ml-[200px] h-[80px] flex items-center justify-end bg-blue-900">
      <div className="flex items-center mr-[20px] p-2">
        <h1 className="text-[16px] font-bold text-white mr-2">Hello Ruchi</h1>
        <div className="p-2 bg-white w-[40px] h-[40px] rounded-full">
          <CgProfile className="text-2xl text-[#A38A00]" />

        </div>
      </div>
    </div>
  );
};

export default Navbar;
