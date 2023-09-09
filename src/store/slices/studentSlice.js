/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// eslint-disable-next-line import/no-cycle
import dayjs from "dayjs";
import { dataSetup } from "../../utils";
import { changeFetching } from "./uiSlice";
import { qualificationKeys } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

export const fetchStudents = createAsyncThunk(
  "students/fetch",
  async ({ fetchPendingInterviewDetails, dataType }, thunkAPI) => {
    const globalState = thunkAPI.getState();
    const { loggedInUser } = globalState.auth;
    const {
      stage,
      filterColumns,
      page,
      numberOfRows,
      fromDate,
      toDate,
      school,
    } = globalState.students;
    // const { numberOfRows } = state;
    console.log("Data is fecthing");
    const from = dayjs(fromDate).isValid(fromDate) ? fromDate : undefined;
    const to = dayjs(toDate).isValid(toDate) ? toDate : undefined;

    let finalDates = {};
    if (from && to) {
      finalDates = { from, to };
    }

    console.log("school in slice", school);

    // const updatedSchool = await axios
    //   .get(`${baseUrl}school`)
    //   .then((response) => {
    //     console.log("response", response);
    //   });

    // console.log("updatedSchool", updatedSchool);
    // const querySchool = updatedSchool
    //   ? await updatedSchool.data.find((school) => {
    //       console.log("school name console", school);
    //       if (school.name === school) return school.id;
    //     })
    //   : null;
    // console.log("querySchool", querySchool);

    const concatinateStage = stage.length === 0 ? null : stage.join(",");
    const querySchool = school === "" ? null : school;
    try {
      console.log("Lets go to try block");
      thunkAPI.dispatch(changeFetching(true)); // startFetching
      console.log("Is thunkAPI working", thunkAPI);
      let response;
      console.log("What is happening with response then?", response);
      if (fetchPendingInterviewDetails) {
        response = await axios.get(`${baseUrl}students/pending_interview`, {
          params: {
            user: loggedInUser.mailId,
          },
        });
      } else {
        console.log("Am I going to else block?");
        console.log("filterColumns before", filterColumns);
        const url =
          filterColumns && filterColumns.length > 0
            ? await filterColumns.reduce((cUrl, filterColumn, index) => {
                if (index > 0) {
                  return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
                }
                return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
              }, `${baseUrl}students?`)
            : null;
        // const url = await filterColumns.reduce((cUrl, filterColumn, index) => {
        //   if (index > 0) {
        //     return `${cUrl}&${filterColumn.key}=${filterColumn.value}`;
        //   }
        //   return `${cUrl}${filterColumn.key}=${filterColumn.value}`;
        // }, `${baseUrl}students?`);
        console.log("filterColumns after", filterColumns);
        console.log("url", url);
        response =
          filterColumns && filterColumns.length > 0
            ? await axios.get(`${url}&limit=${numberOfRows}&page=${page}`, {
                params: {
                  dataType,
                  stage: stage.length === 0 ? null : stage.join(","),
                  ...finalDates,
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
                    school:
                      typeof querySchool === "string" ? null : querySchool,
                  },
                }
              );
        // console.log("dataType", dataType);
        // console.log("concatinateStage", concatinateStage);
        // console.log("fromDate", fromDate);
        // console.log("toDate", toDate);
        console.log("querySchool", querySchool);
        // response = await axios.get(
        //   `${baseUrl}students?limit=${numberOfRows}&page=${page}`,
        //   {
        //     params: {
        //       dataType,
        //       stage: concatinateStage,
        //       from: fromDate,
        //       to: toDate,
        //       // school: querySchool,
        //     },
        //   }
        // );

        // It's only returning the response for else block only when we refresh the page
        console.log("response in else", response);
        // eslint-disable-next-line no-use-before-define
        thunkAPI.dispatch(setUrl(url));
      }
      console.log("Lets find the response", response);

      console.log("response result", response.data.data.results);
      console.log("response data", response.data.data);
      let results =
        school === "" ? response.data.data.results : response.data.data;
      const studentData =
        // response.data &&
        // response.data.data &&
        results.map((student) => {
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
    school: "",
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
    setSchool: (state, action) => {
      state.school = action.payload;
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
  setSchool,
  setUrl,
  setSelectedStudent,
} = StudentSlice.actions; // actions auto generated from above reducers
export default StudentSlice.reducer; // exporting the reducer
