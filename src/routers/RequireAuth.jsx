import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import NotHaveAccess from "../components/NotHaveAccess";

const RequireAuth = ({ children, privateRoute }) => {
  const location = useLocation();
  const params = useParams();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);
  if (!isAuthenticated && privateRoute)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (isAuthenticated && !privateRoute)
    return <Navigate to="/students" replace />;
  const currentPath = location.pathname.split("/")[1];
  switch (currentPath) {
    case "partner":
      return params.partnerId === undefined ||
        roles.some(
          (role) =>
            role.split(":")[0] === "Partner" &&
            parseInt(role.split(":")[1], 10) === parseInt(params.partnerId, 10),
          10
        ) ? (
        <div className="bodyComponent">{children}</div>
      ) : (
        <div className="bodyComponent">
          <NotHaveAccess />
        </div>
      );
    case "campus":
      return params.campusId === undefined ||
        roles.some(
          (role) =>
            role.split(":")[0] === "T&P" &&
            parseInt(role.split(":")[1], 10) === parseInt(params.campusId, 10),
          10
        ) ? (
        <div className="bodyComponent">{children}</div>
      ) : (
        <div className="bodyComponent">
          <NotHaveAccess />
        </div>
      );
    default:
      return <div className="bodyComponent">{children}</div>;
  }
};

export default RequireAuth;

RequireAuth.defaultProps = {
  privateRoute: false,
};
