import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

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
  const { name } = props;
  return (
    <EasyEdit
      type="text"
      value={name}
      onSave={(newName) => handleUpdate(newName)}
      saveButtonLabel="✔"
      cancelButtonLabel="✖"
    />
  );
};

export default UpdateStudentName;
