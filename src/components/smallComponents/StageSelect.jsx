import React, { useEffect } from "react";
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
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const StageSelect = ({ allStages, stage, rowMetatable, change, isCampus }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const setCampusCounts = (counts) => dispatch(setCounts(counts));
  const { loggedInUser } = useSelector((state) => state.auth);
  const { allStatusCount } = useSelector((state) => state.campus);

  const [state, setState] = React.useState({
    flag: false,
    payload: {
      receiverEmail: "",
      name: "",
      campus: "",
      cc: "",
    },
  });

  const [studentData, setStudentData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const toggleLoading = () => setLoading((prev) => !prev);

  const currentSchool = rowMetatable.rowData[25];
  const studentId = rowMetatable.rowData[0];

  const fetchStudent = () => {
    axios.get(`${baseUrl}students/${studentId}`).then((res) => {
      setStudentData(res.data.data[0]);
    });
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const getCurrentStageOptions = () => {
    if (!studentData?.stage) return [];
    const currentStageKey = isCampus
      ? getKeyByValue(allStages, stage?.stage || "enrolmentKeyGenerated")
      : studentData?.stage;
    const allowedStages = nextStage[currentStageKey] || [];
    const options = allowedStages.map((stageKey) => ({
      value: stageKey,
      label: allStages[stageKey] || stageKey,
    }));
    const currentOption = {
      value: currentStageKey,
      label: allStages[currentStageKey] || currentStageKey,
    };
    return [currentOption, ...options.filter((opt) => opt.value !== currentStageKey)];
  };

  const allStagesOptions = getCurrentStageOptions();

  const selectedValue = allStagesOptions.find(
    (option) => option.value === studentData?.stage
  ) || { value: "", label: "Select Stage" };

  const handleCampusStatusChange = (e) => {
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

  const handleChange = (e) => {
    const selectedVal = e.target.value;
    const selectedOption = allStagesOptions.find((opt) => opt.value === selectedVal);
    if (!selectedOption) return;

    const email = rowMetatable.rowData[getColumnIndex(StudentService.columns.softwareCourse, "email")];
    const name = rowMetatable.rowData[getColumnIndex(StudentService.columns.softwareCourse, "name")];
    const campus = rowMetatable.rowData[getColumnIndex(StudentService.columns.softwareCourse, "campus")];

    if (selectedVal === "offerLetterSent" && campus && name && email) {
      setState({
        ...state,
        flag: true,
        payload: { receiverEmail: email, name, campus, cc: "" },
      });
    } else {
      changeStage(selectedOption);
    }
  };

  const changeStage = (selectedValue) => {
    const schoolName = typeof currentSchool === "string"
      ? currentSchool
      : currentSchool[0]?.name || "";

    axios
      .post(`${baseUrl}students/changeStage/${studentId}`, {
        stage: selectedValue.value,
        school: schoolName,
        transition_done_by: loggedInUser.user_name,
      })
      .then(() => {
        enqueueSnackbar("Stage Updated!", { variant: "success" });
        change(isCampus ? { ...stage, stage: selectedValue.label } : selectedValue.label);
        fetchStudent(); // ✅ Update student stage immediately in UI
      })
      .catch(() => enqueueSnackbar("Something is wrong with previous stage!", { variant: "error" }));
  };

  const sendOfferLetter = () => {
    toggleLoading();
    changeStage({ label: "Offer Letter Sent", value: "offerLetterSent" });
    setTimeout(() => axios.post(`${rakmabaiBaseUrl}/offerLetter/admissions`, state.payload), 1000);
    setTimeout(() => axios.post(`${baseUrl}/student/sendSmsWhenSendOfferLeterToStudents/${studentId}`), 5000);
  };

  const handleClose = () => {
    toggleLoading();
    setState({ ...state, flag: false });
    changeStage({ label: "Offer Letter Sent", value: "offerLetterSent" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {isCampus && (
        <FormControl fullWidth>
          <InputLabel>Select Campus Status</InputLabel>
          <MUISelect
            value={stage?.campus_status || "selectoption"}
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
      <FormControl fullWidth>
        <InputLabel>Select Stage</InputLabel>
        <MUISelect
          value={selectedValue.value}
          onChange={handleChange}
          fullWidth
          size="small"
        >
          <MenuItem value="" disabled>Select Stage</MenuItem>
          {allStagesOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MUISelect>
      </FormControl>
      <Dialog open={state.flag} onClose={handleClose}>
        <DialogTitle>Do you want to send Joining letter?</DialogTitle>
        <DialogActions>
          <Button disabled={loading} onClick={handleClose}>
            NO
          </Button>
          <Button disabled={loading} onClick={sendOfferLetter}>
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
