import React from 'react';
import HighCourtBranchSelect from './StateDistrictSelect'; // Adjust the path as needed

const FilingNumber = () => {
  return (
    <div className="p-4">
      <HighCourtBranchSelect />

      <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 mt-4">
        Search by Filing number
      </h2>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          {/* Petitioner / Respondent */}
          <div>
            <label
              htmlFor="FilingNumber"
              className="block text-lg font-medium text-gray-800 mb-2"
            >
              Filing Number
            </label>
            <input
              type="text"
              id="FilingNumber"
              placeholder="Enter Filing Number"
              className="w-[80%] text-sm p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Registration Year */}
          <div>
            <label
              htmlFor="regYear"
              className="block text-lg font-medium text-gray-800 mb-2"
            >
              Registration Year
            </label>
            <input
              type="number"
              id="regYear"
              placeholder="Enter Registration Year"
              className="w-[80%] text-sm p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilingNumber;
