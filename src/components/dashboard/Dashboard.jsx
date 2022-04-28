import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import axios from "axios";

import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useSnackbar } from "notistack";
import { setStudentData } from "../../store/slices/studentSlice";
import MainLayout from "../muiTables/MainLayout";

import StudentService from "../../services/StudentService";

// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";

import {
  qualificationKeys,
  campusStageOfLearning,
  allStages,
} from "../../utils/constants";
import EventEmitter from "../../utils/eventEmitter";

const allStagesOptions = Object.keys(campusStageOfLearning).map((x) => ({
  value: x,
  label: campusStageOfLearning[x],
}));

const partnerStages = Object.keys(allStages).map((x) => ({
  value: x,
  label: allStages[x],
}));

const allStagesValue = Object.values(allStages);
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseUrl = import.meta.env.VITE_API_URL;

const columns = [
  {
    label: "English Interview Pending (2nd Round)",
    name: "pendingEnglishInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "English Interview Failed",
    name: "englishInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Algebra Interview Pending (3rd Round)",
    name: "pendingAlgebraInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Algebra Interview Failed",
    name: "algebraInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Culture Fit Interview Pending (4th Round)",
    name: "pendingCultureFitInterview",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Culture Interview Failed",
    name: "cultureFitInterviewFail",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Selected",
    name: "selected",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Offer Letter Sent",
    name: "offerLetterSent",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
  {
    label: "Unreachable",
    name: "notReachable",
    options: {
      viewColumns: false,
      display: false,
      filter: false,
    },
  },
];
// let filterFns = [];

const DashboardPage = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const { studentData: data } = useSelector((state) => state.students);
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const getStudentsData = (studentData) =>
    dispatch(setStudentData(studentData));
  const [state, setState] = React.useState({
    mainData: [],
    wholeData: [],
    fromDate: null,
    toDate: null,
    showLoader: true,
    fromStage: null,
    toStage: null,
    dropoutCount: null,
    onLeaveCount: null,
    inCampusCount: null,
  });

  const stageChangeEvent = (iData) => {
    const rowIds = data.map((x) => x.id);
    const rowIndex = rowIds.indexOf(iData.rowData.id);

    const dataElem = data[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    const newData = data;
    newData[rowIndex] = dataElem;
    getStudentsData(newData);
  };

  EventEmitter.subscribe("stageChange", stageChangeEvent);

  const fetchUsers = async () => {
    try {
      fetchingStart();
      const usersURL = `${baseUrl}users/getall`;
      const response = await axios.get(usersURL, {});
      // usersSetup(response.data.data);
      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };

  const dataSetup = (studentData) => {
    const locationCampus = location.pathname.split("/")[1];

    let countDropOut = 0;
    let countOnLeave = 0;
    let countInCampus = 0;
    if (locationCampus === "campus") {
      if (studentData.length > 0) {
        studentData.forEach((e) => {
          if (e.stage === "droppedOut") {
            countDropOut += 1;
          } else if (e.stage === "onLeave") {
            countOnLeave += 1;
          } else if (
            e.stage !== "M22" ||
            e.stage !== "M21" ||
            e.stage !== "offerLetterSent" ||
            e.stage !== "inJob" ||
            e.stage !== "payingForward" ||
            e.stage !== "paidForward"
          ) {
            countInCampus += 1;
          }
        });
      }
    }

    for (let i = 0; i < studentData.length; i += 1) {
      // eslint-disable-next-line no-param-reassign, import/no-named-as-default-member
      studentData[i] = StudentService.dConvert(studentData[i]);
    }
    getStudentsData(studentData);

    setState((prevState) => ({
      ...prevState,
      mainData: studentData,
      wholeData: studentData,
      showLoader: false,
      dropoutCount: countDropOut,
      onLeaveCount: countOnLeave,
      inCampusCount: countInCampus,
    }));
    fetchingFinish();
  };

  const fetchStudents = async () => {
    try {
      fetchingStart();

      const { url } = props;
      const dataURL = baseUrl + url;
      const response = await axios.get(dataURL, {
        params: {
          from: state.fromDate,
          to: state.toDate,
        },
      });
      const obj = {};
      const studentData = response.data.data.map((student) => {
        const value = student.lastTransition
          ? student.lastTransition.to_stage
          : "other";
        const contacts = student.contacts[student.contacts.length - 1];

        if (obj[value]) {
          obj[value] += 1;
        } else {
          obj[value] = 1;
        }
        return {
          ...student,
          qualification: qualificationKeys[student.qualification],
          altNumber: contacts ? contacts.alt_mobile : contacts,
        };
      });

      if (studentData.length > 0) {
        studentData[0] = { ...studentData[0], ...obj };
      }
      dataSetup(studentData);
    } catch (e) {
      fetchingFinish();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchStudents();
      await fetchUsers();
    };
    fetchData();
  }, []);

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

  const filterData = () => {
    const { fromStage, toStage, mainData, wholeData } = state;
    getStudentsData(mainData);
    if (allStagesValue.indexOf(fromStage) <= allStagesValue.indexOf(toStage)) {
      const newAllStagesValue = allStagesValue.slice(
        allStagesValue.indexOf(fromStage),
        allStagesValue.indexOf(toStage) + 1
      );
      const newData = wholeData.filter(
        (element) => newAllStagesValue.indexOf(element.stage) > -1
      );
      getStudentsData(newData);
      setState({
        ...state,
        mainData: newData,
      });
    } else {
      getStudentsData([]);
      setState({
        ...state,
        mainData: [],
      });
      enqueueSnackbar(`Stage inputs not correct. Please check once.`, {
        variant: "error",
      });
    }
  };

  const onChangeFromStage = async (event) => {
    setState({ ...state, fromStage: event.label });
    const { fromStage, toStage } = state;
    if (fromStage && toStage) {
      filterData();
    }
  };

  const onChangeToStage = async (event) => {
    setState({ ...state, toStage: event.label });
    const { fromStage, toStage } = state;
    if (fromStage && toStage) {
      filterData();
    }
  };

  const { displayData, title } = props;
  const { dropoutCount, onLeaveCount, inCampusCount } = state;
  const locationCampus = location.pathname.split("/")[1];

  const showAllStage = parseInt(
    location.pathname[location.pathname.length - 1],
    10
  );
  const { fromStage, toStage, mainData, showLoader, wholeData } = state;

  const options = (
    <Box>
      <Select
        className="filterSelectGlobal"
        onChange={onChangeFromStage}
        options={showAllStage ? partnerStages : allStagesOptions}
        placeholder="from Stage"
        isClearable={false}
        closeMenuOnSelect
        value={fromStage}
      />
      <Select
        className="filterSelectGlobal"
        onChange={onChangeToStage}
        options={showAllStage ? partnerStages : allStagesOptions}
        placeholder="to Stage"
        isClearable={false}
        closeMenuOnSelect
        value={toStage}
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

  const options2 = wholeData.length > 0 && (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Select
        className="filterSelectGlobal"
        onChange={onChangeFromStage}
        options={showAllStage ? partnerStages : allStagesOptions}
        placeholder="from Stage"
        isClearable={false}
        closeMenuOnSelect
      />
      <Select
        className="filterSelectGlobal"
        onChange={onChangeToStage}
        options={showAllStage ? partnerStages : allStagesOptions}
        placeholder="to Stage"
        isClearable={false}
        closeMenuOnSelect
      />

      {locationCampus === "campus" ? (
        <span
          style={{
            fontSize: "17px",
            padding: "8px 10px",
            border: "1px solid #B3B3B3",

            fontFamily: "Times New Roman",
            marginLeft: "15px",
            borderRadius: "4px",
            marginTop: "16px",
          }}
        >
          <span style={{}}>InCampus : {inCampusCount}</span>
          <span> OnLeave : {onLeaveCount}</span>
          <span> DropOut : {dropoutCount} </span>
        </span>
      ) : null}
    </div>
  );
  return (
    <div>
      {locationCampus === "campus" ? options2 : options}
      <MainLayout
        title={title}
        columns={[...displayData, ...columns]}
        data={mainData}
        showLoader={showLoader}
      />
    </div>
  );
};

export default DashboardPage;
