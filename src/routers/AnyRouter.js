import React from "react";
import { Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const AnyRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    component={(props) => {
      return (
        <div>
          <Header />
          <div className="bodyComponent">
            <Component {...props} />
          </div>
          <Footer />
        </div>
      );
    }}
  />
);

export default AnyRoute;
