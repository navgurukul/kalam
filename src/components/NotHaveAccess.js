import React from "react";

import GoogleLogin from "react-google-login";

export class NotHaveAccess extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            color: "red",
            fontSize: "50px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          You need access to view this page!!!
        </h1>
      </div>
    );
  }
}

export default NotHaveAccess;
