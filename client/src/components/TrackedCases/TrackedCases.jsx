import React, { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { FaFilter, FaDownload, FaCircle } from 'react-icons/fa';
import toast from "react-hot-toast";

const TrackedCases = () => {
      const cases = [
            { cnr: 'DLHSYE0937474444', status: 'Completed', date: '15/APR/2020' },
            { cnr: 'DLHSYE0937474444', status: 'Completed', date: '15/APR/2020' },
            { cnr: 'DLHSYE0937474444', status: 'Pending', date: '15/APR/2020' },
      ];

      const [selectedCases, setSelectedCases] = useState([]);
      const [selectAll, setSelectAll] = useState(false);
      const [showExportInput, setShowExportInput] = useState(false);
      const [isExportDisabled, setIsExportDisabled] = useState(true);
      const [showCheckboxes, setShowCheckboxes] = useState(false);
      const [dropdownVisible, setDropdownVisible] = useState(false);
      const [selectedFilter, setSelectedFilter] = useState('All');
      const [searchQuery, setSearchQuery] = useState(''); 

      const handleCaseSelect = (index) => {
            setSelectedCases((prevSelected) =>
                  prevSelected.includes(index)
                        ? prevSelected.filter((i) => i !== index)
                        : [...prevSelected, index]
            );
      };

      const handleSelectAll = () => {
            setSelectAll(!selectAll);
            setSelectedCases(selectAll ? [] : cases.map((_, index) => index));
      };

      const toggleDropdown = () => {
            setDropdownVisible((prev) => !prev);
      };

      const handleFilterChange = (filter) => {
            setSelectedFilter(filter);
            setDropdownVisible(false);
      };

      useEffect(() => {
            const handleClickOutside = (event) => {
                  const dropdown = document.querySelector('.dropdown-menu');
                  const button = document.querySelector('.filter-button');

                  if (
                        dropdown &&
                        button &&
                        !dropdown.contains(event.target) &&
                        !button.contains(event.target)
                  ) {
                        setDropdownVisible(false);
                  }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                  document.removeEventListener('mousedown', handleClickOutside);
            };
      }, []);

      useEffect(() => {
            setIsExportDisabled(selectedCases.length === 0);
      }, [selectedCases]);

      const filteredCases = cases.filter((caseItem) => {
            if (selectedFilter === 'All') return true;
            return caseItem.status === selectedFilter;
      }).filter((caseItem) => {
            // Search filter: Check if any field contains the search query (case-insensitive)
            const query = searchQuery.toLowerCase();
            return (
                  caseItem.cnr.toLowerCase().includes(query) ||
                  caseItem.status.toLowerCase().includes(query) ||
                  caseItem.date.toLowerCase().includes(query)
            );
      });

      const handleExport = () => {
            if (selectedCases.length === 0) return;

            const selectedData = selectedCases.map((index) => cases[index]);
            const csvData = [
                  ['CNR NUMBER', 'STATUS', 'DATE'],
                  ...selectedData.map((item) => [item.cnr, item.status, item.date]),
            ];

            const csvContent = csvData.map((row) => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tracked_cases.csv';
            link.click();

            toast.success("Export successful!"); // Display success message

            setShowExportInput(false);
            setShowCheckboxes(false);
      };

      const toggleExportInput = () => {
            setShowExportInput((prev) => !prev);
            setShowCheckboxes(!showExportInput);
      };

      return (
            <div className="mx-auto px-4 py-6">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Tracked Cases</h2>

                  <div className="flex flex-col sm:flex-row justify-between mb-6">
                        <div className="mb-4 sm:w-1/2 md:w-1/3 lg:w-1/4 sm:mb-0 relative">
                              <input
                                    type="text"
                                    placeholder="Search Users by Name, Email or Date"
                                    className="border bg-[#F4F2FF] border-[#F4F2FF] rounded-md px-4 py-3 sm:placeholder:text-[20px] w-full focus:outline-none focus:ring-2 focus:ring-[#F4F2FF] pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <CiSearch size={24} className="absolute left-3 top-3  text-gray-400" />
                        </div>

                        <div className="flex gap-4 sm:gap-6 justify-center sm:justify-end mb-4">
                              <div className="relative">
                                    <button
                                          className="filter-button px-4 rounded-md py-2 flex justify-center items-center gap-x-4 border-2 border-[#C6C2DE] text-gray-600 w-auto"
                                          onClick={toggleDropdown}
                                    >
                                          <FaFilter className="mr-2" /> {selectedFilter}
                                    </button>

                                    {dropdownVisible && (
                                          <div className="dropdown-menu absolute bg-white border rounded-lg shadow-lg mt-2 w-[7rem] sm:w-[10rem]">
                                                <ul className="text-gray-700">
                                                      {['All', 'Completed', 'Pending'].map((filter) => (
                                                            <li
                                                                  key={filter}
                                                                  className="px-2 py-2 font-medium hover:bg-gray-100 cursor-pointer"
                                                                  onClick={() => handleFilterChange(filter)}
                                                            >
                                                                  {filter}
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                    )}
                              </div>

                              <button
                                    className="flex px-4 rounded-md py-2 items-center bg-purple-600 text-white hover:bg-purple-500 shadow-md transition"
                                    onClick={toggleExportInput}
                              >
                                    <FaDownload className="mr-2" /> Export
                              </button>
                        </div>
                  </div>

                  {showExportInput && (
                        <div className="mb-4">
                              <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                                    onClick={handleExport}
                                    disabled={isExportDisabled}
                              >
                                    Confirm Export
                              </button>
                        </div>
                  )}

                  <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                              <thead>
                                    <tr className="bg-purple-100">
                                          {showCheckboxes && (
                                                <th className="py-3 px-6 text-left">
                                                      <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                            className='w-full sm:w-1/4 h-full sm:h-5'
                                                      />
                                                </th>
                                          )}
                                          <th className="py-3 px-6 text-left">CNR NUMBER</th>
                                          <th className="py-3 px-6 text-left">STATUS</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {filteredCases.map((caseItem, index) => (
                                          <tr key={index} className="hover:bg-gray-100 transition">
                                                {showCheckboxes && (
                                                      <td className="py-3 px-6 border-b">
                                                            <input
                                                                  type="checkbox"
                                                                  checked={selectedCases.includes(index)}
                                                                  onChange={() => handleCaseSelect(index)}
                                                                  className='w-full sm:w-1/4 h-full sm:h-5'
                                                            />
                                                      </td>
                                                )}
                                                <td className="py-3 px-6 border-b">{caseItem.cnr}</td>
                                                <td className="py-3 px-6 border-b">
                                                      <div className="flex items-center gap-2">
                                                            <span
                                                                  className={`px-6 py-1 text-sm rounded-xl flex items-center ${caseItem.status === 'Completed'
                                                                        ? 'bg-[#CDFFCD] text-[#007F00]'
                                                                        : 'bg-[#e3c795e9] text-[#965E00]'
                                                                        }`}
                                                            >
                                                                  <FaCircle
                                                                        size={10}
                                                                        className={caseItem.status === 'Completed' ? 'text-[#007F00]' : 'text-[#965E00]'}
                                                                  />
                                                                  {caseItem.status}
                                                            </span>
                                                      </div>
                                                      {caseItem.status === 'Completed'
                                                            ? ` (Paid on ${caseItem.date})`
                                                            : ` (Due on ${caseItem.date})`}
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>

      );
};

export default TrackedCases;
