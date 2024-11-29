import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      number: "", 
      role: "User",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      number: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Enter a valid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        toast.dismiss();
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email/send-otp`,
          {
            email: values.email,
          }
        );

        if (response.data.success) {
          setOtpSent(true);
          toast.success("OTP has been sent to your email.");
        } else {
          toast.error(response.data.message || "Failed to send OTP.");
        }
      } catch (error) {
        if (error.response?.data?.message === "User already exists.") {
          toast.error("User already exists. Please log in.");
        } else {
          toast.error("Failed to send OTP. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const verifyOtp = async () => {
    try {
      setVerifyLoading(true);
      toast.dismiss(); 

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/verify-otp`,
        {
          email: formik.values.email,
          otp,
        }
      );

      if (response.data.success) {
        // If OTP is verified, proceed with signup
        const registerResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email/signup`,
          {
            name: formik.values.name,
            email: formik.values.email,
            password: formik.values.password,
            number: formik.values.number, 
            role: formik.values.role,  // Send role along with other data

          }
        );

        if (registerResponse.data.success) {
          toast.success("Signup successful!");
          navigate("/login"); 
        } else {
          throw new Error(registerResponse.data.message);
        }
      }
    } catch (error) {
      // Extract and show the error message from server
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {!otpSent ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.name && formik.touched.name
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <div className="h-6">
                {formik.errors.name && formik.touched.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <div className="h-6">
                {formik.errors.email && formik.touched.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2"
                onChange={formik.handleChange}
                value={formik.values.role}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <div className="h-6">
                {formik.errors.password && formik.touched.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="number" // Fix: Change "phoneNumber" to "number" to match formik's key
                className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.number && formik.touched.number
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.number} // Fix: Use formik's "number" value
              />
              <div className="h-6">
                {formik.errors.number && formik.touched.number && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.number}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-3">
              <label className="block text-gray-700">Enter OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              disabled={verifyLoading}
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Signup;
