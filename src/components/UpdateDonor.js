import React, { Component } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";
import { Button } from "@material-ui/core";

const baseURL = process.env.API_URL;
const animatedComponents = makeAnimated();

class UpdateDonor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  getDonorsId = (data) => {
    let result;
    result = data.map((item) => item.value);
    return result;
  };

  updateDonor = () => {
    const { rowMetatable } = this.props;
    const data = this.getDonorsId(this.state.data);
    const student_id = rowMetatable.rowData[0];
    axios
      .put(`${baseURL}students/${student_id}`, { donor: data })
      .then((res) => {
        this.props.enqueueSnackbar(res.data.data, {
          variant: "success",
        });
      })
      .catch((err) => {
        this.props.enqueueSnackbar(`Error in updating donor}`, {
          variant: "unsuccess!",
        });
      });
  };

  handleChange = (event) => {
    const { value, change } = this.props;
    let rename = [];
    if (event) {
      rename = event.map((item) => {
        return { id: item.value, donor: item.label };
      });
    }
    if (value && event === null) {
      this.setState({ data: [] });
    } else {
      this.setState({ data: event });
    }
    change(rename);
  };

  render() {
    const { allOptions, value } = this.props;
    return (
      <div>
        <Select
          className={"filterSelectStage"}
          components={{ animatedComponents }}
          isMulti
          value={
            value
              ? value.map((x) => {
                  return { value: x.id, label: x.donor };
                })
              : value
          }
          onChange={this.handleChange}
          options={allOptions.map((x) => {
            return { value: x.id, label: x.donor };
          })}
          isClearable={false}
        ></Select>
        <Button
          color="primary"
          disabled={this.state.data ? false : true}
          onClick={this.updateDonor}
        >
          Update
        </Button>
      </div>
    );
  }
}

export default withSnackbar(UpdateDonor);
