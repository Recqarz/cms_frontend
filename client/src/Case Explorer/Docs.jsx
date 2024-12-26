import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFileUpload } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { Link } from "react-router-dom";

const Docs = () => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [cnrNumber, setCnrNumber] = useState("");
  const [data, setData] = useState([]);

  function fetchData() {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch documents");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/document/get-document`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.message);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleAddDocument(e) {
    e.preventDefault();
    if (!cnrNumber || !file) {
      toast.error("CNR and File are required");
      return;
    }
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to upload documents");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cnrNumber", cnrNumber);
    axios
      .post(`${import.meta.env.VITE_API_URL}/document/add-document`, formData, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        setLoading(false);
        setCnrNumber("");
        setFile("");
        fetchData();
        toast.success("Document uploaded successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to upload document. Please try again");
      });
  }
  return (
    <div className="relative">
      <div className="shadow-lg rounded-xl p-8 bg-white">
        <div className="flex justify-between items-center mb-8 ">
          <form
            onSubmit={handleAddDocument}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 w-full  p-4"
          >
            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                value={cnrNumber}
                onChange={(e) => setCnrNumber(e.target.value)}
                className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-[#5a518c]"
                placeholder="Enter CNR"
              />
            </div>

            {/* File Upload */}
            <div className="w-full">
              <div className="flex items-center justify-center w-full bg-gray-100 p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm hover:border-[#5a518c] transition">
                <label
                  htmlFor="file-upload"
                  className="flex items-center space-x-2 text-gray-600 cursor-pointer"
                >
                  <FaFileUpload className="text-xl" />
                  <span>Select PDF</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Upload Button */}
            <div className="w-full">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center p-4 bg-[#8B83BA] text-white rounded-lg shadow-md cursor-pointer hover:bg-[#5a518c] transition duration-300 ease-in-out transform hover:scale-105"
              >
                <FiUpload className="mr-2 text-xl" />
                <span className="text-lg font-semibold">Upload</span>
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border rounded-lg">
            <thead className="bg-[#F4F2FF] text-[#8B83BA]">
              <tr>
                <th className="py-3 px-4 text-left">CNR Number</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left"> Pdf Link</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((ele) => {
                  return (
                    <tr className="bg-white hover:bg-green-50" key={ele._id}>
                      <td className="py-3 px-4">{ele.cnrNumber}</td>
                      <td className="py-3 px-4">{ele?.date?.split("T")[0]}</td>
                      <td className="py-3 px-4">
                        <Link
                          to={ele.docLink}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                        >
                          View pdf
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-center">
                  <td colSpan="3" className="py-10 font-semibold">
                    No documents found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Docs;
