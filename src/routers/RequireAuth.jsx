import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import NotHaveAccess from "../components/layout/NotHaveAccess";
import { parseJwt } from "../utils";
import { logout } from "../store/slices/authSlice";
import Loader from "../components/ui/Loader";

const RequireAuth = ({ children, privateRoute }) => {
  const { enqueueSnackbar } = useSnackbar();
  const decodedJwt = parseJwt(localStorage.getItem("jwt"));
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.ui);
  const { loggedInUser, isAuthenticated, roles, privileges } = useSelector(
    (state) => state.auth
  );
  if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
    enqueueSnackbar("Token Expierd: Login Again", { variant: "info" });
    dispatch(logout());
    return <Navigate to="/" replace />;
  }
  if (!isAuthenticated && privateRoute)
    return <Navigate to="/login" state={{ from: location }} replace />;
  // if (isAuthenticated && loggedInUser && !loggedInUser.mobile)
  //   return <Navigate to="/user/mobile/number" replace />;
  if (isAuthenticated && !privateRoute)
    return <Navigate to="/students" replace />;
  if (
    location.pathname.split("/")[1] === "admin" &&
    location.pathname.split("/")[2] === "create" &&
    ![
      "swanand@navgurukul.org",
      "vaibhav@navgurukul.org",
      "kirithiv@navgurukul.org",
      "anand@navgurukul.org",
    ].includes(loggedInUser.email)
  )
    return <NotHaveAccess />;
  if (isAuthenticated && roles.some((roleItem) => roleItem.role === "Admin"))
    return <div className="bodyComponent">{children}</div>;
  const currentPath = location.pathname.split("/")[1];
  let role;
  if (!privateRoute) return <div className="bodyComponent">{children}</div>;
  switch (currentPath) {
    case "admin":
      return (
        <div className="bodyComponent">
          {roles.some((roleItem) => roleItem.role === "Admin") ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
    case "students":
      return (
        <div className="bodyComponent">
          {privileges.some((priv) => priv.privilege === "ViewDashboard") ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
    case "placements":
      return (
        <div className="bodyComponent">
          {privileges.some((priv) => priv.privilege === "ViewPlacements") ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
    // case "partner":
    //   return params.partnerId === undefined ||
    //     roles.some(
    //       (role) =>
    //         role.role === "Partner" &&
    //         role.access.findIndex(
    //           (accessItem) =>
    //             accessItem.access === parseInt(params.partnerId, 10)
    //         )
    //     ) ? (
    //     <div className="bodyComponent">{children}</div>
    //   ) : (
    //     <div className="bodyComponent">
    //       <NotHaveAccess />
    //     </div>
    //   );
    case "campus":
      role = roles.find((roleItem) => roleItem.role === "Campus");
      return (
        <div className="bodyComponent">
          {params.campusId === undefined ||
          (role &&
            role.access.findIndex(
              (accessItem) =>
                accessItem.access === parseInt(params.campusId, 10)
            ) !== -1) ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
    case "donor":
      role = roles.find((roleItem) => roleItem.role === "Donor");
      return (
        <div className="bodyComponent">
          {params.donorItem === undefined ||
          (role &&
            role.access.findIndex(
              (accessItem) =>
                accessItem.access === parseInt(params.donorItem, 10)
            ) !== -1) ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
    default:
      return (
        <div className="bodyComponent">
          {privileges.some((priv) => priv.privilege === "ViewDashboard") ? (
            children
          ) : isFetching ? (
            <Loader container />
          ) : (
            <NotHaveAccess />
          )}
        </div>
      );
  }
};

export default RequireAuth;

RequireAuth.defaultProps = {
  privateRoute: false,
};
