import React from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewCustomToolbar = ({ handleOpen }) => (
  //BaseURL
  <Tooltip title="custom icon">
    <IconButton>
      <Box onClick={handleOpen}>
        <AddIcon />
      </Box>
    </IconButton>
  </Tooltip>
);
export default NewCustomToolbar;
