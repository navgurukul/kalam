import React from "react";
import { HalfCircleSpinner } from "react-epic-spinners";
import { makeStyles } from "@mui/styles";
import { Container, Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Loader = ({ container }) => {
  const classes = useStyles();
  if (container)
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Typography variant="h3" style={{ marginBottom: "2.4rem" }}>
          Loading
        </Typography>
        <div className={classes.root}>
          <HalfCircleSpinner color="#f05f40" />
        </div>
      </Container>
    );
  return (
    <div className={classes.root}>
      <HalfCircleSpinner color="#f05f40" />
    </div>
  );
};

Loader.defaultProps = { container: false };

export default Loader;
