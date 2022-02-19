import React from "react";

const user = () => {
  console.log(localStorage.getItem("user"), "user");
  const userLoggedIn = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return userLoggedIn;
};

export default user;
