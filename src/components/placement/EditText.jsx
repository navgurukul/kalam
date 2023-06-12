import React from "react";
import EasyEdit from "react-easy-edit";
import { useSnackbar } from "notistack";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const EditText = ({ name, label, type, value, id, studentId, change }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdate = (newValue) => {
    if (newValue === "") {
      enqueueSnackbar(`${name} cannot be empty`, {
        variant: "error",
      });
      return;
    }
    if (newValue === value) {
      return;
    }
    axios
      .put(`${baseUrl}students/jobDetails/${id}`, {
        [name]: newValue,
        student_id: studentId,
      })
      .then(() => {
        enqueueSnackbar(`${label} successfully updated !`, {
          variant: "success",
        });
        change({ [name]: newValue });
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating ${label}`, {
          variant: "error",
        });
      });
  };

  return (
    <EasyEdit
      type={type}
      placeholder="Click to Add"
      value={value}
      onSave={(nVal) => handleUpdate(nVal)}
      saveButtonLabel="✔"
      cancelButtonLabel="✖"
      onValidate={(value1) => value1 !== ""}
      disableAutoCancel
    />
  );
};

export default EditText;
