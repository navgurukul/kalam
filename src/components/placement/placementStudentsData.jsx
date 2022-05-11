import { Container, Grid, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { LocalizationProvider, DatePicker } from "@mui/lab";

import {
  setFromDate,
  setNoOfRows,
  setStage,
  setStudentData,
  setToDate,
  setPageNo,
  fetchStudents,
} from "../../store/slices/studentSlice";

const baseURL = import.meta.env.VITE_API_URL;

const PlacementStudentsData = () => {
  const { loggedInUser } = useSelector((state) => state.auth);
  const { isFetching } = useSelector((state) => state.ui);
  const {
    url,
    // filterColumns,
    studentData,
    fromDate,
    toDate,
    stage,
    totalData,
    numberOfRows,
    page,
  } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const setStudents = (data) => dispatch(setStudentData(data));
  const setFrom = (data) => dispatch(setFromDate(data));
  const setTo = (data) => dispatch(setToDate(data));
  const setRows = (data) => dispatch(setNoOfRows(data));
  const setPage = (data) => dispatch(setPageNo(data));
  const updateStage = (data) => dispatch(setStage(data));

  const [canView, setCanView] = React.useState({
    access: null, //access object to store who are having access data
    // userLoggedIn: user(), //user object to store who is logged in
    studentDashboardCondition: false, //condition to show student dashboard})
  });

  const fetchAccess = async (signal) => {
    // setState({ ...state, loading: true });
    fetchingStart();
    try {
      const accessUrl = `${baseURL}rolebaseaccess`;
      axios.get(accessUrl, { signal }).then((response) => {
        const studentDashboardData = response.data; //variable to store the response
        const conditions = //variable to store the conditions
          studentDashboardData &&
          loggedInUser &&
          loggedInUser.email &&
          studentDashboardData.students &&
          studentDashboardData.students.view &&
          studentDashboardData.students.view.includes(loggedInUser.email);
        setCanView((prevState) => ({
          ...prevState,
          access: studentDashboardData || null, //set access to state
          studentDashboardCondition: conditions,
          // loading: false,
        }));
        fetchingFinish();
      });
    } catch (e) {
      // console.error(e);
      // setState({ ...state, loading: false });
      fetchingFinish();
    }
  };

  const changeFromDate = async (date) => {
    setFrom(date);
    // setState((prevState) => ({
    //   ...prevState,
    //   fromDate: date,
    // }));
    // fetchStudents();
  };

  const changeToDate = (date) => {
    setTo(date);
    // setState((prevState) => ({
    //   ...prevState,
    //   toDate: date,
    // }));
    // fetchStudents();
  };

  const sortChange = (column, order) => {
    // const { data } = state;
    const sorted = _.orderBy(studentData, [column], [order]);
    setStudents({ data: sorted, totalData });
    // setState((prevState) => ({
    //   ...prevState,
    //   data: sorted,
    // }));
  };

  useEffect(() => {
    // console.log("Updating changes");
    if (loggedInUser)
      dispatch(
        fetchStudents({
          fetchPendingInterviewDetails: false,
          dataType: "softwareCourse",
        })
      );
  }, [url, fromDate, toDate, stage, page, numberOfRows, loggedInUser]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAccess(controller.signal);
  }, [loggedInUser]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4} style={{ marginBottom: "0.8rem" }}>
        <Grid item xs={6} md={6} lg={3} sx={{ marginTop: "0.8rem" }}>
          <LocalizationProvider dateAdapter={DateFnsUtils}>
            <DatePicker
              margin="dense"
              style={{ marginLeft: 16, maxWidth: "40%" }}
              value={fromDate}
              id="date-picker-dialog"
              label="From Date"
              format="MM/dd/yyyy"
              onChange={changeFromDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              renderInput={(params) => (
                <TextField fullWidth size="small" {...params} />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} md={6} lg={3} sx={{ marginTop: "0.8rem" }}>
          <LocalizationProvider dateAdapter={DateFnsUtils}>
            <DatePicker
              margin="dense"
              style={{ marginLeft: 16, maxWidth: "40%" }}
              value={toDate}
              id="date-picker-dialog"
              label="To Date"
              format="MM/dd/yyyy"
              onChange={changeToDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              renderInput={(params) => (
                <TextField fullWidth size="small" {...params} />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlacementStudentsData;
