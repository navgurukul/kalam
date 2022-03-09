import { Switch, Typography } from "@material-ui/core";
import React from "react";

const OutreachData = (props) => {
  const { onChange } = props;
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
};

export default OutreachData;
