import React, { useState, useEffect } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () =>
    setShowPassword((prevState) => !prevState);

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (window.location.pathname !== "/login") {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/email/validate`,
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            setUserData(response.data.user);
            navigate("/home");
          }
        } catch (error) {
          console.log("Token validation failed", error);
        }
      }
    };
    checkTokenValidity();
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email/login`,
          values,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("email", values.email);
          localStorage.setItem("userId", response.data.user.id);
          onLoginSuccess(response.data.user);

          const tokenValidationResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/email/validate`,
            {
              withCredentials: true,
            }
          );

          if (tokenValidationResponse.data.success) {
            navigate("/home");
          } else {
            toast.error("Token validation failed.");
            navigate("/login");
          }
        } else {
          throw new Error("Login failed");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login error.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to your account to continue
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer py-12"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <IoIosEyeOff size={20} className="text-gray-600" />
              ) : (
                <IoIosEye size={20} className="text-gray-600" />
              )}
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>

        {userData && (
          <button
            onClick={() => {
              localStorage.removeItem("email");
              localStorage.removeItem("userId");
              navigate("/login");
            }}
            className="w-full py-2 mt-4 text-white bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
