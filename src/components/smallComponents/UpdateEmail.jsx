import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const baseUrl = import.meta.env.VITE_API_URL;

const UpdateEmail = ({ email, rowMetatable, change }) => {
  const { privileges } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (newEmail) => {
    const studentId = rowMetatable.rowData[0];
    // const columnIndex = rowMetatable.columnIndex;
    axios
      .put(`${baseUrl}students/updateEmail/${studentId}`, { email: newEmail })
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

  return privileges.some((priv) => priv.privilege === "UpdateStudentEmail") ? (
    <div>
      <EasyEdit
        type="text"
        value={email}
        onSave={(newEmail) => handleUpdate(newEmail)}
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
  ) : (
    <p>{email}</p>
  );
};

export default UpdateEmail;
