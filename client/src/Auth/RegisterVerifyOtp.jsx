import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const RegisterVerifyOtp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    emailOtp: "",
    mobileOtp: "",
  });
  const registerEmail = useSelector((state) => state?.formData?.email);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { emailOtp, mobileOtp } = userData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOtp || !mobileOtp) {
      setMessage("Please enter both Email OTP and SMS OTP");
      toast.error("Please enter both Email OTP and SMS OTP");
      return;
    }

    if (!registerEmail) {
      setMessage("Email not found. Please register again.");
      toast.error("Email not found. Please register again.");
      return;
    }
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          email: registerEmail,
          emailOtp,
          mobileOtp,
        }
      );

      const { success, message: responseMessage } = response.data;

      if (success) {
        toast.success(responseMessage);
        setMessage(responseMessage);
        navigate("/");
      } else {
        toast.error(responseMessage || "Invalid OTPs.");
        setMessage(responseMessage || "Invalid OTPs.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      console.error("Error:", error);
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      <div className="absolute top-4 left-4">
        <img src="/sign_logo.png" alt="Company Logo" className="w-[200px]" />
      </div>

      <div
        //  className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 shadow-sm"

        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 rounded "
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",

          // boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",

          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Create an account
        </h2>
        <p className="text-center text-gray-500 mb-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-4 mb-4">
          {["Provide basic info", "Create password", "Verification"].map(
            (step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-5 h-3 ${
                    index === 0 ? "bg-black" : "border"
                  } rounded-full mr-1`}
                ></div>
                <span
                  className={`text-sm ${
                    index === 0 ? "text-gray-700" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            )
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 w-full p-4">
          <div>
            <label htmlFor="emailOtp" className="block text-gray-700 text-sm">
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
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="mobileOtp" className="block text-gray-700 text-sm">
              Enter SMS OTP
            </label>
            <input
              type="text"
              id="mobileOtp"
              name="mobileOtp"
              placeholder="Enter OTP"
              value={userData.mobileOtp}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          

          <div className="w-full text-white py-2 rounded-[50px] transition text-sm font-bold">
            <div className=" mx-auto flex justify-between gap-2 mt-[10px]">
              <button
                type="button"
                className="text-white bg-[#716868] hover:bg-[#484444] w-[48%] py-2 rounded-2xl disabled:opacity-50"
                onClick={() => navigate("/password")}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className="text-white bg-[#716868] hover:bg-[#484444] w-[48%] py-2 rounded-2xl disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </div>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterVerifyOtp;
