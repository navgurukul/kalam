import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loggedInUser } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) => {
        return isAuthenticated && loggedInUser.mobile ? (
          <Redirect to="/students" />
        ) : props.location.pathname === "/" ? (
          <Component {...props} />
        ) : (
          <React.Fragment>
            <Header />
            <Component {...props} />
            <Footer />
          </React.Fragment>
        );
      }}
    />
  );
};

export default PublicRoute;
