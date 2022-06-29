/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from "react";
import {
  Select,
  MenuItem,
  Chip,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
// import Select from "react-select";
import axios from "axios";

import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import { donor, qualificationKeys } from "../../utils/constants";
import MainLayout from "../muiTables/MainLayout";
import EditText from "./EditText";
import CustomDatePicker from "./CustomDatePicker";
import UploadView from "./UploadView";
import PlacementTransitions from "./PlacementTransitions";
import AddPlacementsEntry from "./AddPlacementsEntry";

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

  const [studentData, setStudentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStudent, setSelectedStudent] = React.useState({
    studentId: null,
    studentName: null,
  });

  const getJobDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}students/jobDetails`);
      setStudentData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const changeJobType = (val, id, studentId, change) => {
    axios
      .put(`${baseUrl}students/jobDetails/${id}`, {
        student_id: studentId,
        job_type: val,
      })
      .then(() => {
        enqueueSnackbar(`Job Type successfully updated !`, {
          variant: "success",
        });
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
      label: "Actions",
      options: {
        display: true,
        viewColumns: true,
        filter: false,
        sort: false,
        customBodyRender: React.useCallback(
          (value, { rowData, rowIndex }) => (
            <>
              {/* <AddPlacementsEntry studentId={value} studentName={rowData[1]} />
               */}
              <Tooltip title="Add New Entry" placement="top">
                <IconButton
                  onClick={() => {
                    setSelectedStudent({
                      action: "addNewEntry",
                      studentId: value,
                      studentName: rowData[1],
                      rowIndex,
                    });
                  }}
                >
                  <AddIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Transitions" placement="top">
                <IconButton
                  color="primary"
                  onClick={() => {
                    // console.log(studentData[rowIndex]);
                    setSelectedStudent({
                      action: "viewTransition",
                      studentId: value,
                      studentName: rowData[1],
                      transitions:
                        studentData[rowIndex].student_job_details_all,
                    });
                  }}
                >
                  <ChangeHistoryIcon
                    sx={{
                      transitionIcon: {
                        transform: "rotate(-180deg)",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </>
          ),
          [studentData]
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
      name: "joinDate",
      label: "Date of Joining",
      options: {
        filter: false,
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
        filter: false,
        sort: false,
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
        filter: false,
        sort: false,
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
        filter: false,
        sort: false,
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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );
          return (
            <UploadView
              label="resume"
              type="Resume"
              id={value?.id}
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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );
          return (
            <UploadView
              label="photo_link"
              type="Photo Link"
              id={value?.id}
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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );
          return (
            <UploadView
              label="video_link"
              type="Video Link"
              id={value?.id}
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
        filter: false,
        sort: false,

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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value) => {
          const defaultValue =
            value === 1 ? "Female" : value === 2 ? "Male" : "Transgender";

          return <p>{defaultValue}</p>;
        }, []),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "contacts", // Select Input options male,female
      label: "Contact",
      options: {
        filter: false,
        sort: false,
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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, change) => {
          const studentId = rowMeta.rowData[0];
          const offerLetterDate = value?.offer_letter_date
            ? dayjs(value.offer_letter_date)
            : null;

          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );

          return (
            <CustomDatePicker
              offerLetterDate={offerLetterDate}
              id={value?.id}
              studentId={studentId}
              change={change}
            />
          );
        }, []),
      },
    },
    {
      name: "student_job_details", //Textfield
      label: "Job Designation",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const jobDesignation = value?.job_designation || "Click to Add";
          const studentId = rowMeta.rowData[0];
          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );
          return (
            <EditText
              name="job_designation"
              label={rowMeta.columnData.label}
              type="text"
              id={value?.id}
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
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const studentId = rowMeta.rowData[0]; //set id
          const jobLocation = value?.job_location || "Click to Add";
          // const { label } = rowMeta.columnData;
          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );
          return (
            <EditText
              name="job_location"
              label={rowMeta.columnData.label}
              type="text"
              id={value?.id}
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
        filter: false,
        sort: false,
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

          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );

          return (
            <Select
              variant="outlined"
              placeholder="Select Job Type"
              value={jobValue.value}
              // options={modes}
              onChange={(e) =>
                changeJobType(e.target.value, value?.id, studentId, updateValue)
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
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const studentId = rowMeta.rowData[0]; //set id
          // eslint-disable-next-line camelcase
          const salaryPerMonth = value?.salary || "N/A";
          const salaryPerAnnum =
            salaryPerMonth === "N/A" ? "N/A" : salaryPerMonth * 12;

          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                {salaryPerAnnum === "N/A" ? "" : "₹"}
                <EditText
                  name="salary"
                  label={rowMeta.columnData.label}
                  type="text"
                  id={value?.id}
                  value={
                    salaryPerAnnum === "N/A"
                      ? "Click to Add"
                      : `${salaryPerMonth}`
                  }
                  change={(val) => updateValue(val)}
                  studentId={studentId}
                  // getJobDetails={getJobDetails}
                />
                {salaryPerAnnum === "N/A" ? "" : "/month"}
              </div>
              {salaryPerAnnum === "N/A" ? null : (
                <div>₹{`${salaryPerAnnum}`}/annum</div>
              )}
            </div>
          );

          // return salaryPerAnnum === "N/A" ? (
          //   <EditText
          //     name="salary"
          //     label={rowMeta.columnData.label}
          //     type="text"
          //     id={value?.id}
          //     change={(val) => updateValue(val)}
          //     studentId={studentId}
          //     // getJobDetails={getJobDetails}
          //   />
          // ) : (

          // );
        }, []),
        // customBodyRender: (value) => `${value} `,
      },
    },
    {
      name: "student_job_details", //Textfield
      label: "Employer",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta, updateValue) => {
          const employer = value?.employer || "Click to Add";
          const studentId = rowMeta.rowData[0]; //set id

          if (Object.keys(value).length === 0 || value.id === undefined)
            return (
              <div>
                Press <AddIcon fontSize="8" /> to Add New Entry
              </div>
            );

          return (
            <EditText
              name="employer"
              label={rowMeta.columnData.label}
              type="text"
              id={value?.id}
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getJobDetails();
      setLoading(false);
    })();
  }, []);

  const updateJobData = (index, jobData) => {
    const newStudentData = [...studentData];
    const newStudent = newStudentData[index];
    newStudent.student_job_details_all.push(jobData);
    newStudent.student_job_details = jobData;
    newStudentData[index] = newStudent;
    setStudentData(newStudentData);
  };

  return (
    <Box sx={{ paddingX: "1.2rem", paddingY: "0.4rem" }}>
      <MainLayout
        title="Placement Data"
        data={studentData}
        columns={columns}
        showLoader={loading}
      />
      <AddPlacementsEntry
        closeDialog={() =>
          setSelectedStudent({
            action: null,
            studentId: null,
            studentName: null,
          })
        }
        updateJobEntry={(jobData) =>
          updateJobData(selectedStudent.rowIndex, jobData)
        }
        dialogOpen={selectedStudent.action === "addNewEntry"}
        studentId={selectedStudent.studentId}
        studentName={selectedStudent.studentName}
      />
      <PlacementTransitions
        studentId={selectedStudent.studentId}
        studentTransition={selectedStudent.transitions}
        studentName={selectedStudent.studentName}
        modalOpen={selectedStudent.action === "viewTransition"}
        closeModal={() =>
          setSelectedStudent({ studentId: null, studentName: null })
        }
      />
    </Box>
  );
};

export default PlacementStudentsData;
