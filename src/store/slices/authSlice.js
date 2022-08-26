/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setupUser } from "../../components/admin/AdminPage";
import { encryptText, toTitleCase } from "../../utils";
import { baseUrl } from "../../utils/constants";
import { changeFetching, enqueueSnackbar } from "./uiSlice";

const fetchAllPrivileges = async () => {
  const res = await axios.get(`${baseUrl}role/getPrivilege`);
  return res.data;
};

export const loginWithGoogle = createAsyncThunk(
  "auth/login",
  async ({ response }, thunkAPI) => {
    thunkAPI.dispatch(changeFetching(true));
    try {
      const rolesData = await axios.get(
        `${baseUrl}rolebaseaccess/mail/${response.profileObj.email}`
      );
      // const rolesData = { data: [] };
      const { roles, privileges } =
        rolesData.data.length > 0
          ? setupUser(rolesData.data[0])
          : { roles: [], privileges: [] };
      const isAdmin = roles.some(
        (role) => role.role === "Admin" || role.role === "FullDashboardAccess"
      );
      const newPrivs = isAdmin
        ? [
            ...privileges,
            ...(await fetchAllPrivileges()).map((priv) => ({
              ...priv,
              privilege: toTitleCase(priv.privilege),
            })),
          ]
        : privileges;
      if (
        response.profileObj.email.includes("@navgurukul.org") ||
        privileges.some((priv) => priv.privilege === "SpecialLogin")
      ) {
        const userData = await axios.post(`${baseUrl}users/login/google`, {
          idToken: response.tokenObj.id_token,
        });
        const { userToken, user } = userData.data;

        localStorage.setItem("jwt", userToken);
        localStorage.setItem("userId", encryptText(`${user.id}`));
        localStorage.setItem("email", encryptText(user.email));
        thunkAPI.dispatch(
          enqueueSnackbar({
            message: "Logged In Successfully",
            options: { variant: "success" },
          })
        );
        thunkAPI.dispatch(changeFetching(false));
        return { isAuthenticated: true, user, roles, privileges: newPrivs };
      }
      thunkAPI.dispatch(
        enqueueSnackbar({
          message: `Please use NG Email, or request Special Access`,
          options: { variant: "error" },
        })
      );
      thunkAPI.dispatch(changeFetching(false));
      return { isAuthenticated: false };
    } catch (err) {
      thunkAPI.dispatch(
        enqueueSnackbar({
          message: `Error : ${err.message}`,
          options: { variant: "error" },
        })
      );
      thunkAPI.dispatch(changeFetching(false));
      throw Error(err.message);
    }
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

        const { roles, privileges } =
          rolesData.data.length > 0
            ? setupUser(rolesData.data[0])
            : { roles: [], privileges: [] };
        const isAdmin = roles.some(
          (role) => role.role === "Admin" || role.role === "FullDashboardAccess"
        );

        const newPrivs = isAdmin
          ? [
              ...privileges,
              ...(await fetchAllPrivileges()).map((priv) => ({
                ...priv,
                privilege: toTitleCase(priv.privilege),
              })),
            ]
          : privileges;
        thunkAPI.dispatch(changeFetching(false));
        return {
          error: false,
          user: data,
          roles,
          privileges: newPrivs,
        };
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
