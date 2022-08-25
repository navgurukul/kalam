/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { campusStatusDisplayOptions } from "../../utils/constants";

const CampusSlice = createSlice({
  name: "campus",
  initialState: {
    students: [],
    allStudents: [],
    stageFilter: null,
    fromDate: null,
    toDate: null,
    allStatusCount: campusStatusDisplayOptions.reduce(
      (allCounts, key) => ({ ...allCounts, [key]: 0 }),
      { total: 0 }
    ),
  },
  reducers: {
    setStudentData: (state, action) => {
      state.students = action.payload;
    },
    setAllStudentData: (state, action) => {
      state.allStudents = action.payload;
    },
    setStageFilter: (state, action) => {
      state.stageFilter = action.payload;
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
      state.allStatusCount = action.payload;
    },
    clearData: (state) => {
      state.students = [];
      state.allStudents = [];
      state.stageFilter = null;
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
  setStageFilter,
  setFromDate,
  setToDate,
  setCounts,
} = CampusSlice.actions;

export default CampusSlice.reducer;
