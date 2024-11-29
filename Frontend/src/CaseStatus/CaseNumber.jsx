import React from 'react';
import HighCourtBranchSelect from './StateDistrictSelect'; // Adjust the path as needed

const CaseNumber = () => (
    <div className='p-4'>
        <HighCourtBranchSelect />
  <div className="max-w-4xl mx-auto p-4  rounded-lg ">
    
  <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8 mt-3">
  Search by Case Number
    </h2>
    <form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Case Type Field */}
        <div>
          <label
            htmlFor="caseType"
            className="block text-sm font-medium text-gray-700"
          >
            Case Type
          </label>
          <select
            id="caseType"
            name="caseType"
            className="mt-1 block w-full p-2  text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Case Type</option>
            <option value="civil">Civil</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            {/* Add more case types as needed */}
          </select>
        </div>

        {/* Case Number Field */}
        <div>
          <label
            htmlFor="caseNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Case Number
          </label>
          <input
            type="text"
            id="caseNumber"
            name="caseNumber"
            placeholder="Enter Case Number"
            className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Year Field */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Enter Year"
            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

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
  </div>
);

export default CaseNumber;
