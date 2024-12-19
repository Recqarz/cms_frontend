import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPasswordForm } from "../global/action";
import axios from "axios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
  });

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", mobile: "" };
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (!formData.mobile) {
      newErrors.mobile = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit phone number";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/auth/temp-reset-password`,
          formData
        )
        .then((response) => {
          dispatch(resetPasswordForm(formData));
          toast.success(response.data.message);
          navigate("/generate-password");
        })
        .catch((error) => {
          toast.error("Failed to send OTP");
        });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="pl-6 pt-4 w-full">
        <img src="/sign_logo.png" alt="Logo" className="w-[200px]" />
      </div>
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 mt-4 shadow rounded-lg"
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

        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full p-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormData}
              placeholder="Enter your email"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="mobile"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleFormData}
              placeholder="Enter your phone number"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>
          <div className="w-full pt-4">
            <div className="w-full mx-auto flex justify-between gap-4">
              <button
                type="button"
                className="text-white bg-gray-600 hover:bg-gray-700 w-full py-2 rounded-full transition duration-200 font-medium"
                onClick={() => navigate("/")}
              >
                Back
              </button>
              <button
                type="submit"
                className="text-white bg-gray-600 hover:bg-gray-700 w-full py-2 rounded-full transition duration-200 font-medium"
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
