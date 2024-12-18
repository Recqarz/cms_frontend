import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for email and password fields
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
        "http://localhost:8081/api/auth/temp-login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        alert(response.data.message);
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
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Logo */}
      <div className="pl-6 pt-4 w-full">
        <img src="/sign_logo.png" alt="Illustration" className="w-[200px]" />
      </div>
      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 mt-[-40px] shadow"
        style={{
          boxShadow: "box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h1 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-4 text-sm">
          If you are not Registered, sign up first?{" "}
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
              id="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#b9b0b0] text-white py-2 rounded-[50px] hover:bg-[#716868] transition text-sm font-bold"
            disabled={isLoading} // Disable button while loading
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