import React from "react";
import { useLocation, Link } from "react-router-dom";
 
const CaseNav = () => {
  const location = useLocation();
  const navItems = [
    { name: "Docs", path: "/case-route" },
    { name: "Details", path: "/case-route/details" },
    { name: "Hearing", path: "/case-route/hearing" },
    { name: "Tasks", path: "/case-route/tasks" },
    { name: "Expired Task", path: "/case-route/expired" },
    { name: "Tickets", path: "/case-route/tickets" },
  ];
 
  return (
    <div className="flex justify-between items-center px-2 py-4 shadow-lg mb-2 ">
      {navItems.map((item) => (
        <Link
        key={item.name}
        to={item.path}
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          location.pathname === item.path
            ? "text-[#5a518c] bg-gray-100 font-bold shadow-lg text-xl scale-105"
            : "text-gray-600 hover:text-[#5a518c] hover:scale-105"
        }`}
      >
        {item.name}
      </Link>
      ))}
    </div>
  );
};
 
export default CaseNav;