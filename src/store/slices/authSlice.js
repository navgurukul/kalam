/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isFetching: false,
    isAuthenticated: !!localStorage.getItem("jwt"),
    loggedInUser: JSON.parse(localStorage.getItem("user")),
    users: null,
  },
  reducers: {
    // creating reducers
    changeFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    setupUsers: (state, action) => {
      state.users = action.payload;
    },
    login: (state) => {
      state.isAuthenticated = !!localStorage.getItem("jwt");
      state.loggedInUser = JSON.parse(localStorage.getItem("user"));
    },
    logout: (state) => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      state.isAuthenticated = false;
      state.loggedInUser = null;
    },
  },
});

export const { login, logout, changeFetching, setupUsers } = AuthSlice.actions; // actions auto generated from above reducers
export default AuthSlice.reducer; // exporting the reducer
