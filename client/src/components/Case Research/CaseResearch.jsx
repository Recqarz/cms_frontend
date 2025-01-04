import React, { useState, useEffect, useRef } from "react";

import { FaDownload } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";

import "react-datepicker/dist/react-datepicker.css";

import Nodatafound from "../../assets/Images/Nodata_found.png";

const CaseResearch = () => {
  const [courtType, setCourtType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [query, setQuery] = useState(""); // Input value
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility
  const [selectedValue, setSelectedValue] = useState(""); // Selected value

  const dropdownRef = useRef(null);

  // Dummy data for the dropdown
  const dummyData = [
    "Keyword One",
    "Keyword Two",
    "Keyword Three",
    "Another Keyword",
    "Sample Keyword",
  ];

  // Filtered options based on user input
  const filteredData = dummyData.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value) => {
    setSelectedValue(value);
    setQuery(value); // Set selected value in input
    setDropdownVisible(false); // Hide dropdown
  };

  // Reset the filters
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCourtType("");

    setQuery("");
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

        <div className="flex flex-wrap justify-between items-center mb-8  p-3 bg-[#F4F2FF] shadow-lg  border border-[#8B83BA]">
          <div className="w-full sm:w-[200px]">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-[#8B83BA] bg-[#F4F2FF] text-[#8B83BA] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B83BA] bg-white"
            >
              <option value="">Select State</option>
              <option value="supreme"></option>
              <option value="district"></option>
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-[#8B83BA] bg-[#F4F2FF] text-[#8B83BA] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B83BA] bg-white"
            >
              <option value="">Select District</option>
              <option value="supreme"></option>
              <option value="district"></option>
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={courtType}
              onChange={(e) => setCourtType(e.target.value)}
              className="w-full border border-[#8B83BA] bg-[#F4F2FF] text-[#8B83BA] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B83BA] bg-white "
            >
              <option value="">Type of Court</option>
              <option value="supreme">Supreme Court</option>
              <option value="district">District Court</option>
            </select>
          </div>

          <div className="w-full sm:w-[300px] relative" ref={dropdownRef}>
            {/* Input box */}
            <input
              type="text"
              placeholder="Search your keyword here"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownVisible(true);
              }}
              onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
              className="w-full px-4 py-3 border border-[#8B83BA] bg-white text-[#8B83BA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B83BA]"
            />

            {/* Dropdown */}
            {dropdownVisible && filteredData.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#8B83BA] rounded-lg shadow-md max-h-40 overflow-y-auto scrollbar-hide">
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
              className="w-full px-4 py-3 bg-[#8B83BA] text-white text-center rounded-lg hover:bg-[#5a518c] transition duration-300 flex justify-center items-center gap-2"
            >
              <MdLockReset size={20} />
              Reset
            </button>
          </div>

          <div className="w-full sm:w-[150px]">
            <button className="w-full px-4 py-3 bg-[#8B83BA] text-white text-center rounded-lg hover:bg-[#5a518c] transition duration-300 flex justify-center items-center gap-2">
              <FaDownload size={16} />
              Saved
            </button>
          </div>
        </div>

       <div >
       
               <img
                                      src={Nodatafound}
                                      alt="No cases found"
                                      className="max-w-xs mx-auto mb-4"
                                    />
           </div>
      </div>
    </div>
  );
};

export default CaseResearch;
