import React, { useState } from "react";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const SettingPages = () => {
  const contentData = [
    "Email notifications",
    "SMS notifications",
    "WhatsApp notifications",
    "Day Before notifications",
    "4 Day Before notifications",
    "3 Day Before notifications",
    "2 Day Before notifications",
    "1 Day Before notifications",
    "Default same day at 6 AM", 
  ];
  const [toggles, setToggles] = useState(Array(contentData.length).fill(false));

  const handleToggle = (index) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };

  return (
    <div className="w-full p-4" style={{ height: "540px" }}>
      <div className="bg-white rounded-lg p-6 shadow-lg h-full">
        <h1 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
          Settings
        </h1>

        <div className="overflow-auto ">
          <table className="w-full border-collapse text-sm ">
            <tbody>
              {contentData.map((content, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td
                    className={`border border-green-200 px-2 py-1 ${
                      content === "Default same day at 6 AM"
                        ? "text-center font-medium bg-gray-50 text-gray-600"
                        : ""
                    }`}
                    colSpan={content === "Default same day at 6 AM" ? "2" : "1"}
                  >
                    {content !== "Default same day at 6 AM"
                      ? content
                      : "Default same day at 6 AM"}
                  </td>
                  {content !== "Default same day at 6 AM" && (
                    <td className="border border-green-200 px-2 py-1 text-center">
                      <button
                        onClick={() => handleToggle(index)}
                        className={`flex items-center justify-center px-3 py-1 rounded-lg text-white font-medium mx-auto ${
                          toggles[index] ? "bg-gray-600" : "bg-gray-400"
                        }`}
                      >
                        {toggles[index] ? (
                          <>
                            <MdToggleOn className="text-2xl mr-1" />
                            ON
                          </>
                        ) : (
                          <>
                            <MdToggleOff className="text-2xl mr-1" />
                            OFF
                          </>
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button className="border bg-green-600 text-white text-sm font-bold  px-8 py-2 rounded-lg hover:bg-green-400 hover:text-white  transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingPages;
