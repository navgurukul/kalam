import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const StatusSelect = ({
  change,
  rowMetaTable,
  state,
  feedbackableStagesData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const studentId = window.location.pathname.includes("/campus")
    ? rowMetaTable.rowData[7]
    : rowMetaTable.rowData[5];

  const handleChange = (selectedValue) => {
    const { columnIndex } = rowMetaTable;
    const stage = rowMetaTable.rowData[0];
    const { value } = selectedValue;

    const dataURL = `${baseUrl}students/feedback/${studentId}`;
    axios
      .put(dataURL, { student_stage: stage, state: value })
      .then(() => {
        enqueueSnackbar("state is successfully changed!", {
          variant: "success",
        });
        change(value, columnIndex);
      })
      .catch((e) => {
        enqueueSnackbar(
          `Please fill feedback first and try again!${e.message}`,
          { variant: "error" }
        );
      });
  };

  const stage = rowMetaTable.rowData[0];

  // const allstatus = feedbackableStagesData[stage].status;
  const allstatus =
    stage in feedbackableStagesData
      ? feedbackableStagesData[stage].status
      : ["Pass", "Fail"];

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

  console.log("selectedValue", selectedValue);

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={allStatusOptions}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default StatusSelect;
