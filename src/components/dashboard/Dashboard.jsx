import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import axios from "axios";

import { useLocation } from "react-router-dom";
import Select from "react-select";
import { useSnackbar } from "notistack";
import {
  setAllStudentData,
  setCounts,
  setFromStage as setFromStageAction,
  setToStage as setToStageAction,
  setFromDate as setFromDateAction,
  setToDate as setToDateAction,
  setStudentData,
  clearData,
} from "../../store/slices/campusSlice";
import MainLayout from "../muiTables/MainLayout";

// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";

import {
  qualificationKeys,
  campusStageOfLearning,
  allStages,
  campusStatusOptions,
  campusStatusDisplayOptions,
} from "../../utils/constants";
import EventEmitter from "../../utils/eventEmitter";
import { dConvert } from "../../utils";

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

const DashboardPage = ({ displayData, title, url, isCampus }) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const {
    students,
    allStudents,
    fromDate,
    toDate,
    fromStage,
    toStage,
    inCampusCount,
    dropoutCount,
    onLeaveCount,
  } = useSelector((state) => state.campus);

  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  const setFromStage = (from) => dispatch(setFromStageAction(from));
  const setToStage = (to) => dispatch(setToStageAction(to));
  const setFromDate = (from) => dispatch(setFromDateAction(from));
  const setToDate = (to) => dispatch(setToDateAction(to));
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const setStudents = (studentData) => dispatch(setStudentData(studentData));
  const setAllStudents = (studentData) =>
    dispatch(setAllStudentData(studentData));

  const clearStudents = () => dispatch(clearData());

  const [loading, setLoading] = React.useState(true);

  const stageChangeEvent = (iData) => {
    const rowIds = students.map((x) => x.id);
    const rowIndex = rowIds.indexOf(iData.rowData.id);

    const dataElem = students[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    const newData = [...students];
    newData[rowIndex] = dataElem;
    setStudents(newData);
  };

  EventEmitter.subscribe("stageChange", stageChangeEvent);
  const dataSetup = (studentData) => {
    if (isCampus) {
      const countObject = campusStatusDisplayOptions.reduce(
        (allCounts, key) => ({ ...allCounts, [key]: 0 }),
        {}
      );
      const counts = studentData.reduce((allCounts, student) => {
        if (
          student.stage.campus_status &&
          campusStatusDisplayOptions.includes(student.stage.campus_status)
        )
          // eslint-disable-next-line no-param-reassign
          allCounts[student.stage.campus_status] += 1;
        return allCounts;
      }, countObject);
      // setCampusCounts({
      //   dropoutCount: countDropOut,
      //   onLeaveCount: countOnLeave,
      //   inCampusCount: countInCampus,
      // });
    }

    const sData = studentData.map((data) => dConvert(data, isCampus));

    setStudents(sData);
    setAllStudents(sData);

    setLoading(false);
  };

  const fetchStudents = async (signal) => {
    try {
      const dataURL = baseUrl + url;
      const response = await axios.get(dataURL, {
        signal,
        params: {
          from: fromDate,
          to: toDate,
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
          donor: student.studentDonor ? student.studentDonor : null,
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
    const controller = new AbortController();
    (async () => {
      await fetchStudents(controller.signal);
    })();
    return () => {
      controller.abort();
      setStudents([]);
      clearStudents();
    };
  }, []);

  const changeFromDate = async (date) => {
    setFromDate(date);
    fetchStudents();
  };

  const changeToDate = (date) => {
    setToDate(date);
    fetchStudents();
  };

  const filterData = () => {
    // setStudents(mainData);
    if (allStagesValue.indexOf(fromStage) <= allStagesValue.indexOf(toStage)) {
      const newAllStagesValue = allStagesValue.slice(
        allStagesValue.indexOf(fromStage),
        allStagesValue.indexOf(toStage) + 1
      );
      const newData = allStudents.filter(
        (element) => newAllStagesValue.indexOf(element.stage) > -1
      );
      setStudents(newData);
    } else {
      setStudents([]);
      enqueueSnackbar(`Stage inputs not correct. Please check once.`, {
        variant: "error",
      });
    }
  };

  const onChangeFromStage = async (event) => {
    setFromStage(event.label);
    if (fromStage && toStage) {
      filterData();
    }
  };

  const onChangeToStage = async (event) => {
    setToStage(event.label);
    if (fromStage && toStage) {
      filterData();
    }
  };

  // const { dropoutCount, onLeaveCount, inCampusCount } = state;
  const locationCampus = location.pathname.split("/")[1];

  const showAllStage = parseInt(
    location.pathname[location.pathname.length - 1],
    10
  );

  const options = (
    <Grid container spacing={4} sx={{ paddingY: "0.8rem" }}>
      <Grid item xs={12} md={6} lg={3}>
        <Select
          // className="filterSelectGlobal"
          onChange={onChangeFromStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="From Stage"
          isClearable={false}
          closeMenuOnSelect
          value={fromStage}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Select
          // className="filterSelectGlobal"
          onChange={onChangeToStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="To Stage"
          isClearable={false}
          closeMenuOnSelect
          value={toStage}
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
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
      <Grid item xs={12} md={6} lg={3}>
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
              <TextField size="small" fullWidth {...params} />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  const options2 = allStudents.length > 0 && (
    <Grid container spacing={4} sx={{ paddingY: "0.8rem" }}>
      <Grid item xs={12} md={6} lg={3}>
        <Select
          onChange={onChangeFromStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="From Stage"
          isClearable={false}
          closeMenuOnSelect
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Select
          onChange={onChangeToStage}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="To Stage"
          isClearable={false}
          closeMenuOnSelect
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={6} xl={6}>
        <Paper
          sx={{
            fontSize: "17px",
            padding: "0.4rem 0.8rem",
            fontFamily: "Times New Roman",
            display: "flex",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <Typography fontWeight="semibold" variant="h6">
            InCampus : {inCampusCount}
          </Typography>
          <Divider
            orientation="vertical"
            variant="fullWidth"
            flexItem
            sx={{
              borderRightWidth: 1,
              borderColor: "black",
            }}
          />
          <Typography fontWeight="normal" variant="h6">
            {" "}
            OnLeave : {onLeaveCount}
          </Typography>
          <Divider
            orientation="vertical"
            variant="fullWidth"
            flexItem
            sx={{
              borderRightWidth: 1,
              borderColor: "black",
            }}
          />
          <Typography fontWeight="semibold" variant="h6">
            DropOut : {dropoutCount}{" "}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
  return (
    <Box sx={{ paddingX: "1.2rem", paddingY: "0.2rem" }}>
      {locationCampus === "campus" ? options2 : options}
      <MainLayout
        tableBodyMaxHeight="56vh"
        title={title}
        columns={[...displayData, ...columns]}
        data={students}
        showLoader={loading}
      />
    </Box>
  );
};

DashboardPage.defaultProps = {
  isCampus: false,
};

export default DashboardPage;
