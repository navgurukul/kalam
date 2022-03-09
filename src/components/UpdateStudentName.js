import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { withSnackbar } from "notistack";


const baseUrl = process.env.API_URL;

export class UpdateStudentName extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUpdate = (name) => {
    const { rowMetatable, change } = this.props;
    const studentId = rowMetatable.rowData[0];
    axios
      .put(`${baseUrl}students/${studentId}`, { name })
      .then(() => {
        //console.log("Success");
        this.props.enqueueSnackbar("Name updated successfully!", {
          variant: "success",
        });
        change(name);
      })
      .catch(() => {
        //console.log("Failed");
        this.props.enqueueSnackbar("Couldn't update name !", {
          variant: "error",
        });
      });
  };

  render = () => {
    return (
      <div>
        <EasyEdit
          type="text"
          value={this.props.name}
          onSave={(name) => this.handleUpdate(name)}
          saveButtonLabel="✔"
          cancelButtonLabel="✖"
        />
      </div>
    );
  };
}

export default withSnackbar(UpdateStudentName);
