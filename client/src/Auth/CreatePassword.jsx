import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formData } from "../global/action";
import toast from "react-hot-toast";

const CreatePassword = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  let signupData = useSelector((state) => state.formData);
  const [userData, setUserData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [apiMessage, setApiMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  useEffect(() => {
    dispatch(formData(userData));
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setApiMessage("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }
    console.log(signupData)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/temp-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setApiMessage(result.message || "Password created successfully!");
        navigate("/register-verify-otp");
      } else {
        setApiMessage(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiMessage("Failed to connect to the server. Please try again.");
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
            />
          </div>

          {/* API Response Message */}
          {apiMessage && (
            <p className="text-center text-sm text-red-500">{apiMessage}</p>
          )}
          {/* Submit */}
          <div className="w-full text-white py-2 rounded-[50px] transition text-sm font-bold mt-[20px]">
            <div className=" mx-auto flex justify-between gap-2">
              <button
                type="button"
                className="text-white bg-[#716868] hover:bg-[#484444] w-[45%] py-2 rounded-2xl"
                onClick={() => navigate("/signup")}
              >
                Back
              </button>
              <button
                type="submit"
                className="text-white bg-[#716868] hover:bg-[#484444] w-[45%] py-2 rounded-2xl"
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

export default CreatePassword;
