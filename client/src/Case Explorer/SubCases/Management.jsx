import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { HiDocumentAdd } from "react-icons/hi";

import { FaSpinner } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../.././components/ui/dialog";
import { MdOutlineFileUpload } from "react-icons/md";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Nodatafound from "../../assets/Images/Nodata_found.png";

const Management = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cnrNumber, setCnrNumber] = useState("");
  // const [documents, setDocuments] = useState([
  //   {
  //     id: Date.now(),
  //     docName: "",
  //     file: null,
  //     fileName: "",
  //     error: "",
  //   },
  // ]);
  const fetchData = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch documents");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/document/get-sub-document`, {
        headers: { token },
      })
      .then((response) => {
        setData(response.data?.data || []);
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
    fetchData();
  }, []);

 

  // const handleChange = (id, field, value) => {
  //   setDocuments((docs) =>
  //     docs.map((doc) => {
  //       if (doc.id === id) {
  //         if (field === "file") {
  //           const fileSize = value?.size / 1024 / 1024;
  //           if (fileSize > 50) {
  //             return {
  //               ...doc,
  //               [field]: null,
  //               fileName: "",
  //               error: "File size should not exceed 50MB",
  //             };
  //           }
  //           return {
  //             ...doc,
  //             [field]: value,
  //             fileName: value?.name || "",
  //             error: "",
  //           };
  //         }
  //         return { ...doc, [field]: value, error: "" };
  //       }
  //       return doc;
  //     })
  //   );
  // };

  // const handleAddFields = () => {
  //   setDocuments((docs) => [
  //     ...docs,
  //     {
  //       id: Date.now(),
  //       docName: "",
  //       file: null,
  //       fileName: "",
  //       error: "",
  //     },
  //   ]);
  // };

  // const handleRemoveFields = (id) => {
  //   setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  // };

  // const validateForm = () => {
  //   let isValid = true;
  //   if (!cnrNumber.trim()) {
  //     return false;
  //   }

  //   setDocuments((docs) =>
  //     docs.map((doc) => {
  //       const error =
  //         !doc.docName.trim() || !doc.file
  //           ? "Both document name and file are required"
  //           : "";
  //       if (error) isValid = false;
  //       return { ...doc, error };
  //     })
  //   );

  //   return isValid;
  // };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     if (cnrNumber.length !== 16) {
  //       toast.error("CNR Number must be 16 digits long");
  //       return;
  //     }
  //     const formdata = new FormData();
  //     formdata.append("cnrNumber", cnrNumber);
  //     documents.forEach((doc) => {
  //       formdata.append("files", doc.file);
  //       formdata.append("fileNames", doc.docName);
  //     });
  //     const token = JSON.parse(localStorage.getItem("cmstoken"));
  //     if (!token) {
  //       toast.error("Please login again to submit documents");
  //       return;
  //     }
  //     console.log(formdata);
  //     setLoading(true);
  //     axios
  //       .post(
  //         `${import.meta.env.VITE_API_URL}/document/add-document`,
  //         formdata,
  //         {
  //           headers: {
  //             token,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         setLoading(false);
  //         toast.success("Documents uploaded successfully");
  //         fetchData();
  //         setIsDialogOpen(false);
  //         setDocuments([
  //           {
  //             id: Date.now(),
  //             docName: "",
  //             file: null,
  //             fileName: "",
  //             error: "",
  //           },
  //         ]);
  //         setCnrNumber("");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         const errorMsg =
  //           error.response?.data?.message ||
  //           "Failed to upload documents. Please try again.";
  //         toast.error(errorMsg);
  //         setIsDialogOpen(false);
  //         setCnrNumber("");
  //         setDocuments([
  //           {
  //             id: Date.now(),
  //             docName: "",
  //             file: null,
  //             fileName: "",
  //             error: "",
  //           },
  //         ]);
  //       });
  //   }
  // };

  return (
    <div className="relative">
      <div className="shadow-lg rounded-xl p-8 bg-white">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
            <input
              type="text"
              className="border bg-[#F4F2FF] text-[#8B83BA] rounded-md px-4 py-3 w-full sm:w-80 placeholder:text-[#8B83BA] focus:outline-none focus:ring-2 focus:ring-[#F4F2FF] pl-10"
              placeholder="Search Users by Name, Email or Date"
            />
            <CiSearch
              size={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B83BA]"
            />
          </div>

          {/* <button
            onClick={() => setIsDialogOpen(true)}
            type="button"
            className={`flex items-center justify-center px-6 py-3 bg-[#5a518c] text-white rounded-lg shadow-md cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7b6cd2]"
            } transition duration-300 ease-in-out`}
          >
            <HiDocumentAdd className="mr-2 text-xl" />
            <span className="text-lg font-semibold">Add Doc</span>
          </button> */}
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
                    className="bg-white hover:bg-green-50"
                    key={ele._id || index}
                  >
                    <td className="py-3 px-4">{ele.cnrNumber}</td>
                    <td className="py-3 px-4">{ele.noOfDocument}</td>
                    <td className="py-3 px-4">
                      {ele.petitioner?.split(" ")[0]} vs{" "}
                      {ele.respondent?.split(" ")[0]}{" "}
                    </td>
                    <td className="py-3 px-4">
                      <IoEyeOutline className="text-[#5a518c] text-xl font-semibold cursor-pointer" />
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
      </div>

      {/* */}
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-purple-900">
              Add Documents
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                CNR Number
              </label>
              <input
                type="text"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                placeholder="Enter CNR Number"
              />
            </div>

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
      </Dialog> */}
    </div>
  );
};

export default Management;


