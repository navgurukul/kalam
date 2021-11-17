import { Switch, Typography } from "@material-ui/core";
import React, { Component } from "react";

export default class OutreachData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false,
    };
  }
  render() {
    const { onChange } = this.props;
    return (
      <div>
        <Typography
          variant="h6"
          id="outreach-data"
          style={{
            display: "inline-block",
          }}
        >
          Outreach Data
        </Typography>

        <Switch color="primary" size="small" onChange={onChange} />
      </div>
    );
  }
}
