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
const rakmabaiBaseUrl = import.meta.env.VITE_API_RAKMABAI_URL;
const animatedComponents = makeAnimated();

function getSchoolId(currentSchool, allSchools) {
  // This function will return the school id for the current school
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

const StageSelect = ({ allStages, stage, rowMetatable, change, isCampus }) => {
  const { enqueueSnackbar } = useSnackbar();
  // const isCampusPathname = window.location.pathname.indexOf("campus");
  const dispatch = useDispatch();
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const { loggedInUser } = useSelector((state) => state.auth);
  const { allStatusCount } = useSelector((state) => state.campus);
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
  const [schoolUpdated, setSchoolUpdated] = React.useState(false);
  const [subStageList, setSubStageList] = React.useState([]);
  const [subStage, setSubStage] = React.useState([]);

  useEffect(() => {
    // In the beginning we will make an API call to get all the schools and store it in allSchools and
    // also we will make an API call to get the student data to get the school_stage_id
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
    // Whenever stage changes we will make an API call to get the student data to get the school_stage_id
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
    const studentId = rowMetatable.rowData[0];
    const schoolName = rowMetatable.rowData[25];

    if (isProgrammingSchool || !currentSchool) {
      // Maintain the first stage for programming school, when user selects programming school then
      // the stage will get updated with enrolmentKeyGenerated which is the first stage for programming school
      // and also will add to the transition
      setFirstStages({
        value: "enrolmentKeyGenerated",
        label: allStages.enrolmentKeyGenerated,
      });
      if (currentSchool && typeof currentSchool === "string") {
        axios.post(`${baseUrl}students/changeStage/${studentId}`, {
          stage: "enrolmentKeyGenerated",
          school: schoolName,
          transition_done_by: loggedInUser.user_name,
        });
        setSchoolUpdated(true);
      }
    }

    if (schoolId === -1) return;

    if (!isProgrammingSchool) {
      // Making an API call for stage/${schoolId} so that we can get the stages for the selected school
      axios
        .get(`${baseUrl}stage/${schoolId}`)
        .then((response) => {
          const data = response.data.map((element) => {
            const obj = { value: element.id, label: element.stageName };
            return obj;
          });

          // Maintain the first stage for other schools, when user selects any school then
          // the stage will get updated with that school's first stage and also will add to the transition
          setFirstStages({
            value: data[0]?.value,
            label: data[0]?.label,
          });

          if (currentSchool && typeof currentSchool === "string") {
            axios
              .post(`${baseUrl}students/changeStage/${studentId}`, {
                stage: response.data[0]?.stageName,
                school: schoolName,
                transition_done_by: loggedInUser.user_name,
              })
              .then(() => {
                // setSchoolUpdated(true);
                axios.get(`${baseUrl}students/${studentId}`).then((res) => {
                  setStudentData(res.data.data[0]);
                  selectedValue = {
                    value: null,
                    label: res.data.data[0]?.stage,
                  };
                });
              });
          }

          setSubStageList(response.data);
          setSchoolStages(data);
        })
        .catch((err) => {
          console.error("Failed Fetching School Stages ", err);
        });
    }
  }, [currentSchool]);

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
    const schoolName = rowMetatable.rowData[25][0].name;
    const { value, label } = selectedValue;

    // Updating the stage with the selected value
    axios
      .post(`${baseUrl}students/changeStage/${studentId}`, {
        // If the school is programming school then we will update the stage with the value else with the label
        stage: isProgrammingSchool ? value : label,
        school: schoolName,
        transition_done_by: loggedInUser.user_name,
      })
      .then(() => {
        enqueueSnackbar("Stage Updated!", {
          variant: "success",
        });
        change(isCampus ? { ...stage, stage: label } : label);
      })
      .catch(() => {
        enqueueSnackbar("Something is wrong with previous stage!", {
          variant: "error",
        });
      });
  };

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
        .post(`${rakmabaiBaseUrl}/offerLetter/admissions`, state.payload)
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
          // toggleLoading();
          setState({
            ...state,
            flag: false,
          });
        })
        .catch((err) => {
          enqueueSnackbar(`Something went wrong while sending SMS`, {
            variant: "error",
          });
          // toggleLoading();
          setState({
            ...state,
            flag: false,
          });
        });
    };
    // Delaying the offerLetter and sendSMS function so that the stage can get updated first
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

  if (stage) {
    allStagesOptions = (
      nextStage[
        getKeyByValue(
          allStages,
          isCampus
            ? stage?.stage || "enrolmentKeyGenerated"
            : allStages[studentData?.stage]
          // isCampus ? stage?.stage || "enrolmentKeyGenerated" : stage
        )
      ] || []
    ).map((x) => ({
      value: x,
      label: allStages[x],
    }));
  }

  if (stage) {
    // If stage is present in database then for programming school we will show the stage name from allStages
    // and for other schools from studentData

    // With isProgrammingSchool we are checking whether the school is programming school or not
    if (isProgrammingSchool) {
      // selectedValue = {
      //   value: _.invert(allStages)[isCampus ? stage?.stage || "" : stage],
      //   label: isCampus ? stage?.stage || "" : stage,
      // };
      selectedValue = {
        value: studentData?.stage,
        label:
          studentData?.stage === ""
            ? "Invalid Stage"
            : allStages[studentData?.stage],
      };
    } else {
      selectedValue = {
        value: null,
        label: studentData?.stage === "" ? "Invalid Stage" : studentData?.stage,
      };
    }
  } else {
    // If stage is not present in database then for programming school we will show the stage name
    // from allStages and studentData, and for other schools from studentData
    if (isProgrammingSchool) {
      selectedValue = {
        value: studentData?.stage,
        label:
          studentData?.stage === ""
            ? "Invalid Stage"
            : allStages[studentData?.stage],
      };
    } else {
      selectedValue = {
        value: null,
        label: studentData?.stage === "" ? "Invalid Stage" : studentData?.stage,
      };
    }
  }

  useEffect(() => {
    const selectedStage = schoolStages.some((obj) => {
      return obj.label == selectedValue.label;
    });
    const data = subStageList.filter((element) =>
      selectedStage
        ? selectedValue.label == element.stageName
        : firstStages.label == element.stageName
    );
    const subStageData = data[0]?.sub_stages.map((element) => {
      const obj = { value: null, label: element.sub_stages };
      return obj;
    });
    setSubStage(subStageData);
  }, [subStageList, currentSchool, schoolStages]);

  console.log("selectedValue", selectedValue);

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
            selectedValue.label === "Invalid Stage"
              ? selectedValue
              : isProgrammingSchool
              ? // For programming school we will show the selectedValue if the selectedValue is present in allStages
                // else we will show the firstStages
                Object.keys(allStages).find(
                  (item) => item === selectedValue.value
                )
                ? selectedValue
                : firstStages
              : // For other schools we will show the selectedValue if the selectedValue is present in the current school stages whichi is schoolStages
              // else we will show the firstStages
              schoolStages?.find((item) => {
                  return item.label === selectedValue.label;
                })
              ? selectedValue
              : firstStages
          }
          onChange={handleChange}
          options={isProgrammingSchool ? allStagesOptions : subStage}
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
