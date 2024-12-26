import React, { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import axios from "axios";
import { isLogin } from "@/global/action.jsx";
import PrivateRouteLogin from "./privateRouteLogin.jsx";

const Home = () => {
  let dispatch = useDispatch();

  const validToken = async () => {
    const token = localStorage.getItem("cmstoken")
      ? JSON.parse(localStorage.getItem("cmstoken"))
      : "";
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/auth/validatetoken`, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("valid");
        })
        .catch((err) => {
          localStorage.removeItem("cmstoken");
          localStorage.removeItem("cmsrole");
          localStorage.removeItem("cmsusername");
          dispatch(isLogin(false));
          dispatch(updateRole(""));
        });
    }
  };

  useEffect(() => {
    validToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PrivateRouteLogin Component={Login} />} />
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
