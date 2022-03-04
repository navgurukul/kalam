import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

const OwnerSelect = (props) => {
  const snackbar = useSnackbar();

  const handleChange = (selectedValue) => {
    try {
      const { change, rowMetaTable, studentId } = props;
      const { value } = selectedValue;
      const { columnIndex, rowData } = rowMetaTable;
      const whoAssign = JSON.parse(localStorage.getItem("user")).email;
      const stage = rowData[0];
      axios
        .post(`${baseUrl}students/assign_feedback_work`, {
          who_assign: whoAssign,
          to_assign: value,
          student_stage: stage,
          student_id: studentId,
        })
        .then(() => {
          snackbar.enqueueSnackbar(`successfully Assigned work for ${value}`, {
            variant: "success",
          });
          change(value, columnIndex);
        });
    } catch (e) {
      snackbar.enqueueSnackbar(e, { variant: "error" });
    }
  };
  const { value } = props;
  const allUserOptions = JSON.parse(localStorage.getItem("owners")).map((x) => {
    return { label: x, value: x };
  });
  let selectedValue = { value: null, label: null };

  if (value) {
    selectedValue = { value: value, label: value };
  }

  return (
    <Select
      className={"filterSelectStage"}
      value={selectedValue}
      onChange={handleChange}
      options={allUserOptions}
      // placeholder={"Select "+ props.filter.name+" ..."}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect={true}
    />
  );
};

export default OwnerSelect;
