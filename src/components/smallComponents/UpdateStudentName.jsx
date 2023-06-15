import React from "react";
import EasyEdit from "react-easy-edit";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

const UpdateStudentName = ({ name, rowMetatable, change }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (newName) => {
    const studentId = rowMetatable.rowData[0];
    axios
      .put(`${baseUrl}students/${studentId}`, { name: newName })
      .then(() => {
        enqueueSnackbar("Name updated successfully!", {
          variant: "success",
        });
        change(newName);
      })
      .catch(() => {
        enqueueSnackbar("Couldn't update name !", {
          variant: "error",
        });
      });
  };
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
