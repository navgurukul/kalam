import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";

export default class Text extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
    };
  }
  onChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  render() {
    const { name } = this.state;
    const {searchByName} = this.props
    return (
      <TextField
      error={false}     
       id="standard-basic"
        label="Search Name"
        value={name}
        onChange={this.onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton>
                {name.length > 0 && (
                  <SearchIcon onClick={() => searchByName(name)} />
                )}{" "}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }
}
