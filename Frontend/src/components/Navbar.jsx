import React from "react";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { searchDatas } from "../global/actions";

const Navbar = () => {
  let dispatch = useDispatch();
  return (
    <div className="p-3 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] fixed top-0 flex mb-[30px] w-full ">
      <h1 className="text-lg font-semibold sm:text-left flex items-center">
        <AiOutlineMenuUnfold className="mr-2" />
        Navbar
      </h1>

      <div className=" ml-0 lg:ml-[300px] w-full lg:w-[350px] h-[50px] flex items-center rounded-[30px] px-4 "></div>
    </div>
  );
};

export default Navbar;
