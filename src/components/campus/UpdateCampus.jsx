import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FormControl, InputLabel, Select as MUISelect, MenuItem } from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL;

const UpdateCampus = ({ change, studentId, value, allOptions }) => {
  const { enqueueSnackbar } = useSnackbar();

  const campus =
    typeof value === "string"
      ? value
      : value.length > 0
      ? value[0]?.campus
      : "No Campus Assigned";

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    axios
      .put(`${baseURL}students/${studentId}`, { campus: selectedValue })
      .then(() => {
        enqueueSnackbar(`Campus successfully updated !`, {
          variant: "success",
        });
        change(selectedValue);
      })
      .catch(() =>
        enqueueSnackbar(`Error in updating Campus`, {
          variant: "error",
        })
      );
  };

  const selectedValue = campus;

  const options = [
    ...allOptions,
    { campus: "No Campus Assigned" },
  ].map((x) => x.campus);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Select Campus</InputLabel>
      <MUISelect
        value={selectedValue}
        onChange={handleChange}
        label="Select Campus"
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
};

export default UpdateCampus;
