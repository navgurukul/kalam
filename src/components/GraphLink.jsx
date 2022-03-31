import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    fontSize: "45px",
    color: "#f05f40",
    cursor: "pointer",
  },
}));

const GraphLink = (props) => {
  const { titleName, id } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h5">{titleName} </Typography>
      <div>
        <Link
          className={classes.link}
          to={`${id}/students/distribution`}
          target="_blank"
        >
          <Typography variant="h6">Graph of job kab lagega</Typography>
        </Link>
      </div>
      <Typography variant="h5">{titleName} </Typography>
    </div>
  );
};

export default GraphLink;
