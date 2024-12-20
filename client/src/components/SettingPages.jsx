import React, { useState } from "react";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const SettingPages = () => {
  const contentData = [
    "Email notifications",
    "SMS notifications",
    "WhatsApp notifications",
    "Day Before notifications",
    "2 Day Before notifications",
    "4 Day Before notifications",
    "1 Day Before notifications",
    "5 Day Before notifications",
    "8 Day Before notifications",
    "3  Day Before notifications",
    "5 Day Before notifications",
    "8 Day Before notifications",
    "3  Day Before notifications",
  ];
  const bgColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-orange-100",
    "bg-gray-200",
  ];
  const [toggles, setToggles] = useState(Array(contentData.length).fill(false));
  const handleToggle = (index) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      <h1 className="text-3xl uppercase font-bold text-center mb-6">
        Settings
      </h1>
      <div className="space-y-4">
        {contentData.map((content, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 shadow rounded-lg ${
              bgColors[index % bgColors.length]
            }`}
          >
            <span className="text-lg font-medium">{content}</span>
            <button
              onClick={() => handleToggle(index)}
              className={`flex items-center px-4 py-2 rounded-lg text-white font-medium ${
                toggles[index] ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              {toggles[index] ? (
                <>
                  <MdToggleOn className="text-3xl mr-2" />
                  ON
                </>
              ) : (
                <>
                  <MdToggleOff className="text-3xl mr-2" />
                  OFF
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingPages;
