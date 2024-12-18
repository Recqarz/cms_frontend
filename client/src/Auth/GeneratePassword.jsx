import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneratePassword = () => {
  const navigate = useNavigate();
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle OTP input changes
  const handleChange = (e, index, otpType) => {
    const { value } = e.target;

    if (isNaN(value)) return; 

    const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];
    newOtp[index] = value.slice(-1); 

    if (otpType === "mobile") setMobileOtp(newOtp);
    else setEmailOtp(newOtp);

    // Move focus to the next input
    if (value && index < 5) {
      e.target.nextSibling?.focus();
    }
  };

  // Handle backspace to move to the previous input
  const handleBackspace = (e, index, otpType) => {
    if (e.key === "Backspace" && index > 0) {
      const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];
      if (!newOtp[index]) e.target.previousSibling?.focus();
    }
  };

  // Handle Paste Event
  const handlePaste = (e, otpType) => {
    e.preventDefault(); 
    const pasteData = e.clipboardData.getData("text"); 

    if (!/^\d{6}$/.test(pasteData)) return; 
    const newOtp = pasteData.split("").slice(0, 6); 

    if (otpType === "mobile") setMobileOtp(newOtp);
    else setEmailOtp(newOtp);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mobile OTP:", mobileOtp.join(""));
    console.log("Email OTP:", emailOtp.join(""));
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
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
          Generate a New Password
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
          {/* Form Title */}
          {/* <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">Let's get started</h1>
          </div> */}

          {/* Mobile OTP */}
          <div>
            <label className="block text-gray-700 text-sm">Mobile OTP</label>
            <div className="flex justify-between gap-1 ">
              {mobileOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index, "mobile")}
                  onKeyDown={(e) => handleBackspace(e, index, "mobile")}
                  onPaste={(e) => handlePaste(e, "mobile")}
                  className="w-8 h-8 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Email OTP */}
          <div>
            <label className="block text-gray-700 text-sm">Email OTP</label>
            <div className="flex justify-between gap-1 ">
              {emailOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index, "email")}
                  onKeyDown={(e) => handleBackspace(e, index, "email")}
                  onPaste={(e) => handlePaste(e, "email")}
                  className="w-8 h-8 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Submit Button */}

          <div className="w-full bg-[#b9b0b0] text-white py-2 rounded-[50px] hover:bg-[#716868] transition text-sm font-bold mt-[20px]">
            <div className="w-[35%] mx-auto flex justify-between">
              <button
                type="button"
                className="text-white"
                onClick={() => navigate("/forget-password")}
              >
                Back
              </button>
              <button
                type="button"
                className="text-white"
                onClick={() => navigate("/")}
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

export default GeneratePassword;
