import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Logo from "../assets/Images/logo cms 1.png"


const GeneratePassword = () => {
  const navigate = useNavigate();
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 

  let userEmail = useSelector((state) => state.resetPasswordForm.email);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    mobileOtp: "",
    emailOtp: "",
  });
  const validatePassword = (pass) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass);
  };
  const validateOtp = (otp) => {
    return otp.every((digit) => digit !== "") && otp.length === 6;
  };
  

  const handleChange = (e, index, otpType) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];
    newOtp[index] = value.slice(-1);
    if (otpType === "mobile") {
      setMobileOtp(newOtp);
      setErrors((prev) => ({ ...prev, mobileOtp: "" }));
    } else {
      setEmailOtp(newOtp);
      setErrors((prev) => ({ ...prev, emailOtp: "" }));
    }
    if (value && index < 5 && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleBackspace = (e, index, otpType) => {
    const newOtp = otpType === "mobile" ? [...mobileOtp] : [...emailOtp];

    if (e.key === "Backspace") {
      if (newOtp[index]) {
        newOtp[index] = "";
        if (otpType === "mobile") setMobileOtp(newOtp);
        else setEmailOtp(newOtp);
      } else if (index > 0 && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handlePaste = (e, otpType) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasteData)) {
      setErrors((prev) => ({
        ...prev,
        [otpType === "mobile" ? "mobileOtp" : "emailOtp"]:
          "Please paste 6 digits only",
      }));
      return;
    }

    const newOtp = pasteData.split("").slice(0, 6);
    if (otpType === "mobile") setMobileOtp(newOtp);
    else setEmailOtp(newOtp);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword && !validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword && newConfirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!validateOtp(mobileOtp)) {
      newErrors.mobileOtp = "Please enter a valid 6-digit mobile OTP";
    }
    if (!validateOtp(emailOtp)) {
      newErrors.emailOtp = "Please enter a valid 6-digit email OTP";
    }
    if (!validatePassword(password)) {
      newErrors.password = "Invalid password format";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    let obj = {
      mobileOtp: mobileOtp.join(""),
      emailOtp: emailOtp.join(""),
      password,
      confirmPassword,
      email: userEmail,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, obj)
      .then((response) => {
        console.log(response);
        toast.success("Password reset successfully");
        navigate(`/`);
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      <div
        className="absolute top-8 left-8
"
      >
        <img  src={Logo} alt="Logo" className="w-[200px]" />
      </div>

      <div
        // className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 mt-4 shadow-sm rounded-lg"

        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 rounded"
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",

          // boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",

          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          Generate a New Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full p-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Mobile OTP
            </label>
            <div className="flex justify-between gap-2">
              {mobileOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index, "mobile")}
                  onKeyDown={(e) => handleBackspace(e, index, "mobile")}
                  onPaste={(e) => handlePaste(e, "mobile")}
                  className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label={`Mobile OTP digit ${index + 1}`}
                />
              ))}
            </div>
            {errors.mobileOtp && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileOtp}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email OTP
            </label>
            <div className="flex justify-between gap-2">
              {emailOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index, "email")}
                  onKeyDown={(e) => handleBackspace(e, index, "email")}
                  onPaste={(e) => handlePaste(e, "email")}
                  className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label={`Email OTP digit ${index + 1}`}
                />
              ))}
            </div>
            {errors.emailOtp && (
              <p className="text-red-500 text-xs mt-1">{errors.emailOtp}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
           <div className="relative w-full">
           <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="password-error"
            />
             <div
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <IoIosEyeOff size={20} />
                ) : (
                  <IoIosEye size={20} />
                )}
              </div>
           </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div>
            <input
             type={showPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="confirm-password-error"
            />
            </div>
          
            
            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="text-red-500 text-xs mt-1"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex w-full justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="px-6 py-[6px] w-[45%]  text-white rounded-full  transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-[#716868] hover:bg-[#484444]"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-[6px] w-[45%]  text-white rounded-full  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-[#716868] hover:bg-[#484444]"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePassword;
