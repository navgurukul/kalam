import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const Evaluation = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const changeEvaluation = (selectedValue) => {
    const { rowMetatable, change } = props;
    const studentId = rowMetatable.rowData[0];
    const { columnIndex } = rowMetatable;
    const { value, label } = selectedValue;
    axios
      .put(`${baseUrl}students/${studentId}`, {
        evaluation: value,
      })
      .then(() => {
        enqueueSnackbar("evaluation is successfully added!", {
          variant: "success",
        });
        change(label, columnIndex);
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong!", {
          variant: "error",
        });
      });
  };
  const handleChange = async (selectedValue) => {
    const { value } = selectedValue;
    if (value) {
      changeEvaluation(selectedValue);
    }
  };

  const { evaluation } = props;
  const evaluationList = ["Struggling", "Manageable", "Good", "Excellent"];

  const evaluationOptions = evaluationList.map((item) => ({
    label: item,
    value: item,
  }));

  const selectedValue = {
    value: evaluation,
    label: evaluation,
  };

  return (
    <div>
      <Select
        className="filterSelectStage"
        value={selectedValue}
        onChange={handleChange}
        options={evaluationOptions}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect
      />
    </div>
  );
};

export default Evaluation;
