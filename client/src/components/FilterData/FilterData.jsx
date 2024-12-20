import React, { useState } from "react";
import { FiSearch, FiUpload, FiPlus } from "react-icons/fi";
import FileInput from "../FileInput";
import SearchInput from "../SearchInput";
import FileUploadButton from "../FileUploadButton";
import ListModel from "../NotificationCheckbox/ListModel";

const FilterData = () => {
  const [initialRows, setInitialRows] = useState([]);
  // Example data
  //   const initialRows = [
  //     {
  //       cnrNumber: "12345",
  //       first: "John Doe",
  //       petitions: "Petition 1",
  //       advocates: "Advocate 1",
  //     },
  //     {
  //       cnrNumber: "67890",
  //       first: "Jane Smith",
  //       petitions: "Petition 2",
  //       advocates: "Advocate 2",
  //     },
  //     {
  //       cnrNumber: "11223",
  //       first: "Mark Johnson",
  //       petitions: "Petition 3",
  //       advocates: "Advocate 3",
  //     },
  //     {
  //       cnrNumber: "44556",
  //       first: "Emily Davis",
  //       petitions: "Petition 4",
  //       advocates: "Advocate 4",
  //     },
  //   ];

  // State to manage the search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to manage the filtered rows
  const [rows, setRows] = useState(initialRows);
  // State to manage adding a new CNR number
  const [newCnr, setNewCnr] = useState("");
  // State to manage opening/closing the ListModel
  const [isListModelOpen, setIsListModelOpen] = useState(false);

  // Filter rows based on search query
  const filteredRows = rows.filter((row) =>
    row.cnrNumber.includes(searchQuery)
  );

  const handleAddCnr = () => {
    if (newCnr) {
      setRows([
        ...rows,
        {
          cnrNumber: newCnr,
          first: "New Name",
          petitions: "New Petition",
          advocates: "New Advocate",
        },
      ]);
      setSearchQuery(newCnr); // Optionally, you can search for the newly added CNR
      setNewCnr(""); // Clear the input field after adding
    }
  };

  // Function to open the ListModel
  const handleAddClick = () => {
    setIsListModelOpen(true);
  };

  // Function to close the ListModel
  const closeListModel = () => {
    setIsListModelOpen(false);
  };

  return (
    <div className="mx-auto p-6 bg-white border border-gray-100 transition-all duration-300 max-w-full sm:max-w-4xl md:max-w-full">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        My Council Filter
      </h2>
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
        {/* Search Input */}
        <div className="relative w-full">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* File Input */}
        <div className="w-full">
          <FileInput />
        </div>

        {/* Upload Button */}
        <div className="w-full">
          <FileUploadButton />
        </div>
      </form>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        {filteredRows.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 border-b">CNR Number</th>
                <th className="px-6 py-3 border-b">First</th>
                <th className="px-6 py-3 border-b">Petitions</th>
                <th className="px-6 py-3 border-b">Advocates</th>
                <th className="px-6 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-3 border-b">{row.cnrNumber}</td>
                  <td className="px-6 py-3 border-b">{row.first}</td>
                  <td className="px-6 py-3 border-b">{row.petitions}</td>
                  <td className="px-6 py-3 border-b">{row.advocates}</td>
                  <td className="px-6 py-3 border-b">
                    <button
                      onClick={handleAddClick}
                      className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add+
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            <p>No matching CNR number found.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
              <input
                type="text"
                value={newCnr}
                onChange={(e) => setNewCnr(e.target.value)}
                placeholder="Enter new CNR number"
                className="p-3 border rounded-lg w-full sm:w-80"
              />
              <button
                onClick={handleAddCnr}
                className="mt-2 sm:mt-0 sm:ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              >
                Add CNR Number
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conditionally render the ListModel */}
      <ListModel isOpen={isListModelOpen} closeModal={closeListModel} />
    </div>
  );
};

export default FilterData;
