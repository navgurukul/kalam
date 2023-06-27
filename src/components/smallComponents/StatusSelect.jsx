import React, { useEffect, useState } from "react";
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
  // const [studentData, setStudentData] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const studentId = window.location.pathname.includes("/campus")
    ? rowMetaTable.rowData[7]
    : rowMetaTable.rowData[5];

  const handleChange = (selectedValue) => {
    const { columnIndex } = rowMetaTable;
    const stage = rowMetaTable.rowData[0];
    const { value } = selectedValue;
    console.log("stage", stage);
    console.log("value", value);

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

  // useEffect(() => {
  //   axios
  //     .get(`${baseUrl}students/${studentId}`)
  //     .then((res) => {
  //       setStudentData(res.data.data[0]);
  //       console.log("res", res);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // }, []);

  // console.log(
  //   "studentData",
  //   studentData?.school && studentData?.school[0].name
  // );

  const stage = rowMetaTable.rowData[0];

  // const allstatus =
  //   studentData?.school &&
  //   studentData?.school[0].name.toLowerCase() ===
  //     "School of Programming".toLowerCase()
  //     ? feedbackableStagesData[stage].status
  //     : ["Pass", "Fail"];

  const allstatus = feedbackableStagesData[stage].status;
  // || [
  //   "Passsss",
  //   "Failllll",
  // ];

  // const allstatus = feedbackableStagesData[stage].status;

  const allStatusOptions = allstatus.map((x) => ({
    value: x,
    label: x.charAt(0).toUpperCase() + x.slice(1),
  }));

  console.log("allStatusOptions", allStatusOptions);

  const selectedValue = { value: null, label: null };
  if (state) {
    const lable = state.charAt(0).toUpperCase() + state.slice(1);
    selectedValue.value = state;
    selectedValue.label = lable;
  }

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
