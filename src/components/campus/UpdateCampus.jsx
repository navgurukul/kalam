import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdateCampus = ({ change, studentId, value, allOptions }) => {
  const { enqueueSnackbar } = useSnackbar();

  const campus =
    typeof value === "string"
      ? value
      : value.length > 0
      ? value[0]?.campus
      : "No Campus Assigned";

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

  const selectedValue = { value: campus, label: campus };

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={[...allOptions, { name: "No Campus Assigned" }].map((x) => ({
        value: x.campus,
        label: x.campus,
      }))}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdateCampus;
