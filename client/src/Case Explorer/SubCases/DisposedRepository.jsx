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
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import axios from "axios";
import * as XLSX from "xlsx";
import Pagination from "../../components/pagination/pagination";
import Nodata from "../../assets/Images/Nodata_found.png";
import { MdLibraryAdd, MdOutlineFileUpload } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaSpinner } from "react-icons/fa6";

const DisposedRepository = () => {
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
  const [nextHearing, setNextHearing] = useState(0);
  const [petitioner, setPetitioner] = useState(0);
  const [respondent, setRespondent] = useState(0);
  let dispatch = useDispatch();
  const filterDropdownRef = useRef(null);

  const fetchCases = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));

    if (!token) {
      console.error("No token found");
      return;
    }
    setLoading(true);
    try {
      console.log(
        `${
          import.meta.env.VITE_API_URL
        }/cnr/get-disposed-sub-cnr?pageNo=${currentPage}&pageLimit=${pageLimit}&filterText=${filterText}&nextHearing=${nextHearing}&petitioner=${petitioner}&respondent=${respondent}`
      );
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/cnr/get-disposed-sub-cnr?pageNo=${currentPage}&pageLimit=${pageLimit}&filterText=${filterText}&nextHearing=${nextHearing}&petitioner=${petitioner}&respondent=${respondent}`,
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
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          toast.error("Failed to fetch cases. Please try again later.");
        }
        return;
      }

      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setCases(responseData.data);
        setTotalPages(responseData.pageSize);
      } else {
        console.error("Unexpected API response format", responseData);
      }
    } catch (error) {
      console.error("Error fetching cases:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);
  useEffect(() => {
    fetchCases();
  }, [currentPage, pageLimit, filterText, nextHearing, petitioner, respondent]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedCases(selectAll ? [] : cases.map((_, index) => index));
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
      ? selectedCases.map((index) => cases[index])
      : cases;

    const excelData = [];
    let maxInterimOrderLength = 0;

    exportData.forEach((caseData) => {
      const caseDetails = caseData.caseDetails || {};
      const caseStatus = caseData.caseStatus || [];
      const caseHistory = caseData.caseHistory || [];
      const interimOrders = caseData.intrimOrders || [];
      const petitionerAndAdvocate = caseData.petitionerAndAdvocate || [];
      const respondentAndAdvocate = caseData.respondentAndAdvocate || [];

      const maxRows = Math.max(
        caseHistory.length,
        interimOrders.length,
        petitionerAndAdvocate.length,
        respondentAndAdvocate.length
      );

      // Add the first row combining all fields
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
          caseStatus.find((status) => status[0] === "Case Stage")?.[1] || "N/A",
        "Court Number and Judge":
          caseStatus.find(
            (status) => status[0] === "Court Number and Judge"
          )?.[1] || "N/A",
        "Petitioner and Advocate": petitionerAndAdvocate.join("\n") || "N/A",
        "Respondent and Advocate": respondentAndAdvocate.join("\n") || "N/A",
        "Case History": caseHistory[0]
          ? `${caseHistory[0][0] || "N/A"} - ${caseHistory[0][1] || "N/A"} - ${
              caseHistory[0][2] || "N/A"
            } - ${caseHistory[0][3] || "N/A"}`
          : "N/A",
        "Interim Orders": interimOrders[0]?.s3_url
          ? {
              t: "s",
              v: interimOrders[0].s3_url,
              l: { Target: interimOrders[0].s3_url, Tooltip: "Click to open" },
            }
          : "N/A",
      });

      // Add additional rows for remaining entries in "Case History" and "Interim Orders"
      for (let i = 1; i < maxRows; i++) {
        const interimOrder = interimOrders[i]?.s3_url || "";
        const interimOrderHyperlink = interimOrder
          ? {
              t: "s",
              v: interimOrder,
              l: { Target: interimOrder, Tooltip: "Click to open" },
            }
          : "";

        const caseHistoryEntry = caseHistory[i]
          ? `${caseHistory[i][0] || "N/A"} - ${caseHistory[i][1] || "N/A"} - ${
              caseHistory[i][2] || "N/A"
            } - ${caseHistory[i][3] || "N/A"}`
          : "";

        // Add row only if there's meaningful data
        if (
          interimOrderHyperlink ||
          caseHistoryEntry ||
          petitionerAndAdvocate[i] ||
          respondentAndAdvocate[i]
        ) {
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
            "Petitioner and Advocate": petitionerAndAdvocate[i] || "",
            "Respondent and Advocate": respondentAndAdvocate[i] || "",
            "Case History": caseHistoryEntry,
            "Interim Orders": interimOrderHyperlink,
          });
        }
      }

      // Add a blank row (gap) after each case
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
        "Petitioner and Advocate": "",
        "Respondent and Advocate": "",
        "Case History": "",
        "Interim Orders": "",
      });
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

  //----------------------

  // const [cnrNumber, setCnrNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: Date.now(),
      docName: "",
      file: null,
      fileName: "",
      error: "",
    },
  ]);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleChange = (id, field, value) => {
    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === id) {
          if (field === "file") {
            const fileSize = value?.size / 1024 / 1024;
            if (fileSize > 50) {
              return {
                ...doc,
                [field]: null,
                fileName: "",
                error: "File size should not exceed 50MB",
              };
            }
            return {
              ...doc,
              [field]: value,
              fileName: value?.name || "",
              error: "",
            };
          }
          return { ...doc, [field]: value, error: "" };
        }
        return doc;
      })
    );
  };
  const handleAddFields = () => {
    setDocuments((docs) => [
      ...docs,
      {
        id: Date.now(),
        docName: "",
        file: null,
        fileName: "",
        error: "",
      },
    ]);
  };

  const handleRemoveFields = (id) => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  const validateForm = () => {
    let isValid = true;
    if (!selectedCase?.cnrNumber.trim()) {
      return false;
    }

    setDocuments((docs) =>
      docs.map((doc) => {
        const error =
          !doc.docName.trim() || !doc.file
            ? "Both document name and file are required"
            : "";
        if (error) isValid = false;
        return { ...doc, error };
      })
    );

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (selectedCase?.cnrNumber.length !== 16) {
        toast.error("CNR Number must be 16 digits long");
        return;
      }
      const formdata = new FormData();
      formdata.append("cnrNumber", selectedCase?.cnrNumber);
      formdata.append("mainUserId", selectedCase?.mainUserId);
      documents.forEach((doc) => {
        formdata.append("files", doc.file);
        formdata.append("fileNames", doc.docName);
      });
      const token = JSON.parse(localStorage.getItem("cmstoken"));
      if (!token) {
        toast.error("Please login again to submit documents");
        return;
      }
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/document/add-sub-document`,
          formdata,
          {
            headers: {
              token,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          setLoading(false);
          toast.success("Documents uploaded successfully");
          fetchCases();
          setIsDialogOpen(false);
          setDocuments([
            {
              id: Date.now(),
              docName: "",
              file: null,
              fileName: "",
              error: "",
            },
          ]);
          setSelectedCase(null);
        })
        .catch((error) => {
          setLoading(false);
          const errorMsg =
            error.response?.data?.message ||
            "Failed to upload documents. Please try again.";
          toast.error(errorMsg);
          setIsDialogOpen(false);
          setSelectedCase(null);
          setDocuments([
            {
              id: Date.now(),
              docName: "",
              file: null,
              fileName: "",
              error: "",
            },
          ]);
        });
    }
  };

  return (
    <div className="rounded-lg p-6  shadow-lg">
      <div>
        <h1 className="text-2xl text-center text-[#8B83BA] mb-5 font-bold">
          Sub Disposed Cases
        </h1>
      </div>
      <div className="flex items-center mb-4 flex-wrap gap-4 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-[#8B83BA]">
          <div className="relative w-full text-green-700  ">
            <input
              type="text"
              placeholder="Search cases"
              className="border bg-[#F4F2FF] text-[#8B83BA] w-full rounded-md px-4 py-3 placeholder:text-[20px] placeholder:text-[#8B83BA] pl-10 focus:outline-none focus:ring-2 focus:ring-[#F4F2FF] sm:placeholder:text-[16px]"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-3 text-[#6E6893] hover:text-white"
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
                  onClick={() => handleOptionSelect("All")}
                >
                  All
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
            className="bg-[#F4F2FF] text-[#8B83BA] hover:bg-[#8B83BA] hover:text-white px-4 py-2 rounded-lg"
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
            <tr className="bg-[#F4F2FF] text-[#8B83BA] text-left">
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
              <th className="py-2 px-4">Added By</th>
              <th className="py-2 px-4">CNR NUMBER</th>
              <th className="py-2 px-4">LAST HEARING</th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => {
                  if (nextHearing == 1) {
                    setNextHearing(-1);
                    setRespondent(0);
                    setPetitioner(0);
                  } else {
                    setNextHearing(1);
                    setPetitioner(0);
                    setRespondent(0);
                  }
                }}
              >
                FINAL HEARING
              </th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => {
                  if (petitioner == 1) {
                    setPetitioner(-1);
                    setRespondent(0);
                    setNextHearing(0);
                  } else {
                    setPetitioner(1);
                    setNextHearing(0);
                    setRespondent(0);
                  }
                }}
              >
                PETITIONER
              </th>
              <th
                className="py-2 px-4 cursor-pointer"
                onClick={() => {
                  if (respondent == 1) {
                    setRespondent(-1);
                    setPetitioner(0);
                    setNextHearing(0);
                  } else {
                    setRespondent(1);
                    setPetitioner(0);
                    setNextHearing(0);
                  }
                }}
              >
                RESPONDENT
              </th>
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
                  <div className="flex justify-center items-center">
                    <img
                      src={Nodata}
                      alt="No cases found"
                      className="max-w-xs mx-auto  p-8 "
                    />
                  </div>
                </td>
              </tr>
            ) : (
              cases.map((caseData, index) => {
                const caseStatus = caseData.caseStatus || [];
                const caseHistory = caseData.caseHistory || [];
                const lastHearing =
                  caseHistory.length > 1
                    ? caseHistory[caseHistory.length - 2][2]
                    : "";
                const nextHearing =
                  caseStatus.length > 1 ? caseStatus[1][1] : "";

                const truncateText = (text, maxLength = 30) => {
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
                    className="bg-white hover:bg-gray-100 text-sm border-t"
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
                    <td className="py-2 px-4 text-left">
                      <TooltipProvider>
                        <div>
                          <Tooltip>
                            <TooltipTrigger>
                              <span>
                                {caseData?.mainUserName?.slice(0, 12)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {caseData?.mainUserName}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </td>
                    <td className="py-2 px-4 text-left">
                      {caseData?.cnrNumber}
                    </td>
                    <td className="py-2 px-4 text-left">{lastHearing}</td>
                    <td className="py-2 px-4">{nextHearing}</td>
                    <td>
                      <TooltipProvider>
                        <div className="py-2 px-4">
                          <Tooltip>
                            <TooltipTrigger>
                              <span>{truncatedPetitioner}</span>
                            </TooltipTrigger>
                            <TooltipContent>{petitioner}</TooltipContent>
                          </Tooltip>
                        </div>
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
                        className="bg-[#F4F2FF] text-[#8B83BA]  px-4 py-2 rounded-md hover:bg-[#8B83BA] hover:text-white flex items-center gap-2 ml-2"
                        onClick={() => {
                          dispatch(detailPageData(caseData));
                          navigate(`/sub-case-detail/${caseData.cnrNumber}`);
                        }}
                      >
                        <BiSolidMessageRoundedDetail />
                        <span> Details</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCase(caseData);
                          setIsDialogOpen(true);
                        }}
                        className="bg-[#F4F2FF] text-[#8B83BA]  px-2 py-2 rounded-md hover:bg-[#8B83BA] hover:text-white flex items-center gap-2 ml-2"
                      >
                        <MdLibraryAdd />
                        <span>AddDoc</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-purple-900">
              Add Documents
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="space-y-6 p-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={doc.docName}
                      onChange={(e) =>
                        handleChange(doc.id, "docName", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                      placeholder="Enter Document Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Upload File
                    </label>
                    <div className="relative">
                      <label className="flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-white shadow-sm">
                        <input
                          type="file"
                          onChange={(e) =>
                            handleChange(doc.id, "file", e.target.files[0])
                          }
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                        <div className="flex items-center space-x-2 text-gray-500">
                          <MdOutlineFileUpload className="text-2xl" />
                          <span className="text-sm truncate w-32">
                            {doc.fileName || "Choose file"}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {doc.error && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm text-red-600">
                      {doc.error}
                    </AlertDescription>
                  </Alert>
                )}

                {documents.length > 1 && (
                  <button
                    onClick={() => handleRemoveFields(doc.id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove Document
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddFields}
              className="w-full py-3 border-2 border-dashed rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              + Add Another Document
            </button>
          </div>

          <DialogFooter className="flex justify-end space-x-4 p-4">
            <button
              onClick={() => {
                setIsDialogOpen(false);
                setCnrNumber("");
                setDocuments([
                  {
                    id: Date.now(),
                    docName: "",
                    file: null,
                    fileName: "",
                    error: "",
                  },
                ]);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors`}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={setPageLimit}
      />
    </div>
  );
};

export default DisposedRepository;
