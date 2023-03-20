import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewCustomToolbar = ({ handleOpen, disabled }) => (
  //BaseURL
  <Tooltip title="Add new campuses">
    <IconButton disabled={disabled} onClick={handleOpen}>
      <AddIcon />
    </IconButton>
  </Tooltip>
);
export default NewCustomToolbar;