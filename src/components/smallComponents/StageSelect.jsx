import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { HalfCircleSpinner } from "react-epic-spinners";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  Select as MUISelect,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "underscore";
// eslint-disable-next-line import/no-cycle
import StudentService from "../../services/StudentService";
import { getColumnIndex } from "../../utils";
import {
  campusStatusDisplayOptions,
  campusStatusOptions,
  nextStage,
} from "../../utils/constants";
import { setCounts } from "../../store/slices/campusSlice";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

function getSchoolId(currentSchool, allSchools) {
  if (typeof currentSchool === "string") {
    for (const item of allSchools) {
      if (item.name === currentSchool) {
        return item.id;
      }
    }
  } else if (currentSchool instanceof Array) {
    if (currentSchool.length === 0) return -1;
    return currentSchool[0].id;
  }
  return -1;
}

function findStageByName(stageName, stages) {
  let current;
  stages.forEach((stage) => {
    if (stageName === stage.label) {
      current = stage;
      return stage;
    }
  });
  return current;
}

const StageSelect = ({ allStages, stage, rowMetatable, change, isCampus }) => {
  const { enqueueSnackbar } = useSnackbar();
  // const isCampusPathname = window.location.pathname.indexOf("campus");
  const dispatch = useDispatch();
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const { loggedInUser } = useSelector((state) => state.auth);
  const { allStatusCount } = useSelector((state) => state.campus);
  // const { allStatusCount } = useSelector((state) => state.students);
  // const refreshTable = (data) => dispatch(fetchStudents(data));
  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);
  const [state, setState] = React.useState({
    flag: false,
    payload: {
      receiverEmail: "",
      name: "",
      campus: "",
      cc: "",
    },
  });

  /*Stages for schools other than School of Programming */
  const [schoolStages, setSchoolStages] = React.useState([]);
  const [studentData, setStudentData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const toggleLoading = () => setLoading((prev) => !prev);
  const [firstStages, setFirstStages] = React.useState();
  const [allSchools, setAllSchools] = React.useState();
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    setReload(true);
    axios
      .get(`${baseUrl}school`)
      .then((res) => {
        setAllSchools(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
    const studentId = rowMetatable.rowData[0];
    axios
      .get(`${baseUrl}students/${studentId}`)
      .then((res) => {
        setStudentData(res.data.data[0]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    const studentId = rowMetatable.rowData[0];
    axios
      .get(`${baseUrl}students/${studentId}`)
      .then((res) => {
        setStudentData(res.data.data[0]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [stage]);

  const currentSchool = rowMetatable.rowData[25];
  const schoolId = getSchoolId(currentSchool, allSchools);
  const isProgrammingSchool = schoolId === 1;
  let selectedValue = { value: "invalid", label: "Invalid Stage" };

  useEffect(() => {
    // if (isProgrammingSchool || !currentSchool) return;
    console.log("currentSchool", currentSchool);
    const studentId = rowMetatable.rowData[0];

    if (isProgrammingSchool || !currentSchool) {
      setFirstStages({
        value: "enrolmentKeyGenerated",
        label: allStages.enrolmentKeyGenerated,
      });
      axios.get(`${baseUrl}students/transitions/${studentId}`).then((res) => {
        console.log("response", res.data?.data);
        const transition = res.data?.data.length > 0;
        const lastTransition =
          res.data?.data[res.data?.data.length - 1]?.to_stage;

        if (transition && lastTransition !== "enrolmentKeyGenerated") {
          axios.post(`${baseUrl}students/changeStage/${studentId}`, {
            stage: "enrolmentKeyGenerated",
            transition_done_by: loggedInUser.user_name,
          });
        }
      });
    }

    if (schoolId === -1) return;

    if (!isProgrammingSchool) {
      axios
        .get(`${baseUrl}stage/${schoolId}`)
        .then((response) => {
          // console.log("response *************", response);
          const data = response.data.map((element) => {
            const obj = { value: element.id, label: element.stageName };
            return obj;
          });

          setFirstStages({
            value: data[0]?.value,
            label: data[0]?.label,
          });

          axios
            .get(`${baseUrl}students/transitions/${studentId}`)
            .then((res) => {
              // console.log("response", res.data?.data);
              // console.log("length", res.data?.data[res.data?.data.length - 1]);
              const transition = res.data?.data.length > 0;
              const lastTransition =
                res.data?.data[res.data?.data.length - 1]?.to_stage;
              const secondLastTransition =
                res.data?.data.length > 4
                  ? res.data?.data[res.data?.data.length - 4]?.to_stage
                  : null;

              if (transition) {
                if (
                  reload &&
                  lastTransition !== response.data[0]?.stageName &&
                  secondLastTransition !== response.data[0]?.stageName
                ) {
                  // if (reload) {
                  //need to change the condition
                  axios.post(`${baseUrl}students/changeStage/${studentId}`, {
                    stage: response.data[0]?.stageName,
                    transition_done_by: loggedInUser.user_name,
                  });
                  // .then((res) => {
                  //   console.log("res-----", data[0]?.labe, res);
                  // })
                  // .catch((err) => {
                  //   console.log("err------------", data[0]?.labe, err);
                  // });
                }
              } else {
                axios.post(`${baseUrl}students/changeStage/${studentId}`, {
                  stage: response.data[0]?.stageName,
                  transition_done_by: loggedInUser.user_name,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
          setSchoolStages(data);
        })
        .catch((err) => {
          console.error("Failed Fetching School Stages ", err);
        });
    }

    // (async () => {
    //   try {
    //     const response = await axios.get(`${baseUrl}stage/${schoolId}`);

    //     const data = response.data.map((element) => {
    //       const obj = { value: element.id, label: element.stageName };
    //       return obj;
    //     });

    //     setSchoolStages(data);
    //   } catch (e) {
    //     console.error("Failed Fetching School Stages ", e);
    //   }
    // })();
  }, [currentSchool]);

  // useEffect(() => {
  //   const studentId = rowMetatable.rowData[0];
  //   axios
  //     .get(`${baseUrl}students/transitions/${studentId}`)
  //     .then((res) => {
  //       // console.log("res", res);
  //       // const { data } = res;
  //       // const beforeStage = data.data[data.data.length - 1].from_stage;
  //       // const afterStage = data.data[data.data.length - 1].to_stage;
  //       // const beforeStageValue = allStages[beforeStage];
  //       // const afterStageValue = allStages[afterStage];
  //       // setStages({
  //       //   currentStage: beforeStageValue,
  //       //   nextStage: afterStageValue,
  //       // });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);
  // const getTransitionStage = (studentId) => {
  //   axios
  //     .get(`${baseUrl}students/transitions/${studentId}`)
  //     .then((res) => {
  //       console.log('res',res)
  //       // const { data } = res;

  //       // const beforeStage = data.data[data.data.length - 1].from_stage;
  //       // const afterStage = data.data[data.data.length - 1].to_stage;

  //       // const beforeStageValue = allStages[beforeStage];
  //       // const afterStageValue = allStages[afterStage];

  //       // setStages({
  //       //   currentStage: beforeStageValue,
  //       //   nextStage: afterStageValue,
  //       // });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  const getPartnerEmail = async (studentId) => {
    const response = await axios.get(
      `${baseUrl}partners/studentId/${studentId}`
    );
    const { data } = response.data;
    return data?.email || "";
  };

  const handleCampusStatusChange = (e) => {
    const studentId = rowMetatable.rowData[0];
    const currentStatus = stage.campus_status;
    axios
      .put(`${baseUrl}students/updateDetails/${studentId}`, {
        campus_status: e.target.value,
      })
      .then(() => {
        const updatedCount = { ...allStatusCount };
        if (campusStatusDisplayOptions.includes(currentStatus))
          updatedCount[currentStatus] -= 1;
        updatedCount[e.target.value] = updatedCount[e.target.value]
          ? updatedCount[e.target.value] + 1
          : 1;
        setCampusCounts(updatedCount);
        change({ ...stage, campus_status: e.target.value });
        enqueueSnackbar("Updated Campus Status", { variant: "success" });
      })
      .catch(() => enqueueSnackbar("An Error Occurred", { variant: "error" }));
  };

  const changeStage = (selectedValue) => {
    const studentId = rowMetatable.rowData[0];
    const { value, label } = selectedValue;

    axios
      .post(`${baseUrl}students/changeStage/${studentId}`, {
        stage: isProgrammingSchool ? value : label,
        transition_done_by: loggedInUser.user_name,
      })
      .then(() => {
        enqueueSnackbar("Stage Updated!", {
          variant: "success",
        });
        change(isCampus ? { ...stage, stage: label } : label);
        // refreshTable({
        //   fetchPendingInterviewDetails: false,
        //   dataType: "softwareCourse",
        // });
        // getTransitionStage(studentId);
      })
      .catch(() => {
        enqueueSnackbar("Something is wrong with previous stage!", {
          variant: "error",
        });
      });
  };

  // useEffect(() => {
  //   setReload(true);
  // }, []);

  const handleChange = async (selectedValue) => {
    const { value } = selectedValue;

    const email =
      rowMetatable.rowData[
        getColumnIndex(StudentService.columns.softwareCourse, "email")
      ];
    const name =
      rowMetatable.rowData[
        getColumnIndex(StudentService.columns.softwareCourse, "name")
      ];
    const campus =
      rowMetatable.rowData[
        getColumnIndex(StudentService.columns.softwareCourse, "campus")
      ];

    if (value === "offerLetterSent" && campus && name && email) {
      setState({
        ...state,
        flag: true,
        payload: {
          receiverEmail: email,
          name,
          campus,
          cc: await getPartnerEmail(rowMetatable.rowData[0]),
        },
      });
    } else if (value !== "offerLetterSent") {
      changeStage(selectedValue);
    } else {
      enqueueSnackbar("Please update email or campus!", {
        variant: "error",
      });
    }
  };

  const sendOfferLetter = () => {
    const studentId = rowMetatable.rowData[0];
    toggleLoading();
    changeStage({
      label: "Offer Letter Sent",
      value: "offerLetterSent",
    });
    const offerLetter = () => {
      axios
        .post(
          `https://connect.merakilearn.org/api/offerLetter/admissions`,
          state.payload
        )
        .then((res) => {
          enqueueSnackbar(
            `Joining letter successfully sent to ${state.payload.receiverEmail}`,
            {
              variant: "success",
            }
          );
          toggleLoading();
          setState({
            ...state,
            flag: false,
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Something went wrong while sending Joining letter`, {
            variant: "error",
          });
          toggleLoading();
          setState({
            ...state,
            flag: false,
          });
        });
    };
    const sendSMS = () => {
      axios
        .post(
          `${baseUrl}/student/sendSmsWhenSendOfferLeterToStudents/${studentId}`
        )
        .then((res) => {
          enqueueSnackbar(`SMS sent successfully!`, {
            variant: "success",
          });
          setState({
            ...state,
            flag: false,
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Something went wrong while sending SMS`, {
            variant: "error",
          });
          setState({
            ...state,
            flag: false,
          });
        });
    };
    setTimeout(offerLetter, 1000);
    setTimeout(sendSMS, 5000);
  };

  const handleClose = (e, clickaway) => {
    if (clickaway) return;
    toggleLoading();
    setState({
      ...state,
      flag: false,
    });
    changeStage({
      label: "Offer Letter Sent",
      value: "offerLetterSent",
    });
  };

  const { flag } = state;

  let allStagesOptions = [
    {
      value: "enrolmentKeyGenerated",
      label: allStages.enrolmentKeyGenerated,
    },
  ];

  // if (stage === "Dropped Out") {
  //   const { rowMetatable } = props;
  //   selectedValue = {
  //     value: _.invert(allStages)[stagess.currentStage],
  //     label: stagess.currentStage,
  //   };
  // }

  if (stage) {
    allStagesOptions = (
      nextStage[
        getKeyByValue(
          allStages,
          isCampus ? stage?.stage || "enrolmentKeyGenerated" : stage
        )
      ] || []
    ).map((x) => ({
      value: x,
      label: allStages[x],
    }));
  }

  // let selectedValue = { value: "invalid", label: "Invalid Stage" };

  // useEffect(() => {
  //   console.log("schoolStages", schoolStages);
  //   selectedValue = isProgrammingSchool
  //     ? {
  //         value: studentData?.stage,
  //         label: allStages[studentData?.stage],
  //       }
  //     : {
  //         value: studentData?.school_stage_id,
  //         label: studentData?.stage,
  //       };
  // }, [currentSchool]);

  // console.log("selectedValue Above", selectedValue);
  // console.log("allStages", allStages);

  if (stage) {
    if (isProgrammingSchool) {
      selectedValue = {
        value: _.invert(allStages)[isCampus ? stage?.stage || "" : stage],
        label: isCampus ? stage?.stage || "" : stage,
      };
    } else {
      // selectedValue = {
      //   value: studentData?.student_school_stage?.id,
      //   label: studentData?.student_school_stage?.stageName,
      // };

      selectedValue = {
        value: studentData?.school_stage_id,
        label: studentData?.stage,
      };
      // if (studentData?.school[0].id === 1) {
      //   selectedValue = { value: "", label: "" };
      // } else {
      //   selectedValue = {
      //     value: studentData?.school_stage_id,
      //     label: studentData?.stage,
      //   };
      // }
    }
  } else {
    // if (isProgrammingSchool) {
    // console.log("value", studentData?.stage);
    // console.log("label", _.invert(allStages)[studentData?.stage]);
    // selectedValue = {
    //   value: studentData?.stage,
    //   label: allStages[studentData?.stage],
    // };
    // } else {

    // if (studentData?.school[0].id === 1) {
    if (isProgrammingSchool) {
      // selectedValue = { value: "", label: "" };
      selectedValue = {
        value: studentData?.stage,
        label: allStages[studentData?.stage],
      };
    } else {
      selectedValue = {
        value: studentData?.school_stage_id,
        label: studentData?.stage,
      };
    }
    // if (!isProgrammingSchool) {
    // selectedValue = {
    //   value: studentData?.school_stage_id,
    //   label: studentData?.stage,
    // };
    // }
    // }
  }

  console.log("selectedValue", selectedValue);
  console.log("studentData", studentData);
  console.log("allStages", allStages);

  // useEffect(() => getTransitionStage(rowMetatable.rowData[0]), []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {isCampus && (
        <FormControl fullWidth>
          <InputLabel>Select Campus Status</InputLabel>
          <MUISelect
            value={stage?.campus_status || "selectoption"}
            name="campusStatus"
            label="Select Campus Status"
            onChange={handleCampusStatusChange}
            fullWidth
            size="small"
          >
            <MenuItem value="selectoption" disabled>
              Select an Option
            </MenuItem>
            {Object.entries(campusStatusOptions).map(([key, status]) => (
              <MenuItem value={key} key={key}>
                {status.label}
              </MenuItem>
            ))}
          </MUISelect>
        </FormControl>
      )}
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <Typography variant="caption">
            Select {isCampus && "Academic"} Stage
          </Typography>
        </label>
        <Select
          className="filterSelectStage"
          // defaultValue={selectedValue}
          value={
            isProgrammingSchool
              ? Object.keys(allStages).find(
                  (item) => item === selectedValue.value
                )
                ? selectedValue
                : firstStages
              : schoolStages.find((item) => {
                  return item.label === selectedValue.label;
                })
              ? selectedValue
              : firstStages
          }
          // value={selectedValue}
          onChange={handleChange}
          options={isProgrammingSchool ? allStagesOptions : schoolStages}
          // placeholder={"Select "+props.filter.name+" ..."}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect
        />
      </div>
      <Dialog
        open={flag}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Do you want to send Joining letter ?
        </DialogTitle>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose} color="primary">
            NO
          </Button>
          <Button disabled={loading} onClick={sendOfferLetter} color="primary">
            {loading ? <HalfCircleSpinner size={24} color="#f05f40" /> : "YES"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

StageSelect.defaultProps = {
  isCampus: false,
};

export default StageSelect;
