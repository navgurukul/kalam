/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Container, Grid, TextField, Typography } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import EasyEdit from "react-easy-edit";
import _ from "lodash";

import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { useSnackbar } from "notistack";

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

const EditText = ({ label, type, value, studentId, change, getJobDetails }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleUpdate = (newValue) => {
    if (newValue === "") {
      enqueueSnackbar(`${label} cannot be empty`, {
        variant: "unsuccess!",
      });
      return;
    }
    if (newValue === value) {
      change(value);
      return;
    }
    axios
      .put(`${baseURL}students/jobDetails`, {
        [label]: newValue,
        student_id: studentId,
      })
      .then(() => {
        enqueueSnackbar(`${label} successfully updated !`, {
          variant: "success",
        });
        getJobDetails();
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating ${label}`, {
          variant: "unsuccess!",
        });
        getJobDetails();
      });
    change(newValue);
  };

  return (
    <EasyEdit
      type={type}
      value={value}
      onSave={(nVal) => handleUpdate(nVal)}
      saveButtonLabel="✔"
      cancelButtonLabel="✖"
      onValidate={(value1) => value1 !== ""}
      disableAutoCancel
    />
  );
};

const PlacementStudentsData = () => {
  const { enqueueSnackbar } = useSnackbar();

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

  const getJobDetails = async () => {
    try {
      const res = await axios.get(`${baseURL}/students/jobDetails`);
      setStudents({
        data: res.data || [],
        totalData: 1,
        loader: false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [canView, setCanView] = React.useState({
    access: null, //access object to store who are having access data
    studentDashboardCondition: false, //condition to show student dashboard})
  });

  const changeJobType = (val, studentId) => {
    axios
      .put(`${baseURL}students/jobDetails`, {
        student_id: studentId,
        job_type: val,
      })
      .then(() => {
        console.log("job type updated");
        enqueueSnackbar(`Job Type successfully updated !`, {
          variant: "success",
        });
        getJobDetails();
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating Job Type`, {
          variant: "unsuccess!",
        });
      });
  };

  const columns = [
    {
      name: "student_id",
      options: {
        display: false,
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
      name: "partner",
      label: "Partner",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const partnerName = value?.name;
          return <p>{partnerName}</p>;
        }),
      },
    },
    {
      name: "campus",
      label: "Campus",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const campusName = value && value[0]?.campus;

          return <p>{campusName}</p>;
        }),
      },
    },

    {
      name: "gender", // Select Input options male,female
      label: "Gender",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const defaultValue =
            value === 1 ? "Female" : value === 2 ? "Male" : "Transgender";

          return <p>{defaultValue}</p>;
        }, []),
      },
    },
    {
      name: "contacts", // Select Input options male,female
      label: "Contact",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const contactValue = value && value[0]?.mobile;

          return <p>{contactValue}</p>;
        }, []),
      },
    },
    {
      name: "student_job_details", //Textfield
      label: "Job Designation",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const jobDesignation = value?.job_designation || "Click to edit";
          const studentId = rowMeta.rowData[0];
          return (
            <EditText
              label="job_designation"
              type="text"
              value={jobDesignation}
              change={(val) => updateValue(val)}
              studentId={studentId}
              getJobDetails={getJobDetails}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details", // Select input
      label: "Job Location",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const studentId = rowMeta.rowData[0]; //set id
          const jobLocation = value?.job_location || "Click to edit";
          // const { label } = rowMeta.columnData;
          return (
            <EditText
              label="job_location"
              type="text"
              value={jobLocation}
              change={(val) => updateValue(val)}
              studentId={studentId}
              getJobDetails={getJobDetails}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details", // Select Input options offline, WFH
      label: "Job Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const jobType = value?.job_type || null;
          const studentId = rowMeta.rowData[0];
          const jobValue =
            jobType === "Internship"
              ? {
                  value: "Internship",
                  label: "Internship",
                }
              : jobType === "Full Time"
              ? {
                  value: "Full Time",
                  label: "Full Time",
                }
              : "";
          const modes = [
            {
              value: "Internship",
              label: "Internship",
            },
            {
              value: "Full Time",
              label: "Full Time",
            },
          ];

          return (
            <Select
              variant="outlined"
              placeholder="Select Job Type"
              value={jobValue}
              options={modes}
              onChange={(e) => changeJobType(e.value, studentId)}
              styles={{
                menuList: (base) => ({
                  ...base,
                  position: "fixed !important",
                  backgroundColor: "white",
                  border: "1px solid lightgray",
                  width: "18%",
                }),
              }}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details", // Textfield no. input
      label: "Salary",
      options: {
        filter: false,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const studentId = rowMeta.rowData[0]; //set id
          // eslint-disable-next-line camelcase
          const salary = value?.salary || "N/A";

          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              ₹
              <EditText
                label="salary"
                type="text"
                value={`${salary}`}
                change={(val) => updateValue(val)}
                studentId={studentId}
                getJobDetails={getJobDetails}
              />
              &nbsp;/month
            </div>
          );
        }, []),
        // customBodyRender: (value) => `${value} `,
      },
    },
    {
      name: "student_job_details", //Textfield
      label: "Employer",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const employer = value?.employer || "Click to edit";
          const studentId = rowMeta.rowData[0]; //set id

          return (
            <EditText
              label="employer"
              type="text"
              value={employer}
              change={(val) => updateValue(val)}
              studentId={studentId}
              getJobDetails={getJobDetails}
            />
          );
        }, []),
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
    // if (loggedInUser)
    // dispatch(
    //   fetchStudents({
    //     fetchPendingInterviewDetails: false,
    //     dataType: "softwareCourse",
    //   })
    // );
  }, [url, fromDate, toDate, stage, page, numberOfRows, loggedInUser]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAccess(controller.signal);
  }, [loggedInUser]);

  useEffect(() => {
    getJobDetails();
  }, []);

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
            columns={columns}
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
