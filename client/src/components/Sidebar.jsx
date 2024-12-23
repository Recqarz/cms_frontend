import React, { useState } from "react";
import { FaBriefcase, FaHome, FaUser } from "react-icons/fa";
import { RiArchiveFill } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { isLogin, roleUpdater } from "@/global/action";

const Sidebar = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const [openSection, setOpenSection] = useState(null);
  let [name, setName] = useState("");
  let [isOpen, setIsOpen] = useState(false);
  let role = JSON.parse(localStorage.getItem("cmsrole"));
  let token = JSON.parse(localStorage.getItem("cmstoken"));

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  function handleLogout() {
    localStorage.removeItem("cmstoken");
    localStorage.removeItem("cmsrole");
    localStorage.removeItem("cmsusername");
    dispatch(isLogin(false));
    dispatch(roleUpdater(""));
    navigate("/");
  }

  function handleAddUser() {
    setIsOpen(true);
  }

  function handleAddnewUser() {
    if (!name) {
      toast.error("Please enter a name");
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/external-user/add-external-user`,
        { name },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((response) => {
        toast.success("User added successfully");
        setName("");
        setIsOpen(false);
      })
      .catch((error) => {
        toast.error("Failed to add user");
      });
  }

  return (
    <div className="flex w-[200px] h-[100vh] fixed z-50 top-0 left-0">
      <div className="lg:translate-x-0 w-64 bg-[#484444] text-white  lg:relative lg:inset-0 transition-transform duration-300 ease-in-out flex flex-col">
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

        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            <li className="flex items-center cursor-pointer px-[12px] py-[8px] hover:bg-[#716868] rounded-lg  transition duration-200">
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </li>

            <li>
              <div
                className="flex items-center justify-between px-[12px] py-[8px] hover:bg-[#716868] transition duration-200 cursor-pointer rounded-lg"
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
                <ul className="pl-8 space-y-1 rounded-lg ">
                  <li
                    className="py-1 hover:text-gray-300 hover:bg-[#716868] cursor-pointer px-4 rounded-md"
                    onClick={() => navigate("/case-table")}
                  >
                    My Council
                  </li>
                  <li
                    className="py-1 hover:text-gray-300 hover:bg-[#716868] cursor-pointer px-4 rounded-md"
                    onClick={() => navigate("/tracked-cases")}
                  >
                    Tracked Cases
                  </li>
                  <li
                    className="py-1 hover:text-gray-300 hover:bg-[#716868] cursor-pointer px-4 rounded-md"
                    onClick={() => navigate("/add-case")}
                  >
                    Add Cases
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                className="flex items-center justify-between px-[12px] py-[8px] hover:bg-[#716868] transition duration-200 cursor-pointer rounded-lg "
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
                <ul className="pl-8 space-y-1 rounded-lg ">
                  <li
                    onClick={handleAddUser}
                    className="py-2 hover:text-gray-300 hover:bg-[#716868] cursor-pointer px-4 rounded-md"
                  >
                    Add User
                  </li>
                  <li className="py-2 hover:text-gray-300 hover:bg-[#716868] cursor-pointer px-4 rounded-md" onClick={()=>navigate("/user-directory")}>
                    User Directory
                  </li>
                </ul>
              )}
            </li>

            <li className="flex items-center px-[12px] cursor-pointer py-[8px] hover:bg-[#716868] rounded-lg transition duration-200" onClick={()=>navigate("/archive")}>
              <RiArchiveFill className="mr-3" />
              <span>Archive</span>
            </li>

            <li
              className="flex items-center px-[12px] cursor-pointer py-[8px] hover:bg-[#716868] rounded-lg transition duration-200"
              onClick={() => navigate("/setting")}
            >
              <IoIosSettings className="mr-3" />
              <span>Setting</span>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-2 left-0 w-full text-center border-t border-gray-300 cursor-pointer">
          <div className="px-4 mt-2">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-[#484444] px-4 hover:bg-[#716868] transition duration-200 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add New {role == "advocate" ? "Client" : "Advocate"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={name}
                onInput={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddnewUser} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
