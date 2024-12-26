import React from "react";
import { useLocation, Link } from "react-router-dom";
import Task from "./Task";

const CaseNav = () => {
  const location = useLocation();
  const navItems = [
    { name: "Docs", path: "/case-route" },
    { name: "Details", path: "/case-route" },

    { name: "Hearing", path: "/case-route" },
    { name: "Tasks", path: "/case-route" },
    { name: "Tickets", path: "/case-route" },
  ];

  return (
    <div className="flex justify-between items-center px-2 py-4 shadow-lg mb-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="hover:text-[#5a518c] hover:font-bold "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default CaseNav;
