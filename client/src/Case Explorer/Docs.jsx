import React from "react";
import { FaFileUpload } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const Docs = () => {
  return (
    <div className="relative">
      <div className="shadow-lg rounded-xl p-8 bg-white">
        <div className="flex justify-between items-center mb-8 ">
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6 w-full  p-4">
            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-[#5a518c]"
                placeholder="Search CNR"
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
                  <span>Upload PDF</span>
                </label>
                <input id="file-upload" type="file" className="hidden" />
              </div>
            </div>

            {/* Upload Button */}
            <div className="w-full">
              <button
                type="button"
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
              <tr className="bg-white hover:bg-green-50">
                <td className="py-3 px-4">12345678</td>
                <td className="py-3 px-4">20/01/2025</td>
                <td className="py-3 px-4">
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View pdf
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Docs;
