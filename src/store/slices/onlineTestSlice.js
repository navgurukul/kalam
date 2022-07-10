/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const OnlineTestSlice = createSlice({
  name: "onlineTest",
  initialState: {
    questions: [],
    enrollmentKey: "",
    studentId: "",
    studentData: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
    },
    partner: {
      slug: "",
      id: "",
    },
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setEnrollmentKey: (state, action) => {
      state.enrollmentKey = action.payload;
    },
    setPartner: (state, action) => {
      state.partner = action.payload;
    },
    setStudentId: (state, action) => {
      state.studentId = action.payload;
    },
    setStudentData: (state, action) => {
      state.studentData = action.payload;
    },
  },
});

export const {
  setEnrollmentKey,
  setPartner,
  setStudentId,
  setStudentData,
  setQuestions,
} = OnlineTestSlice.actions;
export default OnlineTestSlice.reducer;
