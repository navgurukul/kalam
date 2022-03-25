import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.API_URL;
const animatedComponents = makeAnimated();

const UpdateDonorOrCampus = ({ change, rowMetatable, allOptions, value }) => {
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event) => {
    // eslint-disable-next-line camelcase
    const student_id = rowMetatable.rowData[0];
    const field = rowMetatable.columnData.name;
    const { value: evValue } = event;
    const data = {};
    data[field] = evValue;
    axios
      // eslint-disable-next-line camelcase
      .put(`${baseURL}students/${student_id}`, data)
      .then(() => {
        enqueueSnackbar(
          `${field[0].toUpperCase() + field.slice(1)} successfully updated !`,
          {
            variant: "success",
          }
        );
        change(value);
      })
      .catch(() => {
        enqueueSnackbar(
          `Error in updating ${field[0].toUpperCase() + field.slice(1)}`,
          {
            variant: "unsuccess!",
          }
        );
      });
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

export default UpdateDonorOrCampus;
