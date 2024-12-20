import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { detailPageData } from "@/global/action";

const CaseTable = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterOption, setFilterOption] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let dispatch = useDispatch();
  const filterDropdownRef = useRef(null);

  const filteredData = cases.filter(
    (caseData) =>
      Object.values(caseData)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase()) &&
      (filterOption
        ? caseData.status.toLowerCase() === filterOption.toLowerCase()
        : true)
  );

  const fetchCases = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));

    if (!token) {
      console.error("No token found");
      setError("Unauthorized access. Please login again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/cnr/get-cnr", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized access. Please login again.");
        } else {
          setError(`Error: ${response.statusText}`);
        }
        return;
      }

      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setCases(responseData.data);
      } else {
        console.error("Unexpected API response format", responseData);
        setError("Failed to load cases. Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching cases:", error.message);
      setError("An error occurred while fetching cases.");
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

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
    setShowCheckboxes(!showExportConfirm);
  };

  const handleExport = () => {
    const exportData = selectedCases.length
      ? selectedCases.map((index) => filteredData[index])
      : filteredData;

    // CSV Header with detailed case information
    const csvHeader = [
      "Case Details",
      "Case Type",
      "Filing Number",
      "Filing Date",
      "Registration Number",
      "CNR Number",
      "Registration Date",
      "First Hearing Date",
      "Court Number and Judge",
      "Case Stage",
      "Next Hearing Date",
      "Respondent (Party Type, Name, Advocate, Address)",
      "Petitioner (Party Type, Name, Advocate, Address)",
      "Case History (Judge, Business on Date, Hearing Date, Purpose of Hearing)",
      "Interim Orders (Order Date, Order Link)",
    ];

    const csvRows = exportData.map((caseData) => {
      const caseDetails = caseData.caseDetails || {};
      const caseHistory = caseData.caseHistory || [];
      const interimOrders = caseData.interimOrders || [];

      // Format case history
      const caseHistoryFormatted = caseHistory
        .map(
          (history) =>
            `${history[0]} - ${history[1]} - ${history[2]} - ${history[3]}`
        )
        .join(" | ");

      // Format interim orders
      const interimOrdersFormatted = interimOrders
        .map(
          (order) =>
            `${order[0]} - ${
              order[1] ? `<a href="${order[1]}">View Order</a>` : ""
            }`
        )
        .join(" | ");

      return [
        "Case Details", // Static header for case details
        caseDetails.caseType || "",
        caseDetails.filingNumber || "",
        caseDetails.filingDate || "",
        caseDetails.registrationNumber || "",
        caseDetails.cnrNumber || "",
        caseDetails.registrationDate || "",
        caseDetails.firstHearingDate || "",
        caseDetails.courtNumberAndJudge || "",
        caseDetails.caseStage || "",
        caseDetails.nextHearingDate || "",
        // Respondent information (assuming caseData contains this)
        (caseData.respondentAndAdvocate || [])
          .map((item) => `${item[0]}: ${item[1]} - ${item[2]} - ${item[3]}`)
          .join(", ") || "N/A",
        // Petitioner information (assuming caseData contains this)
        (caseData.petitionerAndAdvocate || [])
          .map((item) => `${item[0]}: ${item[1]} - ${item[2]} - ${item[3]}`)
          .join(", ") || "N/A",
        caseHistoryFormatted,
        interimOrdersFormatted,
      ].join(",");
    });

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
        setIsFilterOpen(false);
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

      {loading ? (
        <p>Loading cases...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
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
              <div
                className="relative w-full sm:w-auto"
                ref={filterDropdownRef}
              >
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
                    <th className="py-2 px-4 ">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-6 h-6 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
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
                {filteredData.map((caseData, index) => {
                  const caseStatus = caseData.caseStatus || [];
                  const firstHearing =
                    caseStatus.length > 0 ? caseStatus[0][1] : "";
                  const nextHearing =
                    caseStatus.length > 1 ? caseStatus[1][1] : "";

                  const truncateText = (text, maxLength = 40) => {
                    if (text.length > maxLength) {
                      return text.substring(0, maxLength) + "...";
                    }
                    return text;
                  };

                  const petitioner =
                    caseData.petitionerAndAdvocate?.[0]?.[0]
                      ?.split("\n")[0]
                      .replace(/^\d+\)/, "") || "";

                  const respondent =
                    caseData.respondentAndAdvocate?.[0]?.[0]
                      ?.split("\n")
                      .map((respondent) =>
                        respondent.replace(/^\d+\)/, "").trim()
                      )
                      .join(", ") || "";

                  const truncatedPetitioner = truncateText(petitioner);
                  const truncatedRespondent = truncateText(respondent);

                  return (
                    <tr key={index} className="bg-white hover:bg-gray-100">
                      {showCheckboxes && (
                        <td className="py-2 px-4">
                          <input
                            type="checkbox"
                            checked={selectedCases.includes(index)}
                            onChange={() => handleCaseSelect(index)}
                            className="w-6 h-6 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                          />
                        </td>
                      )}
                      <td className="py-2 px-4">{caseData?.cnrNumber}</td>
                      <td className="py-2 px-4">{firstHearing}</td>
                      <td className="py-2 px-4">{nextHearing}</td>
                      <td className="py-2 px-4">{truncatedPetitioner}</td>
                      <td className="py-2 px-4">{truncatedRespondent}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md"
                          onClick={() => {
                            dispatch(detailPageData(caseData));
                            navigate(`/case-details/${caseData.caseId}`);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CaseTable;
