/* eslint-disable jsx-a11y/label-has-associated-control */
import "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles, ThemeProvider } from "@mui/styles";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import Box from "@mui/material/Box";
import makeAnimated from "react-select/animated";
import { Grid, TextField } from "@mui/material";
import _ from "lodash";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import StudentService from "../../services/StudentService";
import ServerSidePagination from "../muiTables/ServerSidePagination";
import theme from "../../theme";
import ToolbarAddButton from "../admin/ToolbarAddButton";
import { fetchOwners as fetchOwnersAction } from "../../store/slices/dataSlice";
import {
  setFromDate,
  // setNoOfRows,
  setStage,
  setStudentData,
  setToDate,
  setPageNo,
  fetchStudents,
} from "../../store/slices/studentSlice";

import { allStages } from "../../utils/constants";

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
  label: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#808080",
    marginBottom: "5px",
  },
}));

const AdmissionsDash = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { dataType: paramDataType } = useParams();
  const { loggedInUser, privileges } = useSelector((state) => state.auth);
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
  // console.log(
  //   filterColumns,
  //   url,
  //   studentData,
  //   fromDate,
  //   toDate,
  //   totalData,
  //   stage,
  //   page
  // );
  const dispatch = useDispatch();
  const setStudents = (data) => dispatch(setStudentData(data));
  const setFrom = (data) => dispatch(setFromDate(data));
  const setTo = (data) => dispatch(setToDate(data));
  // const setRows = (data) => dispatch(setNoOfRows(data));
  const setPage = (data) => dispatch(setPageNo(data));
  const updateStage = (data) => dispatch(setStage(data));
  const [state, setState] = React.useState({
    // totalData: 0,
    // data: [],
    sData: undefined, //subsetData,
    // fromDate: null,
    // toDate: null,
    showLoader: true,
    // filterValues: [],
    // numberOfRows: 10,
    selectedOption: [],
    access: null, //access object to store who are having access data
    // userLoggedIn: user(), //user object to store who is logged in
    studentDashboardCondition: true, //condition to show student dashboard
    loading: true,
  });
  let dataType = paramDataType || "softwareCourse";
  // const studentsURL = `${baseURL}students`;
  const usersURL = `${baseURL}users/getall`;
  // let stage = null;
  let value = null;

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
      const response = await axios.get(usersURL, { signal });
      // usersSetup(response.data.data);
      const newData = response.data.data.map((data) => data.user);
      localStorage.setItem("users", JSON.stringify(newData));
    } catch (e) {
      // console.error(e);
    }
  };
  const dataSetup = (data, _totalData) => {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        // eslint-disable-next-line import/no-named-as-default-member, no-param-reassign
        data[i] = StudentService.dConvert(data[i]);
      }
      const newData = data.map((v) => ({
        ...v,
        loggedInUser: loggedInUser.email.split("@")[0],
      }));
      setStudents({ data: newData, _totalData });
      setState((prevState) => ({
        ...prevState,
        data: newData,
        loading: true,
        totalData: totalData || state.totalData,
      }));
    } else {
      setStudents({ data: [], totalData: 0 });
      setState((prevState) => ({
        ...prevState,
        data,
        loading: false,
      }));
    }
  };
  // const fetchStudents = async () => {
  //   const { fetchPendingInterviewDetails, loggedInUser: pLoggedInUser } = props;
  //   // const { numberOfRows } = state;
  //   const concatinateStage = stage.length === 0 ? null : stage.join(",");
  //   try {
  //     fetchingStart();
  //     let response;
  //     if (fetchPendingInterviewDetails) {
  //       response = await axios.get(`${baseURL}students/pending_interview`, {
  //         params: {
  //           user: pLoggedInUser.mailId,
  //         },
  //       });
  //     } else {
  //       let newUrl = studentsURL;
  //       if (_value)
  //         _value.forEach((filterColumn, index) => {
  //           if (index > 0) {
  //             newUrl += `&${filterColumn.key}=${filterColumn.value}`;
  //           } else {
  //             newUrl += `?${filterColumn.key}=${filterColumn.value}`;
  //           }
  //         });
  //       response =
  //         value && value.length > 0
  //           ? await axios.get(`${url}&limit=${numberOfRows}&page=0`, {
  //               params: {
  //                 dataType: dataType || "softwareCourse",
  //                 stage: concatinateStage,
  //                 from: state.fromDate,
  //                 to: state.toDate,
  //               },
  //             })
  //           : await axios.get(`${studentsURL}?limit=${numberOfRows}&page=0`, {
  //               signal,
  //               params: {
  //                 dataType,
  //                 stage: concatinateStage,
  //                 from: state.fromDate,
  //                 to: state.toDate,
  //               },
  //             });
  //     }

  //     const studentData = response.data.data.results.map((student) => {
  //       const contacts = student.contacts[student.contacts.length - 1];
  //       return {
  //         ...student,
  //         qualification: qualificationKeys[student.qualification],
  //         studentOwner: "",
  //         campus: student.campus ? student.campus : null,
  //         donor: student.studentDonor ? student.studentDonor : null,
  //         altNumber: contacts ? contacts.alt_mobile : contacts,
  //       };
  //     });
  //     setState((prevState) => ({
  //       ...prevState,
  //       totalData: response.data.data.total,
  //     }));
  //     dataSetup(studentData);
  //   } catch (e) {
  //     fetchingFinish();
  //   }
  // };

  // const setNumbersOfRows = (_value) => {
  //   setRows(value);
  //   setState((prevState) => ({
  //     ...prevState,
  //     numberOfRows: _value,
  //   }));
  // };

  // const getFilterValues = (_value) => {
  //   setState((prevState) => ({ ...prevState, filterValues: _value }));
  // };

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
    // stage = null;
    value = null;
    // fetchStudents();
  };

  const changeStudentStage = (selectedOption) => {
    setState((prevState) => ({
      ...prevState,
      selectedOption,
    }));
    //console.log(selectedOption, "selectedOption");
    if (selectedOption === null) {
      setPage(0);
      updateStage([]);
      dataType = "softwareCourse";
      // fetchStudents(filterValues);
      value = "Student Details";
    } else {
      // const arr = [];
      const arr = selectedOption.map((option) => option.value);
      //console.log(arr, " i am arr");
      if (arr.includes("default")) {
        // stage = null;
      } else {
        // stage = selectedOption.map((option) => option.value);
      }

      setPage(0);
      updateStage(selectedOption.map((opt) => opt.value));

      // fetchStudents(filterValues);
      dataType = "softwareCourse";
    }
  };

  const changeFromDate = async (date) => {
    const newDate = dayjs(date).format("MM-DD-YYYY");
    setFrom(newDate);
    // setState((prevState) => ({
    //   ...prevState,
    //   fromDate: date,
    // }));
    // fetchStudents();
  };

  const changeToDate = (date) => {
    const newDate = dayjs(date).format("MM-DD-YYYY");
    setTo(newDate);
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

  const { fetchPendingInterviewDetails } = props;
  const { sData, selectedOption } = state;

  useEffect(() => {
    const controller = new AbortController();
    // dispatch(rFStudents({ dataType, fetchPendingInterviewDetails }));

    (async () => {
      // await fetchStudents(null, controller.signal);
      await fetchUsers(controller.signal);
      await fetchOWner(controller.signal);
      await fetchPartner(controller.signal);
      // await fetchAccess(controller.signal);
      dispatch(fetchOwnersAction());
      setState({ ...state, loading: false });
    })();
    return () => {
      controller.abort();
      setStudents({ data: [], totalData: 0 });
    };
  }, []);

  useEffect(() => {
    // console.log("Updating changes");
    if (loggedInUser)
      dispatch(fetchStudents({ fetchPendingInterviewDetails, dataType })); //softwareCourse
  }, [url, fromDate, toDate, stage, page, numberOfRows, loggedInUser]);

  const options = (
    <Grid container spacing={4} style={{ marginBottom: "0.8rem" }}>
      <Grid item xs={12} md={6} lg={3}>
        <label className={classes.label}>Select Data Type</label>
        <Select
          // className="filterSelectGlobal"
          id="dataTypeSelect"
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
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <label className={classes.label}>Filter by Stage</label>
        <Select
          // className="filterSelectGlobal"
          id="stageSelect"
          value={selectedOption}
          isMulti
          onChange={changeStudentStage}
          options={allStagesOptions}
          placeholder="Get Student Details By Stage"
          isClearable={false}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          // components={animatedComponents}
          closeMenuOnSelect
        />
      </Grid>
      <Grid item xs={6} md={6} lg={3} sx={{ marginTop: "0.8rem" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
  );

  const { loading } = state;

  const tableOptions = {
    selectableRows: "none",
    responsive: "vertical",
    customToolbar: React.useCallback(
      () => <ToolbarAddButton handleOpen={() => navigate("/students/add")} />,
      []
    ),
  };

  if (fetchPendingInterviewDetails) {
    return (
      <ServerSidePagination
        defaultColumns={StudentService.columns[dataType]}
        data={sData || studentData}
        showLoader={loading}
        params={{
          params: {
            dataType,
            stage: stage.length === 0 ? null : stage.join(","),
            from: fromDate,
            to: toDate,
          },
        }}
        dataSetup={dataSetup}
        sortChange={sortChange}
      />
    );
  }
  const newColumns = [...StudentService.columns[[dataType]]];
  newColumns[1].options.viewColumns = privileges.some(
    (priv) => priv.privilege === "DeleteStudent"
  );

  return (
    <Box sx={{ paddingX: "1.2rem", paddingY: "0.4rem" }}>
      <ThemeProvider theme={theme}>
        {fetchPendingInterviewDetails ? null : options}
        <div className={classes.clear} />
        <ServerSidePagination
          defaultColumns={StudentService.columns[dataType]}
          data={sData || studentData}
          showLoader={loading}
          // fun={fetchStudents}
          params={{
            params: {
              dataType,
              stage: stage.length === 0 ? null : stage.join(","),
              from: fromDate,
              to: toDate,
            },
          }}
          stages={value}
          sortChange={sortChange}
          customOptions={
            privileges.some((priv) => priv.privilege === "AddNewStudent")
              ? tableOptions
              : {}
          }
        />
      </ThemeProvider>
    </Box>
  );
};

export default AdmissionsDash;
