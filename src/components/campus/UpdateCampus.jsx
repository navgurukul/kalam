import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdateCampus = ({ change, studentId, allOptions, value }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event) => {
    axios
      // eslint-disable-next-line camelcase
      .put(`${baseURL}students/${studentId}`, { campus: event.value })
      .then(() => {
        enqueueSnackbar(`Campus successfully updated !`, {
          variant: "success",
        });
        change(event.value);
      })
      .catch(() =>
        enqueueSnackbar(`Error in updating Campus`, {
          variant: "error",
        })
      );
  };

  const selectedValue = { value, label: value };

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={[...allOptions, { name: "No Campus Assigned" }].map((x) => ({
        value: x.name,
        label: x.name,
      }))}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdateCampus;
