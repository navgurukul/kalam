import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { debounce } from "lodash";

import SearchIcon from "@material-ui/icons/Search";

export default class Text extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
    this.handleSearchText = debounce(this.onSearchText, 500);
  }
  onChange = (event) => {
    this.setState({
      name: event.target.value,
    });
    this.handleSearchText(this.state.name);
  };
  onSearchText = (input) => {
    return this.props.searchByName(input);
  };

  render() {
    const { name } = this.state;
    return (
      <TextField
        error={false}
        id="standard-basic"
        label="Search Name"
        value={name}
        onChange={this.onChange}
      />
    );
  }
}
