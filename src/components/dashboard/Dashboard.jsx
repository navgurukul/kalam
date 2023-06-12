import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import MUIDataTable from "mui-datatables";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

import { useLocation } from "react-router-dom";
import Select from "react-select";
import {
  setAllStudentData,
  setCounts,
  setStageFilter as setStageFilterAction,
  setFromDate as setFromDateAction,
  setToDate as setToDateAction,
  setStudentData,
  clearData,
} from "../../store/slices/campusSlice";
import MainLayout from "../muiTables/MainLayout";

import { changeFetching } from "../../store/slices/uiSlice";

import {
  qualificationKeys,
  campusStageOfLearning,
  allStages,
  campusStatusOptions,
  campusStatusDisplayOptions,
} from "../../utils/constants";
import { dConvert } from "../../utils";

const allStagesOptions = Object.entries(campusStageOfLearning).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const partnerStages = Object.entries(allStages).map(([value, label]) => ({
  value,
  label,
}));

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

const DashboardPage = ({ displayData, title, url, isCampus = false }) => {
  const location = useLocation();
  const { students, allStudents, fromDate, toDate, allStatusCount } =
    useSelector((state) => state.campus);

  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  const setStageFilter = (filterSt) => dispatch(setStageFilterAction(filterSt));
  // const setToStage = (to) => dispatch(setToStageAction(to));
  const setFromDate = (from) =>
    dispatch(setFromDateAction(dayjs(from).format("YYYY-MM-DD")));
  const setToDate = (to) =>
    dispatch(setToDateAction(dayjs(to).format("YYYY-MM-DD")));
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const setStudents = (studentData) => dispatch(setStudentData(studentData));
  const setAllStudents = (studentData) =>
    dispatch(setAllStudentData(studentData));

  const clearStudents = () => dispatch(clearData());

  const [loading, setLoading] = React.useState(true);

  const dataSetup = (studentData) => {
    if (isCampus) {
      const countObject = campusStatusDisplayOptions.reduce(
        (allCounts, key) => ({ ...allCounts, [key]: 0 }),
        { total: 0 }
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
      counts.total = studentData.length;
      setCampusCounts(counts);
    }

    const sData = studentData.map((data) => {
      return dConvert(data, isCampus);
    });

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

  const filterData = (filterLabel) => {
    const newData = allStudents.filter(
      (element) => element.stage === filterLabel
    );
    setStudents(newData);
  };
  const onChangeStageFilter = async (event) => {
    setStageFilter(event);

    filterData(event.label);
  };

  const locationCampus = location.pathname.split("/")[1];

  const showAllStage = parseInt(
    location.pathname[location.pathname.length - 1],
    10
  );

  const onDownload = (buildHead, buildBody, downloadColumns, data) => {
    const newData = data.map(({ data: student }) => ({
      data: student.map((col, inx) => {
        switch (displayData[inx]?.name || "DEFAULT") {
          case "enrolmentKey":
            return {
              onlineTest: "Online Test",
              offlineTest: "Offline Test",
              "N/A": "N/A",
            }[col[col.length - 1].type_of_test];
          default:
            return col;
        }
      }),
    }));

    return `\uFEFF${buildHead(downloadColumns)}${buildBody(newData)}`;
  };

  const noFooter = React.useCallback(() => <tbody />, []);

  const options = (
    <Grid container spacing={4} sx={{ paddingY: "0.8rem" }}>
      <Grid item xs={12} md={6} lg={3}>
        <Select
          onChange={onChangeStageFilter}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="Filter Stage"
          isClearable
          closeMenuOnSelect
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
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
      <Grid item xs={12} md={6} lg={3}>
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
              <TextField size="small" fullWidth {...params} />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  const options2 = allStudents.length > 0 && (
    <Grid container spacing={3} sx={{ paddingY: "0.8rem" }}>
      <Grid
        item
        container
        xs={12}
        md={6}
        lg={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Select
          onChange={onChangeStageFilter}
          options={showAllStage ? partnerStages : allStagesOptions}
          placeholder="Filter Stage"
          isClearable
          closeMenuOnSelect
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        />
      </Grid>

      {/* <Grid item xs={12} md={12} lg={6}>
        <MUIDataTable
          columns={Object.keys(allStatusCount).map((statusKey) => ({
            name: statusKey,
            label: campusStatusOptions[statusKey]?.label ?? "Total",
            options: {
              display: campusStatusOptions[statusKey]?.display ?? true,
            },
          }))}
          title="Campus Counts"
          data={[allStatusCount]}
          options={{
            customFooter: noFooter,
            filter: false,
            sort: false,
            showTitle: false,
            viewColumns: true,
            print: false,
            search: false,
            selectableRows: "none",
            toolbar: false,
          }}
        />
      </Grid> */}
    </Grid>
  );
  return (
    <Box sx={{ paddingX: "1.2rem", paddingY: "0.2rem" }}>
      {locationCampus === "campus" ? options2 : options}
      <MainLayout
        tableBodyMaxHeight="56vh"
        title={title}
        columns={[...displayData, ...columns]}
        onDownload={onDownload}
        data={students}
        showLoader={loading}
        options={options}
      />
    </Box>
  );
};
export default DashboardPage;
