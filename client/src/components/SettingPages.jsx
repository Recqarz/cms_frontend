import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdToggleOn, MdToggleOff } from "react-icons/md";

const SettingPages = () => {
  const contentData = [
    { label: "Email notifications", field: "emailSms" },
    { label: "SMS notifications", field: "moblieSms" },
    { label: "WhatsApp notifications", field: "whatsAppSms" },
    { label: "Day Before notifications", field: "oneDayBeforenotification" },
    { label: "4 Day Before notifications", field: "fourDayBeforenotification" },
    {
      label: "3 Day Before notifications",
      field: "threeDayBeforenotification",
    },
    { label: "2 Day Before notifications", field: "twoDayBeforenotification" },
    { label: "Default same day at 6 AM", field: null },
  ];

  const [toggles, setToggles] = useState({});
  const [contentDatas, setContentDatas] = useState({});
  const [error, setError] = useState("");

  const handleToggle = (field) => {
    setToggles((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchData = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      console.error("No token found");
      setError("Unauthorized access. Please login again.");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/get-user-data`, {
        headers: { token: token },
      })
      .then((response) => {
        const data = response.data.data;
        setContentDatas(data);
        setToggles({
          emailSms: data.emailSms || false,
          moblieSms: data.moblieSms || false,
          whatsAppSms: data.whatsAppSms || false,
          oneDayBeforenotification: data.oneDayBeforenotification || false,
          fourDayBeforenotification: data.fourDayBeforenotification || false,
          threeDayBeforenotification: data.threeDayBeforenotification || false,
          twoDayBeforenotification: data.twoDayBeforenotification || false,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Something went wrong. Please try again.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSetting = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      console.error("No token found");
      setError("Unauthorized access. Please login again.");
      return;
    }

    const updatedData = {
      ...contentDatas,
      ...toggles,
    };

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/auth/update-user-data`,
        updatedData,
        {
          headers: { token: token },
        }
      )
      .then((response) => {
        toast.success("Settings saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        toast.error("Failed to save settings. Please try again.");
      });
  };

  return (
    <div className="w-full p-4" style={{ height: "540px" }}>
      <div className="bg-white rounded-lg p-6 shadow-lg h-full">
        <h1 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
          Settings
        </h1>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {contentData.map(({ label, field }, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td
                    className={`border border-green-200 px-2 py-1 ${
                      label === "Default same day at 6 AM"
                        ? "text-center font-medium bg-gray-50 text-gray-600"
                        : ""
                    }`}
                    colSpan={label === "Default same day at 6 AM" ? "2" : "1"}
                  >
                    {label}
                  </td>
                  {field && (
                    <td className="border border-green-200 px-2 py-1 text-center">
                      <button
                        onClick={() => handleToggle(field)}
                        className={`flex items-center justify-center px-3 py-1 rounded-lg text-white font-medium mx-auto ${
                          toggles[field] ? "bg-gray-600" : "bg-gray-400"
                        }`}
                      >
                        {toggles[field] ? (
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
          <button
            onClick={handleSaveSetting}
            className="border bg-green-600 text-white text-sm font-bold px-8 py-2 rounded-lg hover:bg-green-400 hover:text-white transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingPages;
