import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children, role }) {
  const token = localStorage.getItem("accessToken");
  const userRole = (localStorage.getItem("userRole") || "").toUpperCase();
  const loc = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (role && userRole && userRole !== String(role).toUpperCase())
    return <Navigate to="/" replace />;
  return children;
}
