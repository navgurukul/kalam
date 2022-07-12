/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const CampusSlice = createSlice({
  name: "campus",
  initialState: {
    students: [],
    allStudents: [],
    fromStage: null,
    toStage: null,
    fromDate: null,
    toDate: null,
    dropoutCount: null,
    onLeaveCount: null,
    inCampusCount: null,
  },
  reducers: {
    setStudentData: (state, action) => {
      state.students = action.payload;
    },
    setAllStudentData: (state, action) => {
      state.allStudents = action.payload;
    },
    setFromStage: (state, action) => {
      state.fromStage = action.payload;
    },
    setToStage: (state, action) => {
      state.toStage = action.payload;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setCounts: (state, action) => {
      const { dropoutCount, onLeaveCount, inCampusCount } = action.payload;
      state.dropoutCount = dropoutCount;
      state.onLeaveCount = onLeaveCount;
      state.inCampusCount = inCampusCount;
    },
    clearData: (state) => {
      state.students = [];
      state.allStudents = [];
      state.fromStage = null;
      state.toStage = null;
      state.fromDate = null;
      state.toDate = null;
      state.dropoutCount = null;
      state.onLeaveCount = null;
      state.inCampusCount = null;
    },
  },
});

export const {
  clearData,
  setStudentData,
  setAllStudentData,
  setFromStage,
  setToStage,
  setFromDate,
  setToDate,
  setCounts,
} = CampusSlice.actions;

export default CampusSlice.reducer;
