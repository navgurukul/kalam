/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const fetchOwners = createAsyncThunk("data/fetchOwners", async () => {
  try {
    const ownerRes = await axios.get(`${baseUrl}owner`);
    const ownerList = ownerRes.data.data.map((item) => item.user.mail_id);
    return ownerList;
  } catch (err) {
    throw Error(err.message);
  }
});

export const fetchPartners = createAsyncThunk(
  "data/fetchPartners",
  async () => {
    try {
      const partnerRes = await axios.get(`${baseUrl}partners`);
      const partnerList = partnerRes.data.data.map((item) => item.name);
      return partnerList;
    } catch (err) {
      throw Error(err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk("data/fetchUsers", async () => {
  try {
    const userRes = await axios.get(`${baseUrl}users/getall`);
    const userList = userRes.data.data.map((item) => item.user);
    return userList;
  } catch (err) {
    throw Error(err.message);
  }
});

const DataSlice = createSlice({
  name: "data",
  initialState: {
    partners: [],
    owners: [],
    users: [],
  },
  reducers: {
    setOwners: (state, action) => {
      state.owners = action.payload;
    },
    setPartners: (state, action) => {
      state.partners = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: {
    [fetchOwners.fulfilled]: (state, action) => {
      state.owners = action.payload;
    },
    [fetchPartners.fulfilled]: (state, action) => {
      state.partners = action.payload;
    },
    [fetchUsers.fulfilled]: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setOwners, setPartners, setUsers } = DataSlice.actions;

export default DataSlice.reducer;
