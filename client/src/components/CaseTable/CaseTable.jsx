import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const data = [
  {
    cnrNumber: "DLHSYE09374744444",
    firstHearing: "14/APR/2020",
    nextHearing: "15/DEC/2024",
    petitioner: "STATE BANK",
    respondent: "RAMPAL JINDAL",
    status: "Active",
  },
  {
    cnrNumber: "DLHSYE09374744445",
    firstHearing: "20/APR/2020",
    nextHearing: "17/JAN/2025",
    petitioner: "HDFC BANK",
    respondent: "ANIL KUMAR",
    status: "Inactive",
  },
];

const CaseTable = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterOption, setFilterOption] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const filterDropdownRef = useRef(null);

  const filteredData = data.filter(
    (caseData) =>
      Object.values(caseData)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase()) &&
      (filterOption
        ? caseData.status.toLowerCase() === filterOption.toLowerCase()
        : true)
  );

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedCases(selectAll ? [] : filteredData.map((_, index) => index));
  };

  const handleCaseSelect = (index) => {
    setSelectedCases((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleOptionSelect = (option) => {
    setFilterOption(option);
    setIsFilterOpen(false);
  };

  const toggleExportConfirm = () => {
    setShowExportConfirm((prev) => !prev);
    setShowCheckboxes(!showExportConfirm); // Show checkboxes when Export is clicked
  };

  const handleExport = () => {
    const exportData = selectedCases.length
      ? selectedCases.map((index) => filteredData[index])
      : filteredData;

    const csvHeader = [
      "CNR NUMBER",
      "FIRST HEARING",
      "NEXT HEARING",
      "PETITIONER",
      "RESPONDENT",
    ];
    const csvRows = exportData.map((caseData) =>
      [
        caseData.cnrNumber,
        caseData.firstHearing,
        caseData.nextHearing,
        caseData.petitioner,
        caseData.respondent,
      ].join(",")
    );
    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_cases.csv";
    link.click();

    toast.success("Export successful!");
    setShowExportConfirm(false);
    setShowCheckboxes(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false); // Close filter dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="shadow-md rounded-lg p-6">
      <div>
        <h1 className="text-2xl text-center mb-5 font-semibold">
          My Councils Case
        </h1>
      </div>

      <div className="flex items-center mb-4 flex-wrap gap-4 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search cases"
              className="border bg-[#F4F2FF] w-full  border-[#F4F2FF] rounded-md px-4 py-3 sm:placeholder:text-[20px] focus:outline-none pl-10"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-3  text-gray-400"
            />
          </div>
        </div>

        <div className="flex gap-x-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              className="px-4 py-2 rounded-md flex border-2 border-[#C6C2DE] text-gray-600 items-center gap-2 w-full sm:w-auto"
              onClick={toggleFilterDropdown}
            >
              <FaFilter />
              {filterOption || "Filter"}
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-md rounded-md w-full sm:w-auto">
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect("Active")}
                >
                  Active
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect("Inactive")}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md w-full sm:w-auto mt-2 sm:mt-0"
            onClick={toggleExportConfirm}
          >
            <FaDownload className="inline-block mr-2" />
            Export
          </button>
        </div>
      </div>

      {showExportConfirm && (
        <div className="mb-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={handleExport}
            disabled={selectedCases.length === 0}
          >
            Confirm Export
          </button>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-gray-200 rounded-lg table-auto">
          <thead>
            <tr className="bg-[#F4F2FF] text-left">
              {showCheckboxes && (
                <th className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-full sm:w-1/4 h-full sm:h-5"
                  />
                </th>
              )}
              <th className="py-2 px-4">CNR NUMBER</th>
              <th className="py-2 px-4">FIRST HEARING</th>
              <th className="py-2 px-4">NEXT HEARING</th>
              <th className="py-2 px-4">PETITIONER</th>
              <th className="py-2 px-4">RESPONDENT</th>
              <th className="py-2 px-4 text-center ">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((caseData, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                {showCheckboxes && (
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedCases.includes(index)}
                      onChange={() => handleCaseSelect(index)}
                      className="w-full sm:w-1/4 h-full sm:h-5"
                    />
                  </td>
                )}
                <td className="py-2 px-4">{caseData.cnrNumber}</td>
                <td className="py-2 px-4">{caseData.firstHearing}</td>
                <td className="py-2 px-4">{caseData.nextHearing}</td>
                <td className="py-2 px-4">{caseData.petitioner}</td>
                <td className="py-2 px-4">{caseData.respondent}</td>
                <td className="py-2 px-4 flex justify-center gap-x-3 ">
                  <button
                    className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => navigate("/case-detail")}
                  >
                    Detail
                  </button>
                  <button className="text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
