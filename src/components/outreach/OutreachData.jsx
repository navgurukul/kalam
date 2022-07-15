import { Switch, Tooltip } from "@mui/material";
import React from "react";

const OutreachData = (props) => {
  const { onChange } = props;
  return (
    <Tooltip title="Toggle Outreach Data">
      <Switch color="primary" onChange={onChange} />
    </Tooltip>
  );
};

export default OutreachData;
