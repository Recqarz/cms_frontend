import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "../Auth/Signup.jsx";
import RegisterVerifyOtp from "../Auth/RegisterVerifyOtp.jsx";
import Login from "../Auth/Login.jsx";
import Verification from "../Auth/Verification.jsx";
import ForgetPassword from "../Auth/ForgetPassword.jsx";
import GeneratePassword from "../Auth/GeneratePassword.jsx";
import CreatePassword from "../Auth/CreatePassword.jsx";
import Allroutes from "../globalRoute/globalRoute.jsx";
import PrivateRoute from "./privateRoute.jsx";

const Home = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/generate-password" element={<GeneratePassword />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/password" element={<CreatePassword />} />
      <Route path="/register-verify-otp" element={<RegisterVerifyOtp />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/*" element={<PrivateRoute Component={Allroutes} />} />
    </Routes>
  );
};

export default Home;
