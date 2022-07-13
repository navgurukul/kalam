import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { DialogTitle, DialogActions, Dialog, Button } from "@mui/material";
import { useSelector } from "react-redux";
import * as _ from "underscore";
import { nextStage } from "../../services/GlobalService";
// eslint-disable-next-line import/no-cycle
import StudentService from "../../services/StudentService";
import { getColumnIndex } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const StageSelect = (props) => {
  const { allStages, stage } = props;
  const { enqueueSnackbar } = useSnackbar();
  const isCampusPathname = window.location.pathname.indexOf("campus");
  const { loggedInUser } = useSelector((state) => state.auth);
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

  const [stagess, setStages] = React.useState({
    currentStage: "",
    nextStage: "",
  });

  const getTransitionStage = (studentId) => {
    axios
      .get(`${baseUrl}students/transitions/${studentId}`)
      .then((res) => {
        const { data } = res;

        const beforeStage = data.data[data.data.length - 1].from_stage;
        const afterStage = data.data[data.data.length - 1].to_stage;

        const beforeStageValue = allStages[beforeStage];
        const afterStageValue = allStages[afterStage];

        setStages({
          currentStage: beforeStageValue,
          nextStage: afterStageValue,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getPartnerEmail = async (studentId) => {
    const response = await axios.get(
      `${baseUrl}partners/studentId/${studentId}`
    );
    const { data } = response.data;
    // eslint-disable-next-line no-nested-ternary
    return data?.email || "";
  };

  const changeStage = (selectedValue) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    const { columnIndex } = rowMetatable;
    const { value, label } = selectedValue;
    axios
      .post(`${baseUrl}students/chnageStage/${studentId}`, {
        stage: value,
        transition_done_by: loggedInUser.user_name,
      })
      .then(() => {
        enqueueSnackbar("stage is successfully changed!", {
          variant: "success",
        });
        change(label, columnIndex);
        getTransitionStage(studentId);
      })
      .catch(() => {
        enqueueSnackbar("Something is wrong with previous stage!", {
          variant: "error",
        });
      });
  };

  const handleChange = async (selectedValue) => {
    const { value } = selectedValue;
    const { rowMetatable } = props;

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
    axios
      .post(
        `https://connect.merakilearn.org/api/offerLetter/admissions`,
        state.payload
      )
      .then(() => {
        enqueueSnackbar(
          `Joining letter  successfully sent to ${state.payload.name} at ${state.payload.receiverEmail} email id`,
          {
            variant: "success",
          }
        );
        setState({
          ...state,
          flag: false,
        });
        changeStage({
          label: "Offer Letter Sent",
          value: "offerLetterSent",
        });
      })
      .catch(() => {
        enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
  };

  const handleClose = (e, clickaway) => {
    if (clickaway) return;
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
  // console.log(stage, getKeyByValue(allStages, stage));
  let allStagesOptions = [
    {
      value: "enrolmentKeyGenerated",
      label: allStages.enrolmentKeyGenerated,
    },
  ]; //90923

  // if (stage === "Dropped Out") {
  //   const { rowMetatable } = props;
  //   selectedValue = {
  //     value: _.invert(allStages)[stagess.currentStage],
  //     label: stagess.currentStage,
  //   };
  // }
  if (stage) {
    allStagesOptions = nextStage[getKeyByValue(allStages, stage)].map((x) => ({
      value: x,
      label: allStages[x],
    }));
  }

  let selectedValue = { value: "invalid", label: "Invalid Stage" };

  if (stage)
    selectedValue = { value: _.invert(allStages)[stage], label: stage };

  useEffect(() => {
    const { rowMetatable } = props;
    getTransitionStage(rowMetatable.rowData[0]);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isCampusPathname > -1 && (
        <Button>
          {stage === "Dropped Out"
            ? "Dropped Out"
            : stage === "On Leave"
            ? "On Leave"
            : "Present"}
        </Button>
      )}
      <Select
        className="filterSelectStage"
        // defaultValue={selectedValue}
        value={
          selectedValue && selectedValue.label === "Dropped Out"
            ? {
                value: stagess.currentStage,
                label: stagess.currentStage,
              }
            : selectedValue.label === "On Leave"
            ? {
                value: stagess.currentStage,
                label: stagess.currentStage,
              }
            : selectedValue
        }
        onChange={handleChange}
        options={allStagesOptions}
        // placeholder={"Select "+props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect
      />
      <Dialog
        open={flag}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {" "}
          Do you want to send Joining letter ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            NO
          </Button>
          <Button onClick={sendOfferLetter} color="primary">
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StageSelect;
