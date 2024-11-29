import React, { useState } from 'react';

const StateDistrictSelect = () => {
  const [selectedState, setSelectedState] = useState('');
  const districtOptions = {
    state1: ['District 1A', 'District 1B', 'District 1C'],
    state2: ['District 2A', 'District 2B'],
    state3: ['District 3A', 'District 3B', 'District 3C', 'District 3D'],
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 p-4 shadow-sm align-center ">
      {/* State Selection */}
      <div className="mb-4 w-full max-w-xs">
        <label
          htmlFor="state"
          className="block text-gray-700 font-semibold mb-2 text-sm"
        >
          Select State
        </label>
        <select
          id="state"
          className="w-[80%] p-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">-- Select State --</option>
          <option value="state1">State 1</option>
          <option value="state2">State 2</option>
          <option value="state3">State 3</option>
        </select>
      </div>

      {/* District Selection */}
      <div className="mb-4 w-full max-w-xs">
        <label
          htmlFor="district"
          className="block text-gray-700 font-semibold mb-2 text-sm"
        >
          Select District
        </label>
        <select
          id="district"
          className="w-[80%] p-2 border border-gray-300  text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!selectedState}
        >
          <option value="">-- Select District --</option>
          {selectedState &&
            districtOptions[selectedState].map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default StateDistrictSelect;
