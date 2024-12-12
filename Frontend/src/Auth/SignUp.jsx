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
          { email: values.email }
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
        { email: formik.values.email, otp }
      );

      if (response.data.success) {
        const registerResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email/signup`,
          {
            name: formik.values.name,
            email: formik.values.email,
            password: formik.values.password,
            number: formik.values.number,
            role: formik.values.role,
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
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h2>
        {!otpSent ? (
          <form onSubmit={formik.handleSubmit}>
            {["name", "email", "password", "number"].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-gray-700 font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  className={`w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                    formik.errors[field] && formik.touched[field]
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-blue-400"
                  }`}
                  placeholder={`Enter your ${field}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                />
                {formik.errors[field] && formik.touched[field] && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors[field]}
                  </p>
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <div>
            <label className="block text-gray-700 font-medium mb-2">OTP</label>
            <input
              type="text"
              className="w-full px-3 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:opacity-90"
              disabled={verifyLoading}
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline transition duration-200"
          >
            Login
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Signup;
