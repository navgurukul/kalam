import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";
// const _ = require("underscore");

const baseUrl = import.meta.env.API_URL;

const UpdateEmail = (props) => {
  const { email } = props;
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (newEmail) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    // const columnIndex = rowMetatable.columnIndex;
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { newEmail })
      .then(() => {
        //console.log("Success");
        enqueueSnackbar("Email updated successfully!", {
          variant: "success",
        });
        // #TODO this.props.change goes unused
        change(newEmail);
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
        value={email}
        onSave={(_email) => handleUpdate(_email)}
        saveButtonLabel="✔"
        cancelButtonLabel="✖"
        validationMessage="Please Provide Valid Email"
        onValidate={(_email) => {
          const isValidEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if (email && isValidEmail.test(_email)) {
            return true;
          }
          return false;
        }}
        disableAutoCancel
      />
    </div>
  );
};

export default UpdateEmail;
