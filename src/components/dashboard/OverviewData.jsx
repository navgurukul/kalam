import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  OutlinedInput,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import {
  setAllStudentData,
  setCounts,
  setStudentData,
  clearData,
} from "../../store/slices/campusSlice";
import MainLayout from "../muiTables/MainLayout";

import { changeFetching } from "../../store/slices/uiSlice";

import ToolbarAddButtonOverview from "./ToolbarAddButtonOverview";

import {
  qualificationKeys,
  campusStatusOptions,
  campusStatusDisplayOptions,
} from "../../utils/constants";
import { dConvert } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

const OverviewData = ({ url, isCampus = false }) => {
  const location = useLocation();
  const { allStudents, fromDate, toDate, allStatusCount } = useSelector(
    (state) => state.campus
  );

  const dispatch = useDispatch();
  const [schoolOverview, setSchoolOverview] = useState(false);
  const fetchingFinish = () => dispatch(changeFetching(false));
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const setStudents = (studentData) => dispatch(setStudentData(studentData));
  const setAllStudents = (studentData) =>
    dispatch(setAllStudentData(studentData));
  const clearStudents = () => dispatch(clearData());

  const columns = [
    {
      name: "id",
      label: "S.No",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, rowMeta) => {
          const index = rowMeta.rowIndex + 1;
          return index;
        },
      },
    },

    {
      name: "name",
      label: "School Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, rowMeta) => value,
      },
    },

    {
      name: "capacity",
      label: "Capacity of students",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, rowMeta) => value,
      },
    },
  ];

  const [schoolList, setSchoolList] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [capacity, setCapacity] = useState("");
  const pagelocation = useLocation();
  const campusId = pagelocation.pathname.split("/")[2];

  const fetchStages = async () => {
    const url = `${baseUrl}school/campus_school/${campusId}`;
    const data = await axios.get(url);
    setSchoolList(data?.data);
  };
  useEffect(() => {
    fetchStages();
  }, []);

  const handleOpenSubmit = async () => {
    if (capacity && schoolId && campusId) {
      const url = `${baseUrl}school/capacity?campus_id=${campusId}&school_id=${schoolId}`;
      const data = await axios.put(url, { capacityofschool: capacity });
    }
    setSchoolOverview(false);
    fetchStages();
  };

  const handleSelect = async () => {
    const url = `${baseUrl}school`;
    const response = await axios.get(url);
    setSchoolData(response.data);
  };

  const openSchoolOverview = () => {
    setSchoolOverview(true);
  };

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddButtonOverview handleOpen={openSchoolOverview} />,
      []
    ),
  };

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

  const locationCampus = location.pathname.split("/")[1];

  const noFooter = React.useCallback(() => <tbody />, []);

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
      />
      {/* CAMPUS COUNT */}
      <Grid item xs={12} md={12} lg={6}>
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
      </Grid>
    </Grid>
  );
  return (
    <Box sx={{ paddingX: "30rem", paddingY: "0.2rem" }}>
      {locationCampus === "campus" ? options2 : options}
      <MainLayout
        tableBodyMaxHeight="56vh"
        title="Programs offered"
        columns={columns}
        data={schoolList}
        showLoader={loading}
        options={options}
      />
      <Dialog
        fullWidth
        open={schoolOverview}
        onClose={() => setSchoolOverview(false)}
      >
        <section style={{ padding: "0rem 1rem 1rem 1rem" }}>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "24px" }}>Add School</p>
              <CloseIcon
                style={{ cursor: "pointer" }}
                onClick={() => setSchoolOverview(false)}
              />
            </div>
            <FormControl fullWidth>
              <InputLabel
                label="school add"
                variant="outlined"
                htmlFor="uncontrolled-native"
              >
                Schools
              </InputLabel>
              <NativeSelect
                defaultValue={30}
                input={<OutlinedInput label="Name" />}
                onClick={handleSelect}
                value={schoolId}
                onChange={(e) => {
                  e.preventDefault();
                  setSchoolId(e.target.value);
                }}
              >
                {schoolData.map((el) => (
                  <option value={el.id} key={el.id}>
                    {" "}
                    {el.name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <div>
              <TextField
                fullWidth
                autoFocus
                label="No of Students"
                placeholder="Enter School"
                variant="outlined"
                sx={{ mt: "2rem" }}
                value={capacity}
                onChange={(e) => {
                  e.preventDefault();
                  setCapacity(e.target.value);
                }}
              />
            </div>
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ width: "94%", padding: ".5rem" }}
              onClick={handleOpenSubmit}
            >
              Add School
            </Button>
          </DialogActions>
        </section>
      </Dialog>
    </Box>
  );
};
export default OverviewData;
