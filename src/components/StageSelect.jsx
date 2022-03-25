import React, { useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { DialogTitle, DialogActions, Dialog, Button } from "@mui/material";
import { useMachine } from "@xstate/react";
import { getstudentMachine } from "../services/GlobalService";

const _ = require("underscore");

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const StageSelect = (props) => {
  const { allStages, stage } = props;
  const { enqueueSnackbar } = useSnackbar();
  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);
  const studentMachine = useMemo(
    () => getstudentMachine(getKeyByValue(allStages, stage)),
    []
  );
  const [xstate, send] = useMachine(studentMachine);
  const [state, setState] = React.useState({
    flag: false,
    payload: {
      receiverEmail: "",
      name: "",
      campus: "",
      cc: "",
    },
  });

  const getPartnerEmail = async (studentId) => {
    const response = await axios.get(
      `${baseUrl}partners/studentId/${studentId}`
    );
    const { data } = response.data;
    // eslint-disable-next-line no-nested-ternary
    return data ? (data.email ? data.email : "") : "";
  };

  const changeStage = (selectedValue) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    const { columnIndex } = rowMetatable;
    const { value, label } = selectedValue;
    axios
      .post(`${baseUrl}students/chnageStage/${studentId}`, { stage: value })
      .then(() => {
        enqueueSnackbar("stage is successfully changed!", {
          variant: "success",
        });
        change(label, columnIndex);
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
    const email = rowMetatable.rowData[9];
    const name = rowMetatable.rowData[2];
    const campus = rowMetatable.rowData[24];

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
      send(selectedValue.value);
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
        send("offerLetterSent");
      })
      .catch(() => {
        enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
  };

  const handleClose = () => {
    setState({
      ...state,
      flag: false,
    });
  };

  const { flag } = state;
  const allStagesOptions = xstate.nextEvents.map((x) => ({
    value: x,
    label: allStages[x],
  }));

  const selectedValue = { value: _.invert(allStages)[stage], label: stage };
  return (
    <div>
      <Select
        className="filterSelectStage"
        // defaultValue={selectedValue}
        value={selectedValue}
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
