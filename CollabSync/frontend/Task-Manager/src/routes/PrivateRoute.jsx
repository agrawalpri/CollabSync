import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);

  // If user is not logged in
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is allowed, render the page inside this route
  return <Outlet />;
};

export default PrivateRoute;
