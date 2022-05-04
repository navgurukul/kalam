import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const StatusSelect = (props) => {
  const snackbar = useSnackbar();

  const handleChange = (selectedValue) => {
    try {
      const { change, rowMetaTable } = props;
      let studentId;
      if (window.location.pathname.includes("/campus"))
        // eslint-disable-next-line prefer-destructuring
        studentId = rowMetaTable.rowData[7];
      // eslint-disable-next-line prefer-destructuring
      else studentId = rowMetaTable.rowData[5];

      const { columnIndex } = rowMetaTable;
      const stage = rowMetaTable.rowData[0];
      const { value } = selectedValue;
      const dataURL = `${baseUrl}students/feedback/${studentId}`;
      axios
        .put(dataURL, { student_stage: stage, state: value })
        .then(() => {
          snackbar.enqueueSnackbar("state is successfully changed!", {
            variant: "success",
          });
          change(value, columnIndex);
        })
        .catch(() => {
          snackbar.enqueueSnackbar(
            "Please fill feedback first and try again!",
            { variant: "error" }
          );
        });
    } catch (e) {
      snackbar.enqueueSnackbar(e, { variant: "error" });
    }
  };

  const { state, feedbackableStagesData, rowMetaTable } = props;
  const stage = rowMetaTable.rowData[0];

  const allstatus = feedbackableStagesData[stage].status;
  const allStatusOptions = allstatus.map((x) => ({
    value: x,
    label: x.charAt(0).toUpperCase() + x.slice(1),
  }));

  const selectedValue = { value: null, label: null };
  if (state) {
    const lable = state.charAt(0).toUpperCase() + state.slice(1);
    selectedValue.value = state;
    selectedValue.label = lable;
  }

  return (
    <Select
      className="filterSelectStage"
      // defaultValue={selectedValue}
      value={selectedValue}
      onChange={handleChange}
      options={allStatusOptions}
      // placeholder={"Select "+props.filter.name+" ..."}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default StatusSelect;
