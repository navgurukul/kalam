/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Container, Typography, Select, MenuItem, Chip } from "@mui/material";
// import Select from "react-select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "@mui/material/Modal";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

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
import { donor } from "../../utils/constants";
import MainLayout from "../muiTables/MainLayout";
import EditText from "./EditText";
import CustomDatePicker from "./CustomDatePicker";

const baseUrl = import.meta.env.VITE_API_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",

  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const styleForViewModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,

  justifyContent: "center",
  display: "flex",
  justifyItems: "center",
  alignItems: "center",
};

const styleForAddModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "30%",
  boxShadow: 24,
  p: 4,
  bgcolor: "background.paper",
  border: "none",
  justifyContent: "center",
  display: "flex",
  justifyItems: "center",
  alignItems: "center",
};

const PlacementStudentsData = () => {
  const snackbar = useSnackbar();
  const [documents, setDocuments] = useState({
    Resume_link: "",
  });

  const [Link, setLink] = useState({
    resumeLink: "",
  });

  const [pasteLink, setPasteLink] = useState("");

  console.log(pasteLink, "pasteLink");

  const [viewOpenResume, setViewOpenResume] = useState(false);

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
  // const setFrom = (data) => dispatch(setFromDate(data));
  // const setTo = (data) => dispatch(setToDate(data));

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

  const limitFileSize = (file) => {
    if (file.size > 1000000) {
      snackbar.enqueueSnackbar("File size should not exceed 1MB", {
        variant: "error",
      });
      return false;
    }
  };

  const addNewResume = () => {
    setDocuments({
      ...documents,
      Resume_link: "",
    });
    setLink({
      ...Link,
      resumeLink: "",
    });
  };

  const LinkGenerator = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const file = e.target.files[0];

    limitFileSize(file);
    formData.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}/students/resume/documents`, formData)
      .then((res) => {
        if (res.status === 200) {
          setLink({ ...Link, resumeLink: res.data });

          snackbar.enqueueSnackbar(
            "Link generated and pasted in the text box successfully, click on upload!",
            {
              variant: "success",
            }
          );
          // console.log(Link.idProofLink);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const convertDriveLink = (link) =>
    `https://drive.google.com/file/d/${
      link.match(/d\/([A-Za-z0-9-]+)/)[1]
    }/preview`;

  const uploadDocument = async (document, link, studentid, successMsg) => {
    axios
      .post(`${baseUrl}students/jobDetails`, {
        student_id: studentid,
        [document]: link,
      })
      .then((res) => {
        if (res.status === 200) {
          snackbar.enqueueSnackbar(successMsg, {
            variant: "success",
          });

          if (link !== "") {
            setDocuments({ ...documents, [document]: link });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const UploadResume = (e, student_id) => {
    e.preventDefault();

    const link = Link.resumeLink.includes("drive.google.com")
      ? convertDriveLink(Link.resumeLink)
      : Link.resumeLink;

    uploadDocument("resume", link, student_id, "Resume uploaded successfully");

    //   axios
    //     .post(`${baseUrl}students/uploadDocument/${studentId}`, {
    //       Resume_link: Link.resumeLink,
    //     })
    //     .then((res) => {
    //       if (res.status === 200) {
    //         snackbar.enqueueSnackbar("Resume uploaded successfully", {
    //           variant: "success",
    //         });

    //         if (Link.resumeLink !== "") {
    //           setDocuments({ ...documents, Resume_link: Link.resumeLink });
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
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
        customBodyRender: React.useCallback((value) => {
          const DOJdate = value.split("T")[0];

          return <p>{dayjs(DOJdate).format("D MMM YYYY")}</p>;
        }),
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
        customBodyRender: React.useCallback((value) => <p>B.Tech</p>),
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
            <div>
              {documents.Resume_link.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setViewOpenResume(true);
                    }}
                  >
                    View Document
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      backgroundColor: "grey",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      addNewResume();
                    }}
                  >
                    Add New
                  </Button>

                  <Modal
                    open={viewOpenResume}
                    onClose={() => {
                      setViewOpenResume(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={styleForViewModal}>
                      <embed
                        src={documents.Resume_link}
                        alt="resume"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Box>
                  </Modal>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label htmlFor="resume-input">
                    <Button
                      size="small"
                      variant="contained"
                      component="span"
                      style={{
                        width: "100%",
                        backgroundColor: "grey",
                        textAlign: "center",
                      }}
                    >
                      Generate Link
                    </Button>
                  </label>
                  <Input
                    inputProps={{ type: "file", accept: "image/*,.pdf" }}
                    id="resume-input"
                    type="file"
                    style={{
                      display: "none",
                    }}
                    onChange={(e) => {
                      LinkGenerator(e, 3);
                    }}
                  />
                  <Input
                    type="text"
                    value={pasteLink}
                    variant="outlined"
                    style={{
                      width: "100%",
                      margin: "10px 0",
                    }}
                    placeholder="Paste link here"
                    onChange={(e) => {
                      console.log("changing");
                      setPasteLink(e.target.value);
                    }}
                  />
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                    disabled={Link.resumeLink === ""}
                    onClick={(e) => {
                      UploadResume(e, studentId);
                    }}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </div>
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
    <Container maxWidth="xl">
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
    </Container>
  );
};

export default PlacementStudentsData;
