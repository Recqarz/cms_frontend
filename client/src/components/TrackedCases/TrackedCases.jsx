import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaDownload, FaCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const TrackedCases = () => {
  const [cases, setCases] = useState([]);

  function fetchData() {
    let token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .get(`${import.meta.env.VITE_API_URL}/cnr/get-unsaved-cnr`, {
        headers: { token: token },
      })
      .then((response) => {
        setCases(response.data.data);
      })
      .catch((error) => {
        toast.error("Failed to fetch data");
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showExportInput, setShowExportInput] = useState(false);
  const [isExportDisabled, setIsExportDisabled] = useState(true);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCaseSelect = (index) => {
    setSelectedCases((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedCases(selectAll ? [] : cases.map((_, index) => index));
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".dropdown-menu");
      const button = document.querySelector(".filter-button");

      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsExportDisabled(selectedCases.length === 0);
  }, [selectedCases]);

  const filteredCases = cases
    .filter((caseItem) => {
      if (selectedFilter === "All") return true;
      return caseItem.status
        .toLowerCase()
        .includes(selectedFilter.toLowerCase());
    })
    .filter((caseItem) => {
      const query = searchQuery.toLowerCase();
      return (
        caseItem.cnr.toLowerCase().includes(query) ||
        caseItem.status.toLowerCase().includes(query) ||
        caseItem.date.toLowerCase().includes(query)
      );
    });

  const handleExport = () => {
    if (selectedCases.length === 0) return;

    const selectedData = selectedCases.map((index) => cases[index]);
    const csvData = [
      ["CNR NUMBER", "STATUS", "DATE"],
      ...selectedData.map((item) => [item.cnr, item.status, item.date]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tracked_cases.csv";
    link.click();

    toast.success("Export successful!"); // Display success message

    setShowExportInput(false);
    setShowCheckboxes(false);
  };

  const toggleExportInput = () => {
    setShowExportInput((prev) => !prev);
    setShowCheckboxes(!showExportInput);
  };

  return (
    <div className="mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#8B83BA] ">
        Tracked Cases
      </h2>

      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <div className="mb-4 sm:w-1/2 md:w-1/3 lg:w-1/4 sm:mb-0 relative">
          <input
            type="text"
            placeholder="Search Users by Name, Email or Date"
            className="border bg-[#F4F2FF] text-[#8B83BA] rounded-md px-4 py-3 sm:placeholder:text-[16px] placeholder:text-[#8B83BA] w-full focus:outline-none focus:ring-2 focus:ring-[#F4F2FF] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch
            size={24}
            className="absolute left-3 top-3  text-[#8B83BA]"
          />
        </div>

        <div className="flex gap-4 sm:gap-6 justify-center sm:justify-end mb-4">
          <div className="relative">
            <button
              className="filter-button px-4 rounded-md py-2 flex justify-center items-center gap-x-4  bg-[#F4F2FF] hover:bg-[#8B83BA] hover:text-white shadow-lg text-[#8B83BA] w-auto "
              onClick={toggleDropdown}
            >
              <FaFilter className="mr-2" /> {selectedFilter}
            </button>

            {dropdownVisible && (
              <div className="dropdown-menu absolute bg-white border rounded-lg shadow-lg mt-2 w-[7rem] sm:w-[10rem]">
                <ul className="text-gray-700">
                  {["All", "Processed", "Wrong", "InvalidCnr", "Pending"].map(
                    (filter) => (
                      <li
                        key={filter}
                        className="px-2 py-2 font-medium hover:bg-gray-100 cursor-pointer shadow-md"
                        onClick={() => handleFilterChange(filter)}
                      >
                        {filter}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <button
            className="flex px-4 rounded-md py-2 items-center shadow-lg bg-[#F4F2FF] text-[#8B83BA] hover:bg-[#8B83BA] hover:text-white shadow-md transition"

            onClick={toggleExportInput}
          >
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {showExportInput && (
        <div className="mb-4">
          <button
            className="bg-[#F4F2FF] text-[#8B83BA] px-4 py-2 shadow-lg rounded-lg w-full sm:w-auto hover:bg-[#8B83BA] hover:text-white shadow-md transition cursor-pointer"
            onClick={handleExport}
            disabled={isExportDisabled}
          >
            Confirm Export
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#F4F2FF] text-[#8B83BA">
              {showCheckboxes && (
                <th className="py-3 px-6 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-full sm:w-1/4 h-full sm:h-5"
                  />
                </th>
              )}
              <th className="py-3 px-6 text-left text-[#6E6893]">CNR NUMBER</th>
              <th className="py-3 px-6 text-left text-[#6E6893]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseItem, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                {showCheckboxes && (
                  <td className="py-3 px-6 border-b">
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(index)}
                      onChange={() => handleCaseSelect(index)}
                      className="w-full sm:w-1/4 h-full sm:h-5"
                    />
                  </td>
                )}
                <td className="py-3 px-6 border-b">{caseItem.cnr}</td>
                <td className="py-3 px-6 border-b">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-6 py-1 text-sm rounded-xl flex items-center ${
                        caseItem.status === "Completed"
                          ? "bg-[#F4F2FF] text-[#8B83BA]"
                          : caseItem.status === "processed"
                          ? "bg-[#F4F2FF] text-[#8B83BA]" // green
                          : caseItem.status === "wrong"
                          ? "bg-red-200 text-red-700" // red
                          : caseItem.status === "Different_format"
                          ? "bg-red-200 text-red-700" // red
                          : caseItem.status === "invalidcnr"
                          ? "bg-blue-200 text-blue-700" // blue
                          : caseItem.status === "pending"
                          ? "bg-yellow-200 text-yellow-700" // yellow
                          : caseItem.status === "underProgress"
                          ? "bg-blue-200 text-blue-700" // blue
                          : caseItem.status === "alreadyprocessed"
                          ? "bg-pink-200 text-pink-700" // pink
                          : "bg-gray-200 text-gray-700" // default color
                      }`}
                    >
                      <FaCircle
                        size={10}
                        className={
                          caseItem.status === "Completed"
                            ? "text-[#8B83BA]"
                            : caseItem.status === "processed"
                            ? "text-[#8B83BA]" // green
                            : caseItem.status === "wrong"
                            ? "text-red-700" // red
                            : caseItem.status === "Different_format"
                            ? "text-red-700" // red
                            : caseItem.status === "invalidcnr"
                            ? "text-blue-700" // blue
                            : caseItem.status === "pending"
                            ? "text-yellow-700" // yellow
                            : caseItem.status === "underProgress"
                            ? "text-blue-700" // blue
                            : caseItem.status === "alreadyprocessed"
                            ? "text-pink-700" // pink
                            : "text-gray-700" // default color
                        }
                      />
                      {caseItem.status}
                    </span>
                  </div>
                  {caseItem.status === "Completed"
                    ? ` (Paid on ${caseItem.date})`
                    : ` (Due on ${caseItem.date})`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackedCases;
