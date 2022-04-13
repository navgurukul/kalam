import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    backgroundColor: "#f1f3f4",
    textAlign: "center",
    color: "black",
    padding: theme.spacing(2),
  },
  dummySpace: {
    height: theme.spacing(8),
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.dummySpace}>
      <Box className={classes.root}>
        <Typography variant="body1" gutterBottom>
          Managed and run by NavGurukul Students
        </Typography>
      </Box>
    </div>
  );
};
