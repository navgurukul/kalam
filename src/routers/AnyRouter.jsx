import React, { memo } from "react";
import { Route } from "react-router-dom";

export const AnyRoute = ({ component: Component, ...rest }) => (
  <Route
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
    element={memo((props) => (
      <div>
        <div className="bodyComponent">
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...props} />
        </div>
      </div>
    ))}
  />
);

export default AnyRoute;
