import React from "react";

const NotHaveAccess = () => {
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
};

export default NotHaveAccess;
