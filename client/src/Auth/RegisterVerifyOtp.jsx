import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterVerifyOtp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    emailOtp: "",
    mobileOtp: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = response.data;

      if (result.success) {
        setMessage(result.message); 
        navigate("/");
      } else {
        setMessage(result.message || "Invalid OTPs."); 
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center ">
      {/* Logo */}
      <div className="pl-6 pt-4 w-full">
        <img src="/sign_logo.png" alt="Illustration" className="w-[200px]" />
      </div>
      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 shadow"
        style={{
          boxShadow: "box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
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
          Create an account
        </h2>
        <p className="text-center text-gray-500 mb-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>

        {/* Steps */}
        <div className="flex justify-center space-x-4 mb-4">
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 w-full p-4">
          {/* Email OTP */}
          <div>
            <label className="block text-gray-700 text-sm">
              Enter Email OTP
            </label>
            <input
              type="text"
              id="emailOtp"
              name="emailOtp"
              placeholder="Enter OTP"
              value={userData.emailOtp}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Mobile OTP */}
          <div>
            <label className="block text-gray-700 text-sm">Enter SMS OTP</label>
            <input
              type="text"
              id="mobileOtp"
              name="mobileOtp"
              placeholder="Enter OTP"
              value={userData.mobileOtp}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>
        </form>
        {/* Submit */}

        <div className="w-full bg-[#b9b0b0] text-white py-2 rounded-[50px] hover:bg-[#716868] transition text-sm font-bold mt-[20px]">
          <div className="w-[35%] mx-auto flex justify-between gap-2">
            <button
              type="button"
              className="text-white"
              onClick={() => navigate("/signup")}
            >
              Back
            </button>
            <button
              type="submit"
              className="text-white"
              onClick={() => navigate("/")}
            >
              Next
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-4 text-center text-sm text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
};

export default RegisterVerifyOtp;
