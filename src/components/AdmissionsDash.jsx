import "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { makeStyles, ThemeProvider } from "@mui/styles";
import Select from "react-select";
import { useParams } from "react-router-dom";

import axios from "axios";
import Box from "@mui/material/Box";
import makeAnimated from "react-select/animated";
import { Container, TextField, Typography } from "@mui/material";
import _ from "lodash";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import { changeFetching, setupUsers } from "../store/slices/authSlice";
import StudentService from "../services/StudentService";
import ServerSidePagination from "./ServerSidePagination";
import theme from "../theme";
import user from "../utils/user";
import NotHaveAccess from "./NotHaveAccess";
import Loader from "./Loader";

const { qualificationKeys, allStages } = require("../config");

const animatedComponents = makeAnimated();
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = import.meta.env.VITE_API_URL;

let allStagesOptions = Object.keys(allStages).map((x) => ({
  value: x,
  label: allStages[x],
}));
allStagesOptions = [
  {
    value: "default",
    label: "All",
  },
  ...allStagesOptions,
];

const useStyles = makeStyles(() => ({
  clear: {
    clear: "both",
  },
}));

const AdmissionsDash = (props) => {
  const classes = useStyles();
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { dataTypes } = useParams();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const usersSetup = (users) => dispatch(setupUsers(users));
  const [state, setState] = React.useState({
    totalData: 0,
    data: [],
    sData: undefined, //subsetData,
    fromDate: null,
    toDate: null,
    showLoader: true,
    filterValues: [],
    numberOfRows: 10,
    selectedOption: [],
    access: null, //access object to store who are having access data
    userLoggedIn: user(), //user object to store who is logged in
    studentDashboardCondition: false, //condition to show student dashboard
    loading: true,
  });
  let dataType = dataTypes || "softwareCourse";
  const studentsURL = `${baseURL}students`;
  const usersURL = `${baseURL}users/getall`;
  let stage = null;
  let value = null;

  const fetchAccess = async (signal) => {
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
        setState((prevState) => ({
          ...prevState,
          access: studentDashboardData || null, //set access to state
          studentDashboardCondition: conditions,
          loading: false,
        }));
      });
    } catch (e) {
      // console.error(e);
    }
  };

  const fetchOWner = async (signal) => {
    const response = await axios.get(`${baseURL}owner`, { signal });
    const newData = response.data.data.map((e) => e.user.mail_id);
    localStorage.setItem("owners", JSON.stringify(newData.sort()));
  };

  const fetchPartner = async (signal) => {
    const response = await axios.get(`${baseURL}partners`, { signal });
    const newData = response.data.data.map((e) => e.name);
    localStorage.setItem("partners", JSON.stringify(newData.sort()));
  };
  const fetchUsers = async (signal) => {
    try {
      fetchingStart();
      const response = await axios.get(usersURL, { signal });
      usersSetup(response.data.data);
      const newData = response.data.data.map((data) => data.user);
      localStorage.setItem("users", JSON.stringify(newData));
      fetchingFinish();
    } catch (e) {
      // console.error(e);
      fetchingFinish();
    }
  };
  const dataSetup = (data, totalData) => {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        // eslint-disable-next-line import/no-named-as-default-member, no-param-reassign
        data[i] = StudentService.dConvert(data[i]);
      }
      const newData = data.map((v) => ({
        ...v,
        loggedInUser: loggedInUser.email.split("@")[0],
      }));
      setState((prevState) => ({
        ...prevState,
        data: newData,
        showLoader: true,
        totalData: totalData || state.totalData,
      }));
      fetchingFinish();
    } else {
      setState((prevState) => ({
        ...prevState,
        data,
        showLoader: false,
      }));
    }
  };
  const fetchStudents = async (_value, signal) => {
    const { fetchPendingInterviewDetails, loggedInUser: pLoggedInUser } = props;
    const { numberOfRows } = state;
    const concatinateStage = stage === null ? stage : stage.join(",");
    try {
      fetchingStart();
      let response;
      if (fetchPendingInterviewDetails) {
        response = await axios.get(`${baseURL}students/pending_interview`, {
          signal,
          params: {
            user: pLoggedInUser.mailId,
          },
        });
      } else {
        let url = studentsURL;
        if (_value)
          _value.forEach((filterColumn, index) => {
            if (index > 0) {
              url += `&${filterColumn.key}=${filterColumn.value}`;
            } else {
              url += `?${filterColumn.key}=${filterColumn.value}`;
            }
          });
        response =
          value && value.length > 0
            ? await axios.get(`${url}&limit=${numberOfRows}&page=0`, {
                signal,
                params: {
                  dataType,
                  stage: concatinateStage,
                  from: state.fromDate,
                  to: state.toDate,
                },
              })
            : await axios.get(`${studentsURL}?limit=${numberOfRows}&page=0`, {
                signal,
                params: {
                  dataType,
                  stage: concatinateStage,
                  from: state.fromDate,
                  to: state.toDate,
                },
              });
      }

      const studentData = response.data.data.results.map((student) => {
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
      setState((prevState) => ({
        ...prevState,
        totalData: response.data.data.total,
      }));
      dataSetup(studentData);
    } catch (e) {
      fetchingFinish();
    }
  };

  const setNumbersOfRows = (_value) => {
    setState((prevState) => ({
      ...prevState,
      numberOfRows: _value,
    }));
  };

  const getFilterValues = (_value) => {
    setState((prevState) => ({ ...prevState, filterValues: _value }));
  };

  // const stageChangeEvent = (iData) => {
  //   let dataElem = state.data[iData.rowId];
  //   // dataElem.stageTitle = iData.selectedValue.label;
  //   dataElem.stage = iData.selectedValue.value;

  //   let newData = state.data;
  //   newData[iData.rowId] = dataElem;

  //   setState((prevState) => ({ ...prevState, data: newData }));
  // };

  const changeDataType = (option) => {
    dataType = option.value;
    stage = null;
    value = null;
    fetchStudents();
  };

  const changeStudentStage = (selectedOption) => {
    setState((prevState) => ({
      ...prevState,
      selectedOption,
    }));
    //console.log(selectedOption, "selectedOption");
    const { filterValues } = state;
    if (selectedOption === null) {
      stage = null;
      dataType = "softwareCourse";
      fetchStudents(filterValues);
      value = "Student Details";
    } else {
      // const arr = [];
      const arr = selectedOption.map((option) => option.value);
      //console.log(arr, " i am arr");
      if (arr.includes("default")) {
        stage = null;
      } else {
        stage = selectedOption.map((option) => option.value);
      }

      fetchStudents(filterValues);
      dataType = "softwareCourse";
    }
  };

  const changeFromDate = async (date) => {
    setState((prevState) => ({
      ...prevState,
      fromDate: date,
    }));
    fetchStudents();
  };

  const changeToDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      toDate: date,
    }));
    fetchStudents();
  };

  const sortChange = (column, order) => {
    const { data } = state;
    const sorted = _.orderBy(data, [column], [order]);
    setState((prevState) => ({
      ...prevState,
      data: sorted,
    }));
  };

  const { fetchPendingInterviewDetails } = props;
  const { sData, data, showLoader, totalData, numberOfRows, selectedOption } =
    state;
  const concatinateStage = stage === null ? stage : stage.join(",");

  useEffect(() => {
    const controller = new AbortController();
    // dispatch(rFStudents({ dataType, fetchPendingInterviewDetails }));
    const fetchData = async () => {
      await fetchStudents(null, controller.signal);
      await fetchUsers(controller.signal);
      await fetchOWner(controller.signal);
      await fetchPartner(controller.signal);
      await fetchAccess(controller.signal);
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const options = (
    <Box>
      <Select
        className="filterSelectGlobal"
        value={dataType}
        onChange={changeDataType}
        options={[
          { value: "requestCallback", label: "Request Callback" },
          { value: "softwareCourse", label: "Other Data" },
        ]}
        placeholder="Select Data Type"
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect
      />
      <Select
        className="filterSelectGlobal"
        value={selectedOption}
        isMulti
        onChange={changeStudentStage}
        options={allStagesOptions}
        placeholder="Get Student Details By Stage"
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect
      />
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <DatePicker
          margin="dense"
          style={{ marginLeft: 16, maxWidth: "40%" }}
          value={state.fromDate}
          id="date-picker-dialog"
          label="From Date"
          format="MM/dd/yyyy"
          onChange={changeFromDate}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <DatePicker
          margin="dense"
          style={{ marginLeft: 16, maxWidth: "40%" }}
          value={state.toDate}
          id="date-picker-dialog"
          label="To Date"
          format="MM/dd/yyyy"
          onChange={changeToDate}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );

  if (fetchPendingInterviewDetails) {
    return (
      <ServerSidePagination
        columns={StudentService.columns[dataType]}
        data={sData || data}
        showLoader={showLoader}
        params={{
          params: {
            dataType,
            stage: concatinateStage,
            from: state.fromDate,
            to: state.toDate,
          },
        }}
        dataSetup={dataSetup}
        totalData={totalData}
        filterValues={getFilterValues}
        sortChange={sortChange}
        numberOfRows={numberOfRows}
        setNumbersOfRows={setNumbersOfRows}
      />
    );
  }
  return (
    <div>
      {state.studentDashboardCondition ? (
        <Box>
          <ThemeProvider theme={theme}>
            {fetchPendingInterviewDetails ? null : options}
            <div className={classes.clear} />
            <ServerSidePagination
              columns={StudentService.columns[dataType]}
              data={sData || data}
              showLoader={showLoader}
              fun={fetchStudents}
              params={{
                params: {
                  dataType,
                  stage: concatinateStage,
                  from: state.fromDate,
                  to: state.toDate,
                },
              }}
              stages={value}
              dataSetup={dataSetup}
              totalData={totalData}
              filterValues={getFilterValues}
              sortChange={sortChange}
              numberOfRows={numberOfRows}
              setNumbersOfRows={setNumbersOfRows}
            />
          </ThemeProvider>
        </Box>
      ) : state.loading ? (
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "4rem",
          }}
        >
          <Typography variant="h3" style={{ marginBottom: "2.4rem" }}>
            Loading
          </Typography>
          <Loader />
        </Container>
      ) : (
        <NotHaveAccess />
      )}
    </div>
  );
};

export default AdmissionsDash;
