import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewCustomToolbar = ({ handleOpen, disabled }) => (
  //BaseURL
  <Tooltip title="Admission stage">
    <IconButton disabled={disabled} onClick={handleOpen}>
      <AddIcon />
    </IconButton>
  </Tooltip>
);
export default NewCustomToolbar;