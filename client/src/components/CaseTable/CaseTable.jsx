import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { detailPageData } from "@/global/action";
import * as XLSX from "xlsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cnr/get-cnr`,
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
    } finally {
      setLoading(false); // Stop loading once the fetch is complete
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
 
    const excelData = [];
 
    exportData.forEach((caseData) => {
      const caseDetails = caseData.caseDetails || {};
      const caseStatus = caseData.caseStatus || [];
      const caseHistory = caseData.caseHistory || [];
      const interimOrders = caseData.intrimOrders || [];
 
      // Determine the maximum number of rows needed
      const maxRows = Math.max(caseHistory.length, interimOrders.length);
 
      // Add main case details in the first row
      excelData.push({
        "CNR Number": caseDetails["CNR Number"] || caseDetails.cnrNumber || "N/A",
        "Case Type": caseDetails["Case Type"] || "N/A",
        "Filing Number": caseDetails["Filing Number"] || "N/A",
        "Filing Date": caseDetails["Filing Date"] || "N/A",
        "Registration Number": caseDetails["Registration Number"] || "N/A",
        "Registration Date": caseDetails["Registration Date:"] || "N/A",
        "First Hearing Date": caseStatus.find((status) => status[0] === "First Hearing Date")?.[1] || "N/A",
        "Next Hearing Date":
          caseStatus.find((status) => status[0] === "Next Hearing Date" || status[0] === "Decision Date")?.[1] || "N/A",
        "Case Stage": caseStatus.find((status) => status[0] === "Case Status")?.[1] || "N/A",
        "Court Number and Judge": caseStatus.find((status) => status[0] === "Court Number and Judge")?.[1] || "N/A",
        "Case History": "",
        "Interim Orders": "", // Header for Interim Orders column
      });
 
      // Add case history and interim orders side by side
      for (let i = 0; i < maxRows; i++) {
        excelData.push({
          "CNR Number": "",
          "Case Type": "",
          "Filing Number": "",
          "Filing Date": "",
          "Registration Number": "",
          "Registration Date": "",
          "First Hearing Date": "",
          "Next Hearing Date": "",
          "Case Stage": "",
          "Court Number and Judge": "",
          "Case History":
            caseHistory[i]
              ? `${caseHistory[i][0] || "N/A"} - ${caseHistory[i][1] || "N/A"} - ${caseHistory[i][2] || "N/A"} - ${
                  caseHistory[i][3] || "N/A"
                }`
              : "",
          "Interim Orders":
            interimOrders[i]
              ? `${interimOrders[i].order_date || "N/A"} - ${
                  interimOrders[i].s3_url ? `View Order: ${interimOrders[i].s3_url}` : "No URL"
                }`
              : "",
        });
      }
 
      // Add a separator row (optional, for better distinction between cases)
      excelData.push({});
    });
 
    // Create a workbook and add the data as a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
 
    // Adjust column widths
    const columnWidths = Object.keys(excelData[0]).map((key) => ({ wch: Math.max(key.length, 30) }));
    worksheet["!cols"] = columnWidths;
 
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
 
    // Generate the downloadable file
    XLSX.writeFile(workbook, "exported_cases.xlsx");
 
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
        <h1 className="text-2xl text-center text-green-900 mb-5 font-bold">
          My Councils Case
        </h1>
      </div>

      <div className="flex items-center mb-4 flex-wrap gap-4 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-green-700">
          <div className="relative w-full text-green-700  ">
            <input
              type="text"
              placeholder="Search cases"
              className="border bg-green-100 text-green-700 w-full border-green-100 rounded-md px-4 py-3 sm:placeholder:text-[20px] placeholder:text-green-500 focus:outline-none pl-10"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-3  text-green-400"
            />
          </div>
        </div>

        <div className="flex gap-x-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              className="px-4 py-2 rounded-md flex border-2 border-green-100 bg-green-100 text-green-700 items-center gap-2 w-full sm:w-auto"
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
            className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-500 rounded-md w-full sm:w-auto mt-2 sm:mt-0"
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
            className="bg-green-300 text-green-700 hover:bg-green-500 px-4 py-2 rounded-lg"
            onClick={handleExport}
            disabled={selectedCases.length === 0}
          >
            Confirm Export
          </button>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full rounded-lg table-auto">
          <thead>
            <tr className="bg-green-100 text-green-700 text-left">
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
            {loading ? (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  <div className="w-full h-96 flex justify-center items-center">
                    <p>Loading cases...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  No cases found
                </td>
              </tr>
            ) : (
              filteredData.map((caseData, index) => {
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
                  <tr
                    key={index}
                    className="bg-white hover:bg-green-50 text-sm border-t"
                  >
                    {showCheckboxes && (
                      <td className="py-2 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCases.includes(index)}
                          onChange={() => handleCaseSelect(index)}
                          className="w-6 h-6 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 "
                        />
                      </td>
                    )}
                    <td className="py-2 px-4">{caseData?.cnrNumber}</td>
                    <td className="py-2 px-4">{firstHearing}</td>
                    <td className="py-2 px-4">{nextHearing}</td>
                    <td className="py-2 px-4">
                      <TooltipProvider>
                          <td className="py-2 px-4">
                            <Tooltip>
                              <TooltipTrigger>
                                <span>{truncatedPetitioner}</span>
                              </TooltipTrigger>
                              <TooltipContent>{petitioner}</TooltipContent>
                            </Tooltip>
                          </td>
                      </TooltipProvider>
                    </td>
                    <TooltipProvider>
                      <td className="py-2 px-4">
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{truncatedRespondent}</span>
                          </TooltipTrigger>
                          <TooltipContent>{respondent}</TooltipContent>
                        </Tooltip>
                      </td>
                    </TooltipProvider>
                    <td className="py-2 px-4 text-center">
                      <button
                        className="bg-green-300 text-green-700  px-4 py-2 rounded-md hover:bg-green-500"
                        onClick={() => {
                          dispatch(detailPageData(caseData));
                          navigate(`/case-detail/${caseData.cnrNumber}`);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
