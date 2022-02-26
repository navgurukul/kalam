import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { withSnackbar } from "notistack";
import { StageSelect } from "./StageSelect";
// const _ = require("underscore");

const baseUrl = process.env.API_URL;

export class UpdateEmail extends React.Component {
  constructor(props) {
    super(props);
  }
  handleUpdate = (email) => {
    const { rowMetatable, change } = this.props;
    const studentId = rowMetatable.rowData[0];
    // const columnIndex = rowMetatable.columnIndex;
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { email })
      .then(() => {
        //console.log("Success");
        this.props.enqueueSnackbar("Email updated successfully!", {
          variant: "success",
        });
        // #TODO this.props.change goes unused
        change(email);
      })
      .catch(() => {
        //console.log("Failed");
        this.props.enqueueSnackbar("Couldn't update email!", {
          variant: "error",
        });
      });
  };

  render = () => {
    return (
      <div>
        <EasyEdit
          type="text"
          value={this.props.email}
          onSave={(email) => this.handleUpdate(email)}
          saveButtonLabel="✔"
          cancelButtonLabel="✖"
          validationMessage="Please Provide Valid Email"
          onValidate={(email) => {
            const isValidEmail =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (email && isValidEmail.test(email)) {
              return true;
            } else {
              return false;
            }
          }}
          disableAutoCancel={true}
        />
      </div>
    );
  };
}

export default withSnackbar(UpdateEmail);
