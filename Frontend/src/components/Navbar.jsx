import React from "react";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { searchDatas } from "../global/actions";

const Navbar = () => {
  let dispatch = useDispatch()
  return (
    <div className=" p-3 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] flex  mb-[30px] w-[1050px]">
      <h1 className="text-lg font-semibold sm:text-left flex items-center">
        <AiOutlineMenuUnfold className="mr-2" />
      </h1>

      <div className="border border-gray-500 ml-[300px] w-[350px] h-[50px] flex items-center rounded-[30px] px-4 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px]">
        <input
        onInput={(e)=>dispatch(searchDatas(e.target.value))}
          type="text"
          placeholder="Type and Search..."
          className="flex-grow outline-none bg-transparent text-sm"
        />
        <IoIosSearch size={24} className="text-gray-500 mr-2" />
      </div>
    </div>
  );
};

export default Navbar;
