import React, { useState, useEffect } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

  // Check if token is valid when the component is mounted
  useEffect(() => {
    const checkTokenValidity = async () => {
      // Only check the token validity if we are NOT on the login page
      if (window.location.pathname !== '/login') {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/email/validate`, {
            withCredentials: true,
          });

          if (response.data.success) {
            setUserData(response.data.user); // Set user data
            navigate('/home'); // Redirect to home if valid
          }
        } catch (error) {
          console.log('Token validation failed', error);
        }
      }
    };

    checkTokenValidity();
  }, [navigate]); // Adding `navigate` ensures that the hook works properly when navigating

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Send login request first
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/email/login`,
          values,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success('Login successful!');

          // Store user email and ID in localStorage
          localStorage.setItem('email', values.email);
          localStorage.setItem('userId', response.data.user.id); // Store user ID

          onLoginSuccess(response.data.user);

          // Perform token validation after successful login
          const tokenValidationResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/email/validate`, {
            withCredentials: true,
          });

          if (tokenValidationResponse.data.success) {
            // Token is valid, navigate to home page
            navigate('/home');
          } else {
            toast.error('Token validation failed.');
            navigate('/login');
          }
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login error.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className={`w-full px-4 py-2 mt-2 border rounded-lg ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
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
            <label className="block text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`w-full px-4 py-2 mt-2 border rounded-lg ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <div
              className="absolute inset-y-0 right-3 top-[2.5rem] cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <IoIosEyeOff size={24} /> : <IoIosEye size={24} />}
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>

        {/* Optional Logout Button */}
        {userData && (
          <button
            onClick={() => {
              localStorage.removeItem('email');
              localStorage.removeItem('userId'); // Clear user data from localStorage
              navigate('/login'); // Redirect to login
            }}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
