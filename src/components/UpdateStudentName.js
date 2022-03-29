import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = process.env.API_URL;

const UpdateStudentName = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (name) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    axios
      .put(`${baseUrl}students/${studentId}`, { name })
      .then(() => {
        //console.log("Success");
        enqueueSnackbar("Name updated successfully!", {
          variant: "success",
        });
        change(name);
      })
      .catch(() => {
        //console.log("Failed");
        enqueueSnackbar("Couldn't update name !", {
          variant: "error",
        });
      });
  };
  return (
    <EasyEdit
      type="text"
      value={props.name}
      onSave={(name) => handleUpdate(name)}
      saveButtonLabel="✔"
      cancelButtonLabel="✖"
    />
  );
};

export default UpdateStudentName;
