import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formData } from "../global/action";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    address: "",
    state: "",
    district: "",
    companyName: "",
    companyAddress: "",
    bankName: "",
    bankAddress: "",
    userDegisnation: "",
    pinCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !userData.name ||
      !userData.email ||
      !userData.mobile ||
      !userData.role ||
      !userData.address ||
      !userData.state ||
      !userData.district ||
      !userData.pinCode
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    dispatch(formData(userData));
    navigate("/password");
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative ">
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <img src="/sign_logo.png" alt="Illustration" className="w-[200px]" />
      </div>

      {/* Form Container */}

      <div
        className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 mx-auto overflow-y-auto max-h-[95vh] p-4  rounded "
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

        <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">
          Create an account
        </h2>

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
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full border rounded-md px-2 py-1 text-sm"
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full border rounded-md px-2 py-1 text-sm"
              autoComplete="username" // Explicitly specify this
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 text-sm">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={userData.mobile}
              onChange={handleInputChange}
              placeholder="Enter mobile number"
              className="w-full border rounded-md px-2 py-1 text-sm"
              autoComplete="mobile"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 text-sm">Role</label>
            <select
              name="role"
              value={userData.role}
              onChange={handleInputChange}
              className="w-full border rounded-md px-2 py-1 text-sm"
              autoComplete="role"
              required
            >
              <option value="">Select Role</option>
              <option value="company">Company</option>
              <option value="bank">Bank</option>
              <option value="individual">Individual</option>
              <option value="advocate">Advocate</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {(userData.role === "company" || userData.role === "bank") && (
            <>
              <div>
                <label className="block text-gray-700 text-sm">
                  {userData.role === "bank" ? "Bank Name" : "Company Name"}
                </label>
                <input
                  type="text"
                  name={userData.role == "bank" ? "bankName" : "companyName"}
                  value={
                    userData.role == "bank"
                      ? userData.bankName
                      : userData.companyName
                  }
                  onChange={handleInputChange}
                  placeholder={`Enter ${
                    userData.role === "Bank" ? "Bank" : "Company"
                  } Name`}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm">
                  {userData.role === "bank"
                    ? "Bank Address"
                    : "Company Address"}
                </label>
                <input
                  type="text"
                  name={
                    userData.role == "bank" ? "bankAddress" : "companyAddress"
                  }
                  value={
                    userData.role == "bank"
                      ? userData.bankAddress
                      : userData.companyAddress
                  }
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm">
                  Designation
                </label>
                <input
                  type="text"
                  name="userDegisnation"
                  value={userData.userDegisnation}
                  onChange={handleInputChange}
                  placeholder="Enter designation"
                  className="w-full border rounded-md px-2 py-1 text-sm"
                />
              </div>
            </>
          )}

          {/* State & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm">State</label>
              <input
                type="text"
                name="state"
                value={userData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="state"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm">District</label>
              <input
                type="text"
                name="district"
                value={userData.district}
                onChange={handleInputChange}
                placeholder="Enter district"
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="district"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm">Address</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm">Pincode</label>
              <input
                type="number"
                name="pinCode"
                value={userData.pinCode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="w-full border rounded-md px-2 py-1 text-sm"
                autoComplete="pinCode"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white py-2 rounded-[50px] bg-[#716868] hover:bg-[#484444] transition text-sm font-bold mt-[200px]"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
