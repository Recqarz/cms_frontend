import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";

import { FaSpinner } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { MdOutlinePreview, MdOutlineStreetview } from "react-icons/md";
import { ImDownload2 } from "react-icons/im";
import { MdOutlineFileUpload } from "react-icons/md";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Nodatafound from "../../assets/Images/Nodata_found.png";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Pagination from "@/components/pagination/pagination";

const Management = () => {
  const [isDocViewDialogOpen, setIsDocViewDialogOpen] = useState(false);
  const [link, setbLink] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchCNR, setSearchCNR] = useState("");
  const [addDocuments, setAddDocuments] = useState([
    {
      id: Date.now(),
      docName: "",
      file: null,
      fileName: "",
      error: "",
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const fetchData = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch documents");
      return;
    }
    axios
      .get(`${
          import.meta.env.VITE_API_URL
        }/document/get-sub-document?currentPage=${currentPage}&pageLimit=${pageLimit}&searchCNR=${searchCNR}`, {
        headers: { token },
      })
      .then((response) => {
        setData(response.data?.data || []);
        setTotalPages(response.data.pageSize);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        const errorMsg =
          error.response?.message ||
          "Failed to fetch documents. Please try again.";
        toast.error(errorMsg);
      });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchCNR]);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageLimit, searchCNR]);

  const handleViewDocument = (docUrl) => {
    setbLink(docUrl);
    setIsDocViewDialogOpen(true);
  };

  const handleAddChange = (id, field, value) => {
    setAddDocuments((docs) =>
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

  const handleAddAddFields = () => {
    setAddDocuments((docs) => [
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

  const handleRemoveAddFields = (id) => {
    setAddDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  const validateAddForm = () => {
    let isValid = true;
    setAddDocuments((docs) =>
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
  const handleAddSubmit = () => {
    if (!selectedCase?.cnrNumber) {
      toast.error("Please select a case");
      return;
    }
    if (validateAddForm()) {
      const formdata = new FormData();
      formdata.append("cnrNumber", selectedCase?.cnrNumber);
      formdata.append("id", selectedCase?._id);
      addDocuments.forEach((doc) => {
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
          `${import.meta.env.VITE_API_URL}/document/add-more-document`,
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
          fetchData();
          setIsDetailDialogOpen(false);
          setSelectedCase(null);
          setAddDocuments([
            {
              id: Date.now(),
              docName: "",
              file: null,
              fileName: "",
              error: "",
            },
          ]);
        })
        .catch((error) => {
          setLoading(false);
          const errorMsg =
            error.response?.data?.message ||
            "Failed to upload documents. Please try again.";
          toast.error(errorMsg);
          setIsDetailDialogOpen(false);
          setSelectedCase(null);
          setAddDocuments([
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

  const handleEyeIconClick = (caseData) => {
    setSelectedCase(caseData);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="relative">
      <div className="shadow-lg rounded-xl p-8 bg-white">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
            <input
              value={searchCNR}
              onChange={(e) => setSearchCNR(e.target.value)}
              type="text"
              className="border bg-[#F4F2FF] text-[#8B83BA] rounded-md px-4 py-3 w-full sm:w-80 placeholder:text-[#8B83BA] focus:outline-none focus:ring-2 focus:ring-[#F4F2FF] pl-10"
              placeholder="Search Users by Name, Email or Date"
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B83BA]"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border rounded-lg">
            <thead className="bg-[#F4F2FF] text-[#6E6893]">
              <tr>
                <th className="py-3 px-4 text-left">CNR Number</th>
                <th className="py-3 px-4 text-left">No. Of Document</th>
                <th className="py-3 px-4 text-left">Respondent & Petitioner</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((ele, index) => (
                  <tr
                    className="bg-white hover:bg-gray-100"
                    key={ele._id || index}
                  >
                    <td className="py-3 px-4">{ele.cnrNumber}</td>
                    <td className="py-3 px-4">{ele.noOfDocument}</td>
                    <td className="py-3 px-4">
                      {ele.petitioner?.split(" ")[0]} vs{" "}
                      {ele.respondent?.split(" ")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <MdOutlinePreview
                        onClick={() => handleEyeIconClick(ele)}
                        className="text-[#5a518c] text-xl font-semibold cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={Nodatafound}
                        alt="No cases found"
                        className="max-w-xs mx-auto mb-4"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={pageLimit}
          onRowsPerPageChange={setPageLimit}
        />
      </div>

      {/* eye icon */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[60%] mx-auto max-h-[100vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-purple-900">
              CNR NUMBER: {selectedCase?.cnrNumber || "N/A"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="space-y-6 p-4">
            {selectedCase ? (
              <>
                {/* Document Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full border rounded-lg">
                    <thead className="bg-[#F4F2FF] text-[#6E6893]">
                      <tr>
                        <th className="py-3 px-4 text-left">Document Name</th>
                        <th className="py-3 px-4 text-left">Uploaded By</th>
                        <th className="py-3 px-4 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCase.documents.map((doc, index) => {
                        const isPDF = doc.url.toLowerCase().endsWith(".pdf");

                        return (
                          <tr
                            key={index}
                            className="bg-white hover:bg-gray-100"
                          >
                            <td className="py-3 px-4">{doc.name || "N/A"}</td>
                            <td className="py-3 px-4">
                              {doc.uploadedBy || "N/A"}
                            </td>
                            <td className="py-3 px-4 flex ml-[-20px]">
                              <div className="flex items-center space-x-4 ">
                                <MdOutlineStreetview
                                  className={`text-[#6E6893] text-xl cursor-pointer hover:text-[#6E6893] ${
                                    isPDF ? "block" : "hidden"
                                  }`}
                                  onClick={() => {
                                    const url =
                                      selectedCase?.documents[index]?.url;
                                    handleViewDocument(url); // S3 URL passed here
                                  }}
                                />

                                {isPDF ? (
                                  <ImDownload2
                                    className="text-green-600 text-xl cursor-pointer hover:text-green-800"
                                    onClick={() =>
                                      window.open(doc.url, "_blank")
                                    }
                                  />
                                ) : (
                                  <a
                                    href={doc.url}
                                    download
                                    className="text-green-600 text-xl cursor-pointer hover:text-green-800"
                                  >
                                    <ImDownload2 />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add Documents Form */}
                <div className="mt-6 w-[60%] mx-auto ">
                  {/* <h2 className="text-lg font-semibold text-purple-900 mb-4">
                    Add Documents
                  </h2> */}
                  <div className="space-y-6">
                    {addDocuments.map((doc) => (
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
                                //-----------
                                handleAddChange(
                                  doc.id,
                                  "docName",
                                  e.target.value
                                )
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
                                    handleAddChange(
                                      doc.id,
                                      "file",
                                      e.target.files[0]
                                    )
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

                        {addDocuments.length > 1 && (
                          <button
                            //---------
                            onClick={() => handleRemoveAddFields(doc.id)}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove Document
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      //-------
                      onClick={handleAddAddFields}
                      className="w-full py-3 border-2 border-dashed rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      + Add Another Document
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center">
                <img
                  src={Nodatafound}
                  alt="No cases found"
                  className="max-w-xs mx-auto p-8"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-4 p-4">
            <button
              onClick={() => {
                setIsDetailDialogOpen(false);
                setSelectedCase(null);
                setAddDocuments([
                  {
                    id: Date.now(),
                    docName: "",
                    file: null,
                    fileName: "",
                    error: "",
                  },
                ]);
              }}
              className="px-6 py-4 text-sm font-medium  text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
            <button
              onClick={handleAddSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document View Dialog */}
      <Dialog open={isDocViewDialogOpen} onOpenChange={setIsDocViewDialogOpen}>
        <DialogContent className="max-w-[50%] mx-auto max-h-[90vh] overflow-y-scroll scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-purple-900 flex item-center">
              View Your Uploaded Document Here
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="w-[600px] h-[600px] mx-auto">
            {link ? (
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
              >
                <Viewer
                  fileUrl={link}
                  renderMode="canvas"
                  scale={2.0}
                  style={{ overflow: "hidden" }}
                />
              </Worker>
            ) : (
              <DialogDescription className="text-lg font-medium text-gray-700">
                Loading document...
              </DialogDescription>
            )}
          </div>
          <DialogFooter>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors "
              onClick={() => setIsDocViewDialogOpen(false)}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Management;
