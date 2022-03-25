import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children, privateRoute }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated && privateRoute)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (isAuthenticated && !privateRoute)
    return <Navigate to="/students" replace />;
  return <div className="bodyComponent">{children}</div>;
};

export default RequireAuth;

RequireAuth.defaultProps = {
  privateRoute: false,
};
