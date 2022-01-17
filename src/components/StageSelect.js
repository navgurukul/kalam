import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";
import { DialogTitle, DialogActions, Dialog, Button } from "@material-ui/core";
const _ = require("underscore");
const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class StageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      payload: {
        receiverEmail: "",
        name: "",
        campus: "",
        cc: "",
      },
    };
  }

  handleChange = async (selectedValue) => {
    const { value } = selectedValue;
    const { rowMetatable } = this.props;
    const email = rowMetatable.rowData[9];
    const name = rowMetatable.rowData[2];
    const campus = rowMetatable.rowData[24];

    if (value === "offerLetterSent" && campus && name && email) {
      this.setState({
        flag: true,
        payload: {
          receiverEmail: email,
          name: name,
          campus: campus,
          cc: await this.getPartnerEmail(rowMetatable.rowData[0]),
        },
      });
    } else if (value !== "offerLetterSent") {
      this.changeStage(selectedValue);
    } else {
      this.props.enqueueSnackbar("Please update email or campus!", {
        variant: "error",
      });
    }
  };

  changeStage = (selectedValue) => {
    const { rowMetatable, change } = this.props;
    const studentId = rowMetatable.rowData[0];
    const columnIndex = rowMetatable.columnIndex;
    const { value, label } = selectedValue;
    axios
      .post(`${baseUrl}students/chnageStage/${studentId}`, { stage: value })
      .then(() => {
        this.props.enqueueSnackbar("stage is successfully changed!", {
          variant: "success",
        });
        change(label, columnIndex);
      })
      .catch(() => {
        this.props.enqueueSnackbar("Something is wrong with previous stage!", {
          variant: "error",
        });
      });
  };

  getPartnerEmail = async (studentId) => {
    const response = await axios.get(
      `${baseUrl}partners/studentId/${studentId}`
    );
    const data = response.data.data;
    return data ? (data.email ? data.email : "") : "";
  };

  sendOfferLetter = () => {
    axios
      .post(
        `https://connect.merakilearn.org/api/offerLetter/admissions`,
        this.state.payload
      )
      .then(() => {
        this.props.enqueueSnackbar(
          `Joining letter  successfully sent to ${this.state.payload.name} at ${this.state.payload.receiverEmail} email id`,
          {
            variant: "success",
          }
        );
        this.setState({
          flag: false,
        });
        this.changeStage({
          label: "Offer Letter Sent",
          value: "offerLetterSent",
        });
      })
      .catch(() => {
        this.props.enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
  };

  handleClose = () => {
    this.setState({
      flag: false,
    });
  };

  render = () => {
    const { allStages, stage } = this.props;
    const { flag } = this.state;
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
          onChange={this.handleChange}
          options={allStagesOptions}
          // placeholder={"Select "+this.props.filter.name+" ..."}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
        <Dialog
          open={flag}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {" "}
            Do you want to send Joining letter ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              NO
            </Button>
            <Button onClick={this.sendOfferLetter} color="primary">
              YES
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

export default withSnackbar(StageSelect);
