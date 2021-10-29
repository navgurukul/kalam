import React, { Component } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { withSnackbar } from "notistack";

const baseURL = process.env.API_URL;
const animatedComponents = makeAnimated();

class UpdatePartner extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get(`${baseURL}partners`,{
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    }).then((response) => {
      this.setState({ data: response.data.data });
    });
  }

  handleChange = (event) => {
    const { change, studentId } = this.props;
    const { label, value } = event;
    axios
      .put(`${baseURL}students/${studentId}`, { partner_id: value })
      .then((response) => {
        console.log(response, "res");
        this.props.enqueueSnackbar(`Partner successfully updated !`, {
          variant: "success",
        });
        change(label);
      });
  };
  render() {
    const { data } = this.state;
    const { value } = this.props;
    const selectedValue = { value: value, label: value };

    return (
      <div>
        <Select
          className={"filterSelectStage"}
          value={selectedValue}
          onChange={this.handleChange}
          options={data.length > 0 && data.map((x) => {
            return { value: x.id, label: x.name };
          })}
          isClearable={false}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
      </div>
    );
  }
}

export default withSnackbar(UpdatePartner);
