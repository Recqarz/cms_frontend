import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { detailPageData } from "@/global/action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdAutoDelete } from "react-icons/md";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import axios from "axios";
import * as XLSX from "xlsx";

const CaseTable = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCases, setSelectedCases] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  let dispatch = useDispatch();
  const filterDropdownRef = useRef(null);

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
        `${
          import.meta.env.VITE_API_URL
        }/cnr/get-cnr?pageNo=${currentPage}&pageLimit=${pageLimit}&filterOption=${filterOption}&filterText=${filterText}`,
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
        setTotalPages(responseData.pageSize);
      } else {
        console.error("Unexpected API response format", responseData);
        setError("Failed to load cases. Invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching cases:", error.message);
      setError("An error occurred while fetching cases.");
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1); 
  };

  useEffect(() => {
    fetchCases();
  }, [currentPage, pageLimit, filterOption, filterText]);

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

  // ----------------------------
  // cnr archive

  const handleCnrDelete = (cnrNumber) => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Unauthorized access. Please login again.");
      return;
    }
    axios
      .delete(`${import.meta.env.VITE_API_URL}/cnr/delte-cnr/${cnrNumber}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        toast.success("Case deleted successfully.");
        fetchCases();
      })
      .catch((error) => {
        toast.error("Failed to delete case. Please try again later.");
      });
  };

  const handleExport = () => {
    const exportData = selectedCases.length
      ? selectedCases.map((index) => filteredData[index])
      : filteredData;

    const excelData = [];

    let maxInterimOrderLength = 0; 

    exportData.forEach((caseData) => {
      const caseDetails = caseData.caseDetails || {};
      const caseStatus = caseData.caseStatus || [];
      const caseHistory = caseData.caseHistory || [];
      const interimOrders = caseData.intrimOrders || [];
      const maxRows = Math.max(caseHistory.length, interimOrders.length);
      excelData.push({
        "CNR Number":
          caseDetails["CNR Number"] || caseDetails.cnrNumber || "N/A",
        "Case Type": caseDetails["Case Type"] || "N/A",
        "Filing Number": caseDetails["Filing Number"] || "N/A",
        "Filing Date": caseDetails["Filing Date"] || "N/A",
        "Registration Number": caseDetails["Registration Number"] || "N/A",
        "Registration Date": caseDetails["Registration Date:"] || "N/A",
        "First Hearing Date":
          caseStatus.find(
            (status) => status[0] === "First Hearing Date"
          )?.[1] || "N/A",
        "Next Hearing Date":
          caseStatus.find(
            (status) =>
              status[0] === "Next Hearing Date" || status[0] === "Decision Date"
          )?.[1] || "N/A",
        "Case Stage":
          caseStatus.find((status) => status[0] === "Case Status")?.[1] ||
          "N/A",
        "Court Number and Judge":
          caseStatus.find(
            (status) => status[0] === "Court Number and Judge"
          )?.[1] || "N/A",
        "Case History": "",
        "Interim Orders": "", 
      });
      for (let i = 0; i < maxRows; i++) {
        const interimOrder = interimOrders[i]
          ? interimOrders[i].s3_url
            ? interimOrders[i].s3_url
            : "No URL"
          : "";
        maxInterimOrderLength = Math.max(
          maxInterimOrderLength,
          interimOrder.length
        );
        const interimOrderHyperlink =
          interimOrder && interimOrder !== "No URL"
            ? {
                t: "s",
                v: interimOrder,
                l: { Target: interimOrder, Tooltip: "Click to open" },
              }
            : interimOrder;

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
          "Case History": caseHistory[i]
            ? `${caseHistory[i][0] || "N/A"} - ${
                caseHistory[i][1] || "N/A"
              } - ${caseHistory[i][2] || "N/A"} - ${caseHistory[i][3] || "N/A"}`
            : "",
          "Interim Orders": interimOrderHyperlink,
        });
      }
      excelData.push({});
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const columnWidths = Object.keys(excelData[0]).map((key) => {
      if (key === "Interim Orders") {
        return { wch: Math.max(30, maxInterimOrderLength) };
      }
      return { wch: Math.max(key.length, 30) };
    });
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");
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
        <h1 className="text-2xl text-center text-[#8B83BA] mb-5 font-bold">
          My Councils Case
        </h1>
      </div>
      <div className="flex items-center mb-4 flex-wrap gap-4 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-[#8B83BA]">
          <div className="relative w-full text-green-700  ">
            <input
              type="text"
              placeholder="Search cases"
              className="border  border-[#F4F2FF] bg-[#F4F2FF]  hover:bg-[#8B83BA] hover:text-white w-full  rounded-md px-4 py-3 sm:placeholder:text-[20px] placeholder:text-[#6E6893] focus:outline-none pl-10"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-3  text-[#6E6893]"
            />
          </div>
        </div>

        <div className="flex gap-x-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="relative w-full sm:w-auto" ref={filterDropdownRef}>
            <button
              className="px-4 py-2 rounded-md flex border-2 border-[#F4F2FF] bg-[#F4F2FF] text-[#6E6893] hover:bg-[#8B83BA] hover:text-white items-center gap-2 w-full sm:w-auto"
              onClick={toggleFilterDropdown}
            >
              <FaFilter />
              {filterOption || "Filter"}
            </button>
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border shadow-md rounded-md w-full sm:w-auto">
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect("all")}
                >
                  All
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect("active")}
                >
                  Active
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect("inactive")}
                >
                  Inactive
                </div>
              </div>
            )}
          </div>

          <button
            className="px-4 py-2 bg-[#F4F2FF] text-[#6E6893] hover:bg-[#8B83BA] hover:text-white rounded-md w-full sm:w-auto mt-2 sm:mt-0"
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
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center">
                  No cases found
                </td>
              </tr>
            ) : (
              cases.map((caseData, index) => {
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
                      <td className="py-2 px-4  text-left">
                        <Tooltip className="border ">
                          <TooltipTrigger>
                            <span>{truncatedRespondent}</span>
                          </TooltipTrigger>
                          <TooltipContent>{respondent}</TooltipContent>
                        </Tooltip>
                      </td>
                    </TooltipProvider>

                    <td className="py-2 px-4 text-center flex justify-center">
                      <button
                        className="bg-green-300 text-green-700  px-4 py-2 rounded-md hover:bg-green-500 flex items-center gap-2 ml-2"
                        onClick={() => {
                          dispatch(detailPageData(caseData));
                          navigate(`/case-detail/${caseData.cnrNumber}`);
                        }}
                      >
                        <BiSolidMessageRoundedDetail />
                        <span> Details</span>
                      </button>
                      <button
                        className=" bg-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-500 flex items-center gap-2 ml-2"
                        onClick={() => handleCnrDelete(caseData?.cnrNumber)}
                      >
                        <MdAutoDelete />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Page Size Selector */}
        <div className="flex gap-4 items-center mb-4 sm:mb-0">
          <label className="text-green-700 font-medium">Page Size:</label>
          <select
            value={pageLimit}
            onChange={(e) => handlePageLimitChange(Number(e.target.value))}
            className="px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="bg-green-300 text-green-700 shadow-lg px-4 py-1 rounded-md hover:bg-green-500"
          >
            Prev
          </button>

          {totalPages > 0 &&
            [...Array(totalPages).keys()].map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page + 1)}
                className={`min-w-9 rounded-md py-[5px] px-3 text-center text-sm transition-all shadow-sm ${
                  currentPage === page + 1
                    ? "bg-green-300 text-green-700 border-transparent shadow-md"
                    : "border border-green-300 text-green-700 hover:text-white hover:bg-green-500"
                }`}
              >
                {page + 1}
              </button>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="bg-green-300 text-green-700 shadow-lg px-4 py-1 rounded-md hover:bg-green-500"
          >
            Next
          </button>
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left sm:ml-4">
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaseTable;
