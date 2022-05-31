import React from "react";
import EasyEdit from "react-easy-edit";
import { useSnackbar } from "notistack";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const EditText = ({ name, type, value, studentId, change }) => {
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
      .put(`${baseUrl}students/jobDetails`, {
        [name]: newValue,
        student_id: studentId,
      })
      .then(() => {
        enqueueSnackbar(`${name} successfully updated !`, {
          variant: "success",
        });
        change({ [name]: newValue });
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating ${name}`, {
          variant: "error",
        });
      });
  };

  return (
    <EasyEdit
      type={type}
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
