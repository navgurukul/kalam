import React from "react";
import { HalfCircleSpinner } from "react-epic-spinners";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <HalfCircleSpinner color="#f05f40" />
    </div>
  );
};

export default Loader;
