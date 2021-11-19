import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";
const _ = require("underscore");
const baseUrl = process.env.API_URL;
const animatedComponents = makeAnimated();

export class Evaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: {
        receiverEmail: "",
        name: "",
        campus: "",
        cc: "",
      },
    };
  }

  handleChange = async (selectedValue) => {
    const { value } = selectedValue;

    if (
      value === "Struggling" ||
      value === "Manageable" ||
      value === "Good" ||
      value === "Excellent"
    ) {
      this.changeEvaluation(selectedValue);
    } else {
      this.props.enqueueSnackbar("Not able to change Evaluation Category", {
        variant: "error",
      });
    }
  };

  changeEvaluation = (selectedValue) => {
    const { rowMetatable, change } = this.props;
    const studentId = rowMetatable.rowData[0];
    const columnIndex = rowMetatable.columnIndex;
    const { value, label } = selectedValue;
    axios
      .put(`${baseUrl}students/${studentId}`, {
        evaluation: value,
      })
      .then(() => {
        this.props.enqueueSnackbar("evaluation is successfully added!", {
          variant: "success",
        });
        change(label, columnIndex);
      })
      .catch(() => {
        this.props.enqueueSnackbar("Something went wrong!", {
          variant: "error",
        });
      });
  };

  handleClose = () => {
    this.setState({
      flag: false,
    });
  };

  render = () => {
    const { evaluationList, evaluation, rowMetatable } = this.props;

    const evaluationOptions = evaluationList.map((item) => {
      return {
        label: item,
        value: item,
      };
    });

    const selectedValue = {
      value: evaluation,
      label: evaluation,
    };

    return (
      <div>
        <Select
          className={"filterSelectStage"}
          value={selectedValue}
          onChange={this.handleChange}
          options={evaluationOptions}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
      </div>
    );
  };
}

export default withSnackbar(Evaluation);
