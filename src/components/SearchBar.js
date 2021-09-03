import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import { debounce } from "lodash";

export default class Text extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
    this.handleSearchText = debounce(this.onSearchText, 600);
  }
  onChange = async (event) => {
    await this.setState({
      name: event.target.value,
    });
    this.handleSearchText(this.state.name);
  };
  validInput = (value) => {
    if (value.match(/^[A-Za-z\s]+$/)) {
      return "letter";
    } else if (value.match(/^[0-9]+$/)) {
      return "number";
    }
  };
  onSearchText = (input) => {
    let isValidInput = this.validInput(input);
    if (input.length >= 2 && isValidInput === "letter") {
      return this.props.searchByName("searchName", input);
    } else if (input.length >= 5 && isValidInput === "number") {
      return this.props.searchByName("searchNumber", input);
    } else if (input.length === 0) {
      return this.props.searchByName();
    }
  };

  render() {
    const { name } = this.state;
    return (
      <TextField
        error={false}
        id="standard-basic"
        label="Search name or number"
        value={name}
        onChange={this.onChange}
      />
    );
  }
}
