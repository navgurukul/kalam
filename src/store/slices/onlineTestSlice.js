/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { decryptText } from "../../utils";

const OnlineTestSlice = createSlice({
  name: "onlineTest",
  initialState: {
    questions: [],
    enrollmentKey: decryptText(localStorage.getItem("enrollmentKey")) || "",
    studentId: decryptText(localStorage.getItem("enrollmentKey")) || "",
    studentData: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
    },
    partner: {
      slug: decryptText(localStorage.getItem("partnerSlug")) || "",
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
