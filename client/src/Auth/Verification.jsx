import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { isLogin, loginEmail } from "../global/action";

const Verification = () => {
  const navigate = useNavigate();
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  let loginuseremail = useSelector((state) => state.loginEmail);
  let dispatch = useDispatch();
  const handleChange = (e, index, otpType) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];
    newOtp[index] = value.slice(-1);
    if (otpType === "mobile") setMobileOtp(newOtp);
    else setEmailOtp(newOtp);
    if (value && index < 5) {
      e.target.nextSibling?.focus();
    }
  };
  const handleBackspace = (e, index, otpType) => {
    if (e.key === "Backspace" && index > 0) {
      const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];
      if (!newOtp[index]) e.target.previousSibling?.focus();
    }
  };
  const handlePaste = (e, otpType) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pasteData)) return;
    const newOtp = pasteData.split("").slice(0, 6);
    if (otpType === "mobile") setMobileOtp(newOtp);
    else setEmailOtp(newOtp);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      email: loginuseremail,
      mobileOtp: mobileOtp.join(""),
      emailOtp: emailOtp.join(""),
    };
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        dispatch(loginEmail(""));
        dispatch(isLogin(true));
        setMessage(response.data.message);
        toast.success(response.data.message);
        localStorage.setItem("cmstoken", JSON.stringify(response.data.token));
        localStorage.setItem("cmsrole", JSON.stringify(response.data.role));
        localStorage.setItem("cmsusername", JSON.stringify(response.data.name));
        navigate("/dashboard");
      } else {
        setMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("API error:", error);
      setMessage(
        error.response?.data?.message || "Unable to connect to the server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative
">
      <div className="absolute top-4 left-4">
        <img src="/sign_logo.png" alt="Illustration" className="w-[200px]" />
      </div>
      <div
        // className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 shadow"
        // style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px" }}

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
          OTP Verification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 w-full p-4">
          {/* Email OTP */}
          <div>
            <label className="block text-gray-700 text-sm">
              Enter Email OTP
            </label>
            <div className="flex space-x-2">
              {emailOtp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(e, index, "email")}
                  onKeyDown={(e) => handleBackspace(e, index, "email")}
                  onPaste={(e) => handlePaste(e, "email")}
                  className="w-10 h-10 border rounded text-center"
                />
              ))}
            </div>
          </div>

          {/* Mobile OTP */}
          <div>
            <label className="block text-gray-700 text-sm">Enter SMS OTP</label>
            <div className="flex space-x-2">
              {mobileOtp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(e, index, "mobile")}
                  onKeyDown={(e) => handleBackspace(e, index, "mobile")}
                  onPaste={(e) => handlePaste(e, "mobile")}
                  className="w-10 h-10 border rounded text-center"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full  text-white py-2 rounded-[50px]  transition text-sm font-bold bg-[#716868] hover:bg-[#484444]"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Display API response message */}
        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Verification;
