import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Images/logo cms 1.png";

const AccDetail = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      {/* Logo */}
      <div className="absolute top-6 left-8">
        <img src={Logo} alt="Illustration" className="w-[200px]" />
      </div>

      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 rounded"
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            /* Hide scrollbar for Webkit browsers */
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <h1 className="text-center text-[26px] font-semibold text-[#6E6893] mb-2">
          All Account Detail
        </h1>

        <form className="space-y-3 w-full p-4">
          {/* Old Password */}
          <div>
            <label className="block text-gray-700 text-sm">Old Password</label>
            <input
              type="password"
              placeholder="Enter your old password"
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-sm"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your new password"
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 text-sm">Role</label>
            <select className="w-full border rounded-md px-2 py-1 text-sm">
              <option value="">Select Role</option>
              <option value="company">Company</option>
              <option value="bank">Bank</option>
              <option value="individual">Individual</option>
              <option value="advocate">Advocate</option>
            </select>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm">State</label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full border rounded-md px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm">District</label>
              <input
                type="text"
                placeholder="Enter district"
                className="w-full border rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                className="w-full border rounded-md px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm">Pincode</label>
              <input
                type="number"
                placeholder="Pincode"
                className="w-full border rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full  py-2 rounded-[50px] bg-[#8B83BA] text-white rounded-lg hover:bg-[#5a518c] transition text-sm font-bold mt-[200px]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccDetail;
