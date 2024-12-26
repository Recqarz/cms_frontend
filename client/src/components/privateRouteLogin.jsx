import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PrivateRouteLogin = (props) => {
  const { Component } = props;
  let navigate = useNavigate();
  let islogin = useSelector((state) => state.isLogin);
  useEffect(() => {
    if (islogin) {
      navigate("/dashboard");
    }
  }, [navigate, islogin]);
  return <Component />;
};

export default PrivateRouteLogin;
