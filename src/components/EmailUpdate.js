import React from "react";
import EditableLabel from "react-inline-editing";
import axios from "axios";
import { withSnackbar } from "notistack";
// const _ = require("underscore");

const baseUrl = process.env.API_URL;

export class EmailUpdate extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUpdate = (email) => {
    const { rowMetatable } = this.props;
    const studentId = rowMetatable.rowData[0];
    console.log(email);
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { email })
      .then(() => {
        console.log("Success");
        this.props.enqueueSnackbar("Email updated successfully!", {
          variant: "success",
        });
      })
      .catch(() => {
        console.log("Failed");
        this.props.enqueueSnackbar("Couldn't update email!", {
          variant: "error",
        });
      });
  };

  render = () => {
    const { email } = this.props;
    return (
      <EditableLabel
        text={email}
        labelFontWeight="bold"
        inputFontWeight="bold"
        inputHeight="25px"
        onFocusOut={(email) => this.handleUpdate(email)}
      />
    );
  };
}

export default withSnackbar(EmailUpdate);
