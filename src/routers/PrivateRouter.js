import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <div>
            <Header />
            <div className="bodyComponent">
              <Component {...props} />
            </div>
            <Footer />
          </div>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
