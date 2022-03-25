/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const DataSlice = createSlice({
  name: "data",
  initialState: {
    getData: [],
  },
  reducers: {
    // creating reducers
    getData: (state, action) => {
      state.getData = action.payload;
    },
  },
});

export const { getData } = DataSlice.actions; // actions auto generated from above reducers
export default DataSlice.reducer; // exporting the reducer
