/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import { dataSetup } from "../../utils";
import { changeFetching } from "./uiSlice";
import { qualificationKeys } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

export const fetchStudents = createAsyncThunk(
  "students/fetch",
  async ({ fetchPendingInterviewDetails, dataType }, thunkAPI) => {
    const globalState = thunkAPI.getState();
    const { loggedInUser } = globalState.auth;
    const { stage, filterColumns, page, numberOfRows, fromDate, toDate } =
      globalState.students;
    // const { numberOfRows } = state;

    const concatinateStage = stage.length === 0 ? null : stage.join(",");
    try {
      thunkAPI.dispatch(changeFetching(true)); // startFetching
      let response;
      if (fetchPendingInterviewDetails) {
        response = await axios.get(`${baseUrl}students/pending_interview`, {
          params: {
            user: loggedInUser.mailId,
          },
        });
      } else {
        const url = await filterColumns.reduce((cUrl, filterColumn, index) => {
          if (index > 0) {
            return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
          }
          return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
        }, `${baseUrl}students?`);
        response =
          filterColumns && filterColumns.length > 0
            ? await axios.get(`${url}&limit=${numberOfRows}&page=${page}`, {
                params: {
                  dataType,
                  stage: stage.length === 0 ? null : stage.join(","),
                  from: fromDate,
                  to: toDate,
                },
              })
            : await axios.get(
                `${baseUrl}students?limit=${numberOfRows}&page=${page}`,
                {
                  params: {
                    dataType,
                    stage: concatinateStage,
                    from: fromDate,
                    to: toDate,
                  },
                }
              );

        // eslint-disable-next-line no-use-before-define
        thunkAPI.dispatch(setUrl(url));
      }
      const studentData =
        // response.data &&
        // response.data.data &&
        response.data.data.results.map((student) => {
          const contacts = student.contacts[student.contacts.length - 1];
          return {
            ...student,
            qualification: qualificationKeys[student.qualification],
            studentOwner: "",
            campus: student.campus ? student.campus : null,
            donor: student.studentDonor ? student.studentDonor : null,
            altNumber: contacts ? contacts.alt_mobile : contacts,
          };
        });
      thunkAPI.dispatch(changeFetching(false));
      return dataSetup(
        studentData,
        response.data.data.total,
        loggedInUser.mail_id
      );
    } catch (e) {
      thunkAPI.dispatch(changeFetching(false));
    }
  }
);

const StudentSlice = createSlice({
  name: "students",
  initialState: {
    studentData: [],
    filterColumns: [],
    url: `${baseUrl}students?`,
    totalData: 0,
    fromDate: null,
    toDate: null,
    numberOfRows: 10,
    page: 0,
    stage: [],
    selectedStudent: { studentId: null, transitions: [] },
  },
  reducers: {
    // creating reducers
    setStudentData: (state, action) => {
      state.studentData = action.payload.data;
      state.totalData = action.payload.totalData;
    },
    setFilterColumns: (state, action) => {
      state.filterColumns = action.payload.filterColumns;
      state.url = action.payload.url;
    },
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setNoOfRows: (state, action) => {
      state.numberOfRows = action.payload;
    },
    setPageNo: (state, action) => {
      state.page = action.payload;
    },
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: {
    [fetchStudents.fulfilled]: (state, action) => {
      state.studentData = action.payload.data;
      state.totalData = action.payload.totalData;
    },
  },
});

export const {
  setStudentData,
  setFilterColumns,
  setFromDate,
  setToDate,
  setNoOfRows,
  setPageNo,
  setStage,
  setUrl,
  setSelectedStudent,
} = StudentSlice.actions; // actions auto generated from above reducers
export default StudentSlice.reducer; // exporting the reducer
