import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";

const baseURL = process.env.API_URL;
const animatedComponents = makeAnimated();

const UpdateDonorOrCampus = ({
  change,
  rowMetatable,
  allOptions,
  value,
  enqueueSnackbar,
}) => {
  const handleChange = (event) => {
    const student_id = rowMetatable.rowData[0];
    const field = rowMetatable.columnData.name;
    const { value } = event;
    const data = {};
    data[field] = value;
    axios
      .put(`${baseURL}students/${student_id}`, data)
      .then((res) => {
        enqueueSnackbar(
          `${field[0].toUpperCase() + field.slice(1)} successfully updated !`,
          {
            variant: "success",
          }
        );
        change(value);
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error in updating ${field[0].toUpperCase() + field.slice(1)}`,
          {
            variant: "unsuccess!",
          }
        );
      });
  };

  const selectedValue = { value: value, label: value };

  return (
    <div>
      <Select
        className={"filterSelectStage"}
        value={selectedValue}
        onChange={handleChange}
        options={allOptions.map((x) => {
          return { value: x, label: x };
        })}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
      />
    </div>
  );
};

export default withSnackbar(UpdateDonorOrCampus);
