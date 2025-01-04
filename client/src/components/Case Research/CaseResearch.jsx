import React, { useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import { MdOutlinePreview } from "react-icons/md";
import Pagination from "../pagination/pagination";
import "react-datepicker/dist/react-datepicker.css";
import Nodatafound from "../../assets/Images/Nodata_found.png";

const CaseResearch = () => {
  const [courtType, setCourtType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]); // Replace `data` with `tableData`

  const [query, setQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [pageLimit, setPageLimit] = useState(10); // Rows per page
  const totalPages = Math.ceil(tableData.length / pageLimit); // Calculate total pages

  const dropdownRef = useRef(null);

  // Dummy data for dropdown
  const dummyData = [
    "Keyword One",
    "Keyword Two",
    "Keyword Three",
    "Another Keyword",
    "Sample Keyword",
  ];

  // Filter dropdown options based on query
  const filteredData = dummyData.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // Handle selection in the dropdown
  const handleSelect = (value) => {
    setSelectedValue(value);
    setQuery(value);
    setDropdownVisible(false);
  };

  // Reset filters
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCourtType("");
    setQuery("");
    setState("");
    setDistrict("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Paginate table data
  const paginatedData = tableData.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  return (
    <div className="relative mt-2">
      <div
        className={`shadow-lg rounded-xl p-8 bg-white ${
          isDialogOpen ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-3xl text-center text-[#6E6893] font-bold mb-8">
          All Case Research
        </h2>

        <div className="flex flex-wrap justify-between items-center mb-8 p-3 bg-[#F4F2FF] shadow-lg border border-[#8B83BA]">
          <div className="w-full sm:w-[200px]">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Select State</option>
              <option value="state1">State 1</option>
              <option value="state2">State 2</option>
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Select District</option>
              <option value="district1">District 1</option>
              <option value="district2">District 2</option>
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={courtType}
              onChange={(e) => setCourtType(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Type of Court</option>
              <option value="supreme">Supreme Court</option>
              <option value="district">District Court</option>
            </select>
          </div>

          <div className="w-full sm:w-[300px] relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search your keyword here"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownVisible(true);
              }}
              onFocus={() => setDropdownVisible(true)}
              className="w-full px-4 py-3 border bg-white text-[#8B83BA] rounded-lg focus:ring-2 focus:ring-[#8B83BA]"
            />
            {dropdownVisible && filteredData.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto">
                {filteredData.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#8B83BA] hover:text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full sm:w-[150px]">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center gap-2 hover:bg-[#5a518c]"
            >
              <MdLockReset size={20} />
              Reset
            </button>
          </div>

          <div className="w-full sm:w-[150px]">
            <button className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center gap-2 hover:bg-[#5a518c]">
              <FaDownload size={16} />
              Saved
            </button>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((ele, index) => (
                  <tr
                    className="bg-white hover:bg-gray-100"
                    key={ele._id || index}
                  >
                    <td className="py-3 px-4">{ele.cnrNumber}</td>
                    <td className="py-3 px-4">{ele.documentCount}</td>
                    <td className="py-3 px-4">{ele.respondentPetitioner}</td>
                    <td className="py-3 px-4">
                      <MdOutlinePreview className="text-[#5a518c] text-xl cursor-pointer" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={Nodatafound}
                        alt="No cases found"
                        className="max-w-xs mx-auto mb-4"
                      />
                      <p className="text-[#6E6893]">No cases found</p>
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
    </div>
  );
};

export default CaseResearch;
