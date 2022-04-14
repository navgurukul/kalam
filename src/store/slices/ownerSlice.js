/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { changeFetching, enqueueSnackbar } from "./uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;

export const fetchOwners = createAsyncThunk(
  "owners/fetch",
  async (args, thunkAPI) => {
    try {
      thunkAPI.dispatch(changeFetching(true));
      const ownerRes = await axios.get(`${baseUrl}owner`);
      const { data } = ownerRes.data;
      thunkAPI.dispatch(changeFetching(false));
      return data;
    } catch (err) {
      thunkAPI.dispatch(changeFetching(false));
      throw Error(err.message);
    }
  }
);

export const deleteOwner = createAsyncThunk(
  "owners/delete",
  async ({ ownerId }, thunkAPI) => {
    const globalState = thunkAPI.getState();
    const { ownerData } = globalState.owners;
    try {
      thunkAPI.dispatch(changeFetching(true));
      await axios.delete(`${baseUrl}owner/${ownerId}`);
      const newOwnerData = ownerData.filter((item) => item.id !== ownerId);
      thunkAPI.dispatch(
        enqueueSnackbar({
          message: "Owner successfully deleted",
          options: { variant: "success" },
        })
      );
      thunkAPI.dispatch(changeFetching(false));
      return newOwnerData;
    } catch (err) {
      thunkAPI.dispatch(changeFetching(false));
      throw Error(err.message);
    }
  }
);

export const fetchOwnerMails = createAsyncThunk(
  "owners/fetchmails",
  async (params, thunkAPI) => {
    try {
      thunkAPI.dispatch(changeFetching(true));
      const ownerListRes = await axios.get(`${baseUrl}owner`);
      const ownerMailList = ownerListRes.data.data.map(
        (item) => item.user.mail_id
      );
      thunkAPI.dispatch(changeFetching(false));
      return ownerMailList;
    } catch (err) {
      thunkAPI.dispatch(changeFetching(false));
      throw Error(err.message);
    }
  }
);

const OwnerSlice = createSlice({
  name: "owners",
  initialState: {
    ownerData: [],
    ownerMailList: [], // only mail_ids
  },
  reducers: {
    setOwnerData: (state, action) => {
      state.ownerData = action.payload;
    },
  },
  extraReducers: {
    [fetchOwners.fulfilled]: (state, action) => {
      state.ownerData = action.payload;
    },
    [deleteOwner.fulfilled]: (state, action) => {
      state.ownerData = action.payload;
    },
    [fetchOwnerMails.fulfilled]: (state, action) => {
      state.ownerMailList = action.payload;
    },
  },
});

export const { setOwnerData } = OwnerSlice.actions;

export default OwnerSlice.reducer;
