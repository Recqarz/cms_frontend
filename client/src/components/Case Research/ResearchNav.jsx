import React from "react";
import { useLocation, Link } from "react-router-dom";

const ResearchNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Pan India", path: "/case-research/pan-india" },
    { name: "State", path: "/case-research/state" },
    { name: "District", path: "/case-research" },
  ];

  return (
    <div className="flex justify-between items-center px-2 py-4 shadow-lg mb-2">
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

export default ResearchNav;
