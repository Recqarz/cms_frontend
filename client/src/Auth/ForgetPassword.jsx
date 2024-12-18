import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    navigate("/generate-password");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Logo */}
      <div className="pl-6 pt-4 w-full">
        <img src="/sign_logo.png" alt="Illustration" className="w-[200px]" />
      </div>

      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 mt-[-40px] shadow"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
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

        <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Forgot Password
        </h2>
        {/* <p className="text-center text-gray-500 mb-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p> */}

        {/* Steps */}
        {/* <div className="flex justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-5 h-3 bg-black rounded-full mr-1"></div>
            <span className="text-gray-700 text-sm">Provide basic info</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-3 border rounded-full mr-1"></div>
            <span className="text-gray-500 text-sm">Create password</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-3 border rounded-full mr-1"></div>
            <span className="text-gray-500 text-sm">Verification</span>
          </div>
        </div> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 w-full p-4">
          {/* Email */}

          <div>
            <label className="block text-gray-700 text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 text-sm">Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              {/* <span className="px-2">
                <img src="/flag.jpg" alt="Flag" className="w-8" />
              </span> */}
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                className="w-full border rounded-md px-2 py-1 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}

          <div className="w-full bg-[#b9b0b0] text-white py-2 rounded-[50px] hover:bg-[#716868] transition text-sm font-bold mt-[20px]">
            <div className="w-[35%] mx-auto flex justify-between">
              <button
                type="button"
                className="text-white"
                onClick={() => navigate("/")}
              >
                Back
              </button>
              <button
                type="button"
                className="text-white"
                onClick={() => navigate("/generate-password")}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
