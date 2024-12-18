import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../Auth/Signup.jsx";
import RegisterVerifyOtp from "../Auth/RegisterVerifyOtp.jsx";
import Login from "../Auth/Login.jsx";
import Verification from "../Auth/Verification.jsx";
import ForgetPassword from "../Auth/ForgetPassword.jsx";
import GeneratePassword from "../Auth/GeneratePassword.jsx";
import CreatePassword from "../Auth/CreatePassword.jsx";

const Home = () => {
  return (
    <Routes>
      {/* Default Route: Login Page */}
      <Route path="/" element={<Login />} />

      {/* Forget Password Flow */}
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/generate-password" element={<GeneratePassword />} />

      {/* Signup Flow */}
      <Route path="/signup" element={<Signup />} />

      {/* Create Password Flow */}
      <Route path="/password" element={<CreatePassword />} />

      {/* Register Verify OTP Flow */}
      <Route path="/register-verify-otp" element={<RegisterVerifyOtp />} />

      {/* Verification Page */}
      <Route path="/verification" element={<Verification />} />
    </Routes>
  );
};


export default Home;
