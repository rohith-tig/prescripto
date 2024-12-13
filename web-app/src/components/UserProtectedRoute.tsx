import Cookies from "js-cookie";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  const jwtToken = Cookies.get("presToken");
  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export const DocProtectedRoute: React.FC = () => {
  const jwtToken = Cookies.get("docToken");
  if (jwtToken === undefined) {
    return <Navigate to="/doctor-login" />;
  }
  return <Outlet />;
};

export const AdminProtectedRoute: React.FC = () => {
  const jwtToken = Cookies.get("adToken");
  if (jwtToken === undefined) {
    return <Navigate to="/admin-login" />;
  }
  return <Outlet />;
};
