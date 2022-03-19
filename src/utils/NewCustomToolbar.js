import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Fragment } from "react";

const NewCustomToolbar = ({ handleOpen }) => {
  //BaseURL
  return (
    <React.Fragment>
      <Tooltip title={"custom icon"}>
        <IconButton>
          <Fragment>
            <Box onClick={handleOpen}>
              <AddIcon />
            </Box>
          </Fragment>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default NewCustomToolbar;
