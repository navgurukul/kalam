import React from "react";
import EasyEdit from 'react-easy-edit';
import axios from "axios";
import { withSnackbar } from "notistack";
// const _ = require("underscore");

const baseUrl = process.env.API_URL;

export class EmailUpdate extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUpdate = (email) => {
    const { rowMetatable, change } = this.props;
    const studentId = rowMetatable.rowData[0];
    const columnIndex = rowMetatable.columnIndex;
    console.log(email);
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { email })
      .then(() => {
        console.log("Success");
        this.props.enqueueSnackbar("Email updated successfully!", {
          variant: "success",
        });
        console.log(label, columnIndex);
        change(label, columnIndex);
      })
      .catch(() => {
        console.log("Failed");
        this.props.enqueueSnackbar("Couldn't update email!", {
          variant: "error",
        });
      });
  };

  render = () => {
    return (
      <EasyEdit
      type="text"
      value={this.props.email}
      onSave={(email) => this.handleUpdate(email)}
      saveButtonLabel="✔"
      cancelButtonLabel="✖"
    />
    );
  };
}

export default withSnackbar(EmailUpdate);
