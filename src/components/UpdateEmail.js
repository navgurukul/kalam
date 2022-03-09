import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";
// const _ = require("underscore");

const baseUrl = process.env.API_URL;

const UpdateEmail = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (email) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    // const columnIndex = rowMetatable.columnIndex;
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { email })
      .then(() => {
        //console.log("Success");
        enqueueSnackbar("Email updated successfully!", {
          variant: "success",
        });
        // #TODO this.props.change goes unused
        change(email);
      })
      .catch(() => {
        //console.log("Failed");
        enqueueSnackbar("Couldn't update email!", {
          variant: "error",
        });
      });
  };

  return (
    <div>
      <EasyEdit
        type="text"
        value={props.email}
        onSave={(email) => handleUpdate(email)}
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

export default UpdateEmail;
