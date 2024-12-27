import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formData } from "../global/action";
import toast from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Logo from "../assets/Images/logo cms 1.png"

const CreatePassword = () => {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  let signupData = useSelector((state) => state.formData);
  const [userData, setUserData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [apiMessage, setApiMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
    console.log(signupData);
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative">
      {/* Logo */}
      <div
        className="absolute top-8 left-8
"
      >
        <img  src={Logo} alt="Illustration" className="w-[200px]" />
      </div>
      {/* Form Container */}
      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4 mt-[-40px] rounded "
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",

          // boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",

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

        <h1 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Create an account
        </h1>
        <p className="text-center text-gray-500 mb-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Log in
          </Link>
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

          <div className="relative">
            <label className="block text-gray-700 text-sm">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="true"
                // required
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
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 text-sm">
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="true"
                // required
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
          </div>

          {/* API Response Message */}
          {apiMessage && (
            <p className="text-center text-sm text-red-500">{apiMessage}</p>
          )}
          {/* Submit */}
          <div className="w-full text-white py-2 rounded-[50px] transition text-sm font-bold ">
            <div className=" mx-auto flex justify-between gap-2 mt-[10px]">
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
