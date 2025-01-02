import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "tailwindcss/tailwind.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [caseData, setCaseData] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const today = dayjs();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cnr/get-cnr?pageLimit=1000000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized access. Please login again.");
        } else {
          setCaseData([]);
          console.error("Something went wrong");
        }
        return;
      }

      const responseData = await response.json();
      //   console.log('API Response Data:', responseData.data); // Log API data to debug production issues
      setCaseData(responseData.data || []);
    } catch (error) {
      console.error("Error fetching cases:", error.message);
    }
  };

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const handlePrevMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const generateCalendar = () => {
    const calendar = [];
    const totalDays = startDay + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    let dayCounter = 1 - startDay;

    const cleanDate = (dateString) => {
      if (!dateString || typeof dateString !== "string") return null;
      const cleanString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
      return dayjs(cleanString, "DD MMMM YYYY");
    };

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < 7; j++) {
        if (dayCounter < 1 || dayCounter > daysInMonth) {
          row.push(
            <td
              key={`empty-${i}-${j}`}
              className="h-16 sm:h-20 w-12 sm:w-20 border border-gray-200 bg-gray-50 text-center align-top"
            ></td>
          );
        } else {
          const currentDay = currentDate.date(dayCounter);
          const isToday = currentDay.isSame(today, "day");

          const casesForDay = caseData.filter((caseItem) => {
            const caseDate = cleanDate(caseItem?.caseStatus?.[1]?.[1]);
            return caseDate && caseDate.isSame(currentDay, "day");
          });

          row.push(
            <td
              key={`day-${i}-${j}`}
              className={`h-16 sm:h-20 w-12 sm:w-20 border border-gray-200 text-center align-top transition hover:bg-blue-100 ${
                isToday
                  ? "bg-blue-500 text-white font-bold shadow-lg rounded-lg"
                  : "bg-white"
              }`}
            >
              <div className="text-xs sm:text-sm font-medium">{dayCounter}</div>
              {casesForDay.length > 0 && (
                <div className="mt-1 space-y-1">
                  {casesForDay.map((caseItem, index) => (
                    <div
                      key={`case-${i}-${j}-${index}`}
                      className="text-xs font-medium truncate cursor-pointer"
                      onClick={() => setSelectedCases([caseItem])}
                    >
                      <span className="inline-block bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow">
                        {caseItem?.cnrNumber}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </td>
          );
        }
        dayCounter++;
      }

      calendar.push(<tr key={`row-${i}`}>{row}</tr>);
    }

    return calendar;
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg max-w-full mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="mb-2 sm:mb-0 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
        >
          Prev
        </button>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-700">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="mt-2 sm:mt-0 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm text-xs sm:text-sm">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th
                  key={day}
                  className="h-8 sm:h-12 border text-center bg-blue-100 text-gray-700 font-semibold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{generateCalendar()}</tbody>
        </table>
      </div>

      {selectedCases.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
              Case Details
            </h2>
            {selectedCases.map((caseItem, index) => (
              <div key={`selected-case-${index}`} className="mb-4">
                <div className="mb-2">
                  <strong>CNR Number:</strong> {caseItem?.cnrNumber || "N/A"}
                </div>
                <div className="mb-2">
                  <strong>Case Type:</strong>{" "}
                  {caseItem?.caseDetails["Case Type"] || "Unknown"}
                </div>
                <div className="mb-2">
                  <strong>Filing Date:</strong>{" "}
                  {caseItem?.caseDetails["Filing Date"] || "N/A"}
                </div>
                <div className="mb-2">
                  <strong>Registration Date:</strong>{" "}
                  {caseItem?.caseDetails["Registration Date"] || "N/A"}
                </div>
                <div>
                  <strong>Next Hearing Date:</strong>{" "}
                  {caseItem?.caseStatus[1][1] || "N/A"}
                </div>
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setSelectedCases([])}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
