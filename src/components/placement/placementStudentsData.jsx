/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import { Typography, Select, MenuItem, Chip, Box } from "@mui/material";
// import Select from "react-select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import {
  // setNoOfRows,
  // setStage,
  // setPageNo,
  setStudentData,
} from "../../store/slices/studentSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import NotHaveAccess from "../layout/NotHaveAccess";
import Loader from "../ui/Loader";
import { donor, qualificationKeys } from "../../utils/constants";
import MainLayout from "../muiTables/MainLayout";
import EditText from "./EditText";
import CustomDatePicker from "./CustomDatePicker";
import UploadView from "./UploadView";

const baseUrl = import.meta.env.VITE_API_URL;

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   bgcolor: "background.paper",
//   border: "none",
//   boxShadow: 24,
//   p: 4,
// };

// const styleForAddModal = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "30%",
//   height: "30%",
//   boxShadow: 24,
//   p: 4,
//   bgcolor: "background.paper",
//   border: "none",
//   justifyContent: "center",
//   display: "flex",
//   justifyItems: "center",
//   alignItems: "center",
// };

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
    // totalData,
    numberOfRows,
    page,
  } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const setStudents = (data) => dispatch(setStudentData(data));

  const getJobDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/students/jobDetails`);
      setStudents({
        data: res.data || [],
        totalData: res.data.length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [canView, setCanView] = React.useState({
    access: null, //access object to store who are having access data
    studentDashboardCondition: false, //condition to show student dashboard})
  });

  const changeJobType = (val, studentId, change) => {
    axios
      .put(`${baseUrl}students/jobDetails`, {
        student_id: studentId,
        job_type: val,
      })
      .then(() => {
        enqueueSnackbar(`Job Type successfully updated !`, {
          variant: "success",
        });
        // getJobDetails();
        change({ job_type: val });
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating Job Type`, {
          variant: "error",
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
      name: "joinDate",
      label: "Date of Joining",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback(
          (value) => (
            <p>
              {dayjs(value).isValid()
                ? dayjs(value).format("D MMM YYYY")
                : "N/A"}
            </p>
          ),
          []
        ),
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
      name: "qualification",
      label: "Qualification",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const qualificationName = value && qualificationKeys[value];
          return <p>{qualificationName}</p>;
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
      name: "student_job_details",
      label: "Resume",
      options: {
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          // setDocuments({ ...documents, Resume_link: value?.resume || "" });
          const studentId = rowMeta.rowData[0];
          return (
            <UploadView
              label="resume"
              type="Resume"
              docLink={value?.resume}
              studentId={studentId}
              change={change}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details",
      label: "Photo Link",
      options: {
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          return (
            <UploadView
              label="photo_link"
              type="Photo Link"
              docLink={value?.photo_link}
              studentId={studentId}
              change={change}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details",
      label: "Video Link",
      options: {
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          return (
            <UploadView
              label="video_link"
              type="Video Link"
              docLink={value?.video_link}
              studentId={studentId}
              change={change}
            />
          );
        }, []),
      },
    },
    {
      name: "studentDonor",
      label: "Donor",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value) => {
          const donorList = donor.filter((donorEl) =>
            value?.donor_id?.includes(`${donorEl.id}`)
          );
          return donorList.map((donorEl) => (
            <Chip
              key={donorEl.id}
              sx={{ m: "0.4rem" }}
              variant="filled"
              label={donorEl.name}
            />
          ));
        }, []),
      },
    },

    {
      name: "gender", // Select Input options male,female
      label: "Gender",
      options: {
        display: false,
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
      name: "student_job_details", // Select Input options male,female
      label: "Date of Offer Letter",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          const offerLetterDate = value?.offer_letter_date
            ? dayjs(value.offer_letter_date)
            : null;

          return (
            <CustomDatePicker
              offerLetterDate={offerLetterDate}
              studentId={studentId}
              change={change}
            />
          );

          // return (
          // <Box sx={{ minWidth: "10rem" }}>
          //   <LocalizationProvider dateAdapter={DateFnsUtils}>
          //     <DatePicker
          //       disableFuture
          //       // margin="normal"
          //       id="offer_letter_date"
          //       label="Date of Offer Letter"
          //       value={offerLetterDate}
          //       onChange={(newValue) => {
          //         if (
          //           dayjs(newValue).diff(value.offer_letter_date, "date") ===
          //           0
          //         )
          //           return;
          //         // console.log(
          //         //   newValue,
          //         //   dayjs(newValue).diff(value.offer_letter_date, "date")
          //         // );
          //         axios
          //           .put(`${baseUrl}students/jobDetails`, {
          //             offer_letter_date: newValue,
          //             student_id: studentId,
          //           })
          //           .then(() => {
          //             enqueueSnackbar(`${name} successfully updated !`, {
          //               variant: "success",
          //             });
          //             change({ offer_letter_date: newValue });
          //           })
          //           .catch(() => {
          //             enqueueSnackbar(`Error in updating ${name}`, {
          //               variant: "error",
          //             });
          //           });
          //       }}
          //       inputFormat="dd/MM/yyyy"
          //       inputVariant="outlined"
          //       renderInput={(params) => <TextField fullWidth {...params} />}
          //       fullWidth
          //       placeholder="Date of Offer Letter"
          //     />
          //   </LocalizationProvider>
          // </Box>
          // );
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
          const jobDesignation = value?.job_designation || "Click to Add";
          const studentId = rowMeta.rowData[0];
          return (
            <EditText
              name="job_designation"
              label={rowMeta.columnData.label}
              type="text"
              value={jobDesignation}
              change={(val) => updateValue(val)}
              studentId={studentId}
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
          const jobLocation = value?.job_location || "Click to Add";
          // const { label } = rowMeta.columnData;
          return (
            <EditText
              name="job_location"
              label={rowMeta.columnData.label}
              type="text"
              value={jobLocation}
              change={(val) => updateValue(val)}
              studentId={studentId}
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
          const selectJobType = {
            value: "selectJobType",
            label: "Select Job Type",
          };
          const jobType = value?.job_type || selectJobType.value;
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
              : selectJobType;
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
              value={jobValue.value}
              // options={modes}
              onChange={(e) =>
                changeJobType(e.target.value, studentId, updateValue)
              }
              // styles={{
              //   menuList: (base) => ({
              //     ...base,
              //     position: "fixed !important",
              //     backgroundColor: "white",
              //     border: "1px solid lightgray",
              //     width: "18%",
              //   }),
              // }}
            >
              <MenuItem value={selectJobType.value} disabled>
                {selectJobType.label}
              </MenuItem>
              {modes.map((mode) => (
                <MenuItem key={mode.value} value={mode.value}>
                  {mode.label}
                </MenuItem>
              ))}
            </Select>
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
          const salaryPerMonth = value?.salary || "N/A";
          const salaryPerAnnum =
            salaryPerMonth === "N/A" ? "N/A" : salaryPerMonth * 12;

          return salaryPerAnnum === "N/A" ? (
            <EditText
              name="salary"
              label={rowMeta.columnData.label}
              type="text"
              change={(val) => updateValue(val)}
              studentId={studentId}
              // getJobDetails={getJobDetails}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                ₹
                <EditText
                  name="salary"
                  label={rowMeta.columnData.label}
                  type="text"
                  value={`${salaryPerMonth}`}
                  change={(val) => updateValue(val)}
                  studentId={studentId}
                  // getJobDetails={getJobDetails}
                />
                {/* &nbsp; */}/month
              </div>
              <div>₹{`${salaryPerAnnum}`}/annum</div>
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
          const employer = value?.employer || "Click to Add";
          const studentId = rowMeta.rowData[0]; //set id

          return (
            <EditText
              name="employer"
              label={rowMeta.columnData.label}
              type="text"
              value={employer}
              change={(val) => updateValue(val)}
              studentId={studentId}
              // getJobDetails={getJobDetails}
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
      const accessUrl = `${baseUrl}rolebaseaccess`;
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

  // const changeFromDate = async (date) => {
  //   setFrom(date);
  // };

  // const changeToDate = (date) => {
  //   setTo(date);
  // };

  // const sortChange = (column, order) => {
  //   // const { data } = state;
  //   const sorted = _.orderBy(studentData, [column], [order]);
  //   setStudents({ data: sorted, totalData });
  // };

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

    return () => {
      setStudents({ data: [], totalData: 0 });
    };
  }, []);

  return (
    <Box sx={{ paddingX: "1.2rem", paddingY: "0.4rem" }}>
      {canView ? (
        <>
          {/* <Grid container spacing={4} style={{ marginBottom: "0.8rem" }}>
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
          </Grid> */}
          <MainLayout
            title="Placement Data"
            data={studentData}
            columns={columns}
            showLoader={isFetching}
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
    </Box>
  );
};

export default PlacementStudentsData;
