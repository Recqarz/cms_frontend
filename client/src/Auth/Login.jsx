import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginEmail } from "../global/action";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      setMessage("Please enter both email and password.");
      return;
    }

    const payload = {
      email: userData.email,
      password: userData.password,
    };

    try {
      setIsLoading(true);
      setMessage("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/temp-login`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        dispatch(loginEmail(userData?.email));

        setMessage(response.data.message);
        toast.success(response.data.message);
        navigate("/verification");
      } else {
        setMessage(response.data.message || "Something went wrong.");
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <img src="/sign_logo.png" alt="Logo" className="w-[200px]" />
      </div>

      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 rounded "
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",

          // boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",

          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h1 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-4 text-sm">
          If you are not registered, sign up first?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 w-full p-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="true"
                name="password"
                placeholder="Enter your password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full border rounded-md px-2 py-1 text-sm  pr-10"
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
            {/* {formik.touched.password && formik.errors.password && (
    <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
  )} */}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white py-2 rounded-[50px] bg-[#716868] hover:bg-[#484444]  transition text-sm font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Next"}
          </button>

          {/* Forgot Password */}
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
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

export default Login;
