import React, { useEffect } from "react";
import { Avatar, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";

import {
  setFromDate,
  // setNoOfRows,
  // setStage,
  // setPageNo,
  setStudentData,
  setToDate,
  fetchStudents,
} from "../../store/slices/studentSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import ServerSidePagination from "../muiTables/ServerSidePagination";
import NotHaveAccess from "../layout/NotHaveAccess";
import Loader from "../ui/Loader";

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
  // const setRows = (data) => dispatch(setNoOfRows(data));
  // const setPage = (data) => dispatch(setPageNo(data));
  // const updateStage = (data) => dispatch(setStage(data));

  const [canView, setCanView] = React.useState({
    access: null, //access object to store who are having access data
    studentDashboardCondition: false, //condition to show student dashboard})
  });

  const columns = [
    {
      label: "Profile Image",
      name: "image_url",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback(
          (value, rowMeta) =>
            value !== null ? (
              <Avatar
                src={value}
                alt={rowMeta.rowData[1]}
                style={{
                  width: "60px",
                  height: "60px",
                  // borderRadius: "50%",
                  // objectFit: "cover",
                }}
              />
            ) : (
              <p> </p>
            ),
          []
        ),
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "designation", //Textfield
      label: "Job Designation",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "location", // Select input
      label: "Job Location",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "salary", // Textfield no. input
      label: "Salary/Stipend",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "mode", // Select Input options offline, WFH
      label: "Job Mode",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "employer", //Textfield
      label: "Employer",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

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
      {canView ? (
        <>
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
          <ServerSidePagination
            colums={columns}
            data={{}}
            showLoader={isFetching}
            sortChange={sortChange}
            params={{
              dataType: "softwareCourse",
              stage: "inJob",
              from: fromDate,
              to: toDate,
            }}
          />
        </>
      ) : isFetching ? (
        <>
          <Typography variant="h3" style={{ marginBottom: "2.4rem" }}>
            Loading
          </Typography>
          <Loader />
        </>
      ) : (
        <NotHaveAccess />
      )}
    </Container>
  );
};

export default PlacementStudentsData;
