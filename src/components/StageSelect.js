import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { DialogTitle, DialogActions, Dialog, Button } from "@material-ui/core";
const _ = require("underscore");
const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

const StageSelect = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    flag: false,
    payload: {
      receiverEmail: "",
      name: "",
      campus: "",
      cc: "",
    },
  });

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
          name: name,
          campus: campus,
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

  const changeStage = (selectedValue) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    const columnIndex = rowMetatable.columnIndex;
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

  const getPartnerEmail = async (studentId) => {
    const response = await axios.get(
      `${baseUrl}partners/studentId/${studentId}`
    );
    const data = response.data.data;
    return data ? (data.email ? data.email : "") : "";
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

  const handleClose = () => {
    setState({
      ...state,
      flag: false,
    });
  };

  const { allStages, stage } = props;
  const { flag } = state;
  const allStagesOptions = Object.keys(allStages).map((x) => {
    return { value: x, label: allStages[x] };
  });

  const selectedValue = { value: _.invert(allStages)[stage], label: stage };
  return (
    <div>
      <Select
        className={"filterSelectStage"}
        // defaultValue={selectedValue}
        value={selectedValue}
        onChange={handleChange}
        options={allStagesOptions}
        // placeholder={"Select "+props.filter.name+" ..."}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
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
