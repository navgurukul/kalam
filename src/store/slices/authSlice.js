/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setupUser } from "../../components/admin/AdminPage";
import { encryptText } from "../../utils";
import { baseUrl } from "../../utils/constants";
import { enqueueSnackbar } from "./uiSlice";

export const loginWithGoogle = createAsyncThunk(
  "auth/login",
  async ({ response, specialLogin, callSnack }, thunkAPI) => {
    if (
      response.profileObj.email.includes("@navgurukul.org") ||
      specialLogin.includes(response.profileObj.email)
    ) {
      try {
        const userData = await axios.post(`${baseUrl}users/login/google`, {
          idToken: response.tokenObj.id_token,
        });
        const { userToken, user } = userData.data;
        // const rolesData = await axios.get(
        //   `${baseUrl}rolebaseaccess/mail/${user.email}`
        // );

        const rolesData = { data: [] };

        const { roles, privilege } =
          rolesData.data.length > 0
            ? rolesData.data[0]
            : { roles: [], privilege: [] };
        localStorage.setItem("jwt", userToken);
        localStorage.setItem("userId", encryptText(`${user.id}`));
        localStorage.setItem("email", encryptText(user.email));
        thunkAPI.dispatch(
          enqueueSnackbar({
            message: "Logged In Successfully",
            options: { variant: "success" },
          })
        );
        return { isAuthenticated: true, user, roles, privilege };
      } catch (err) {
        thunkAPI.dispatch(
          enqueueSnackbar({
            message: `Error : ${err.message}`,
            options: { variant: "error" },
          })
        );
        throw Error(err.message);
      }
    }
    callSnack(`Error Occured`, "error");
    return { isAuthenticated: false };
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchUser",
  async ({ userId }, thunkAPI) => {
    const globalState = thunkAPI.getState();
    const { isAuthenticated } = globalState.auth;
    if (isAuthenticated) {
      try {
        const userData = await axios.get(`${baseUrl}users/${userId}`);
        const { data } = userData.data;
        const rolesData = await axios.get(
          `${baseUrl}rolebaseaccess/mail/${data.email}`
        );
        // const rolesData = { data: [] };
        const { roles, privileges } =
          rolesData.data.length > 0
            ? setupUser(rolesData.data[0])
            : { roles: [], privileges: [] };
        return { error: false, user: data, roles, privileges };
      } catch (err) {
        throw Error(err.message);
      }
    }
    return { error: true };
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("jwt"),
    loggedInUser: { email: "", mail_id: "" },
    // users: null,
    roles: [],
    privileges: [],
  },
  reducers: {
    // // creating reducers
    // setupUsers: (state, action) => {
    //   state.users = action.payload;
    // },
    login: (state) => {
      state.isAuthenticated = !!localStorage.getItem("jwt");
      state.loggedInUser = JSON.parse(localStorage.getItem("user"));
    },
    logout: (state) => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("permissions");
      localStorage.removeItem("roles");
      localStorage.removeItem("privileges");
      localStorage.removeItem("email");
      state.isAuthenticated = false;
      state.loggedInUser = null;
      state.roles = [];
      state.privileges = [];
    },
  },
  extraReducers: {
    [loginWithGoogle.fulfilled]: (state, action) => {
      const { isAuthenticated, user, roles, privileges } = action.payload;
      if (isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
        state.loggedInUser = user;
        state.roles = roles;
        state.privileges = privileges;
      }
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      const { error, user, roles, privileges } = action.payload;
      if (!error) {
        state.loggedInUser = user;
        state.roles = roles;
        state.privileges = privileges;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const { login, logout } = AuthSlice.actions; // actions auto generated from above reducers
export default AuthSlice.reducer; // exporting the reducer
