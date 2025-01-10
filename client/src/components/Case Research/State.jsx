import React, { useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import Nodatafound from "../../assets/Images/Nodata_found.png";
import axios from "axios";
import Pagination from "../pagination/pagination";
import toast from "react-hot-toast";

const State = () => {
  const [courtType, setCourtType] = useState("");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [stateData, setStateData] = useState([]);
  const [dummyData, setDummyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [tableData, setTableData] = useState([]);

  const totalPages = Math.ceil(tableData.length / pageLimit);
  const dropdownRef = useRef(null);
  const fetchStateData = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/state/get-state`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching states:", response.statusText);
        return;
      }

      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setStateData(responseData.data);
      } else {
        console.error("Unexpected data format for states:", responseData);
      }
    } catch (error) {
      console.error("Error fetching state data:", error);
    }
  };
  const fetchKeyword = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/keyword/get-keyword`,
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );
      setDummyData(response.data.data);
    } catch (err) {
      console.error("Error fetching keywords:", err);
    }
  };

  useEffect(() => {
    fetchStateData();
    fetchKeyword();
  }, []);
  const handleSelect = (value) => {
    setSelectedValue(value);
    setQuery(value);
    setDropdownVisible(false);
  };
  const handleReset = () => {
    setCourtType("");
    setQuery("");
    setState("");
  };

  const handleSave = () => {
    if (!state || !courtType || !selectedValue) {
      toast.error("Please fill in all fields before saving.");
      return;
    }

    const selectedData = {
      state,
      courtType,
      keyword: selectedValue,
      isStatePremium: true,
    };

    try {
      const token = JSON.parse(localStorage.getItem("cmstoken"));

      if (!token) {
        console.error("Token not found");
        return;
      }
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/premium/createlocation`,
          selectedData,
          {
            headers: {
              token,
            },
          }
        )
        .then((res) => {
          toast.success("Added the Keyword");
          setState("");
          setCourtType("");
        })
        .catch((err) => {
          toast.error("Something went wrong");
        });
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred while saving the data. Please try again.");
    }

    console.log("Selected Data:", selectedData);
  };
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
  const filteredData = dummyData.filter((item) =>
    item?.keyword.toLowerCase().includes(query.toLowerCase())
  );
  const paginatedData = tableData.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  return (
    <div className="relative mt-2">
      <div className="flex flex-wrap justify-between items-center mb-3 p-3 bg-[#F4F2FF] shadow-lg border border-[#8B83BA]">
        <div className="flex gap-6">
          <div className="w-full sm:w-[200px]">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Select State</option>
              {stateData.map((stateItem) => (
                <option key={stateItem._id} value={stateItem.state}>
                  {stateItem.state}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={courtType}
              onChange={(e) => setCourtType(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Type of Court</option>
              <option value="supremeCourt">Supreme Court</option>
              <option value="districtCourt">District Court</option>
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
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto scrollbar-hide">
                {filteredData.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSelect(item?.keyword)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#8B83BA] hover:text-white"
                  >
                    {item?.keyword}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-full sm:w-[150px]">
            <button
              onClick={handleSave}
              disabled={!state || !courtType || !selectedValue}
              className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#5a518c] focus:ring-2 focus:ring-[#8B83BA] focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload size={16} />
              Save
            </button>
          </div>

          <div className="w-full sm:w-[150px]">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#5a518c]"
            >
              <MdLockReset size={20} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border rounded-lg">
          <thead className="bg-[#F4F2FF] text-[#6E6893]">
            <tr>
              <th className="py-3 px-4 text-left">CNR Number</th>
              <th className="py-3 px-4 text-left">Petitioner</th>
              <th className="py-3 px-4 text-left">Respondent</th>
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
  );
};

export default State;
