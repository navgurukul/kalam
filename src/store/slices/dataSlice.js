/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const DataSlice = createSlice({
  name: "data",
  initialState: {
    studentData: [],
  },
  reducers: {
    // creating reducers
    setStudentData: (state, action) => {
      state.studentData = action.payload;
    },
  },
});

export const { setStudentData } = DataSlice.actions; // actions auto generated from above reducers
export default DataSlice.reducer; // exporting the reducer
