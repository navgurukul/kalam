import React, { Component } from "react";
import clsx from "clsx";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import { Typography, CardContent } from "@material-ui/core";
import { allStages } from "../config";


import StageTransitions from "./StageTransitions"; 
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


const showContact = (student) => {
  let studentStatus = "";
  if (student.status != null) {
    const status_student =
      student.status.charAt(0).toUpperCase() + student.status.slice(1);
    const status = status_student.split(/(?=[A-Z])/);
    studentStatus = status.join(" ");
  }
  let locationCampus = location.pathname.split("/")[1];
  return (
    <center>
      <div
        key={student.name}
        style={{
          fontSize: 15,
          marginTop: 10,
          fontFamily: ("Roboto", "Helvetica", "Arial"),
        }}
      >
        {locationCampus === "campus" ?  <StageTransitions isShow = {true} studentName = {student.name} studentId = {student.id} dataType = "columnTransition"/> :  student.name}

        :
        {student.mobile ? student.mobile : student.contacts[0]["mobile"]}
      </div>
      {student.status != null ? (
        <span style={{ fontSize: 15, fontWeight: 500 }}>({studentStatus})</span>
      ) : (
        <span>{student.status}</span>
      )}
    </center>
  );
};

const CollapseStudentData = (props) => {
  const { classes, details, stage } = props;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  if (!details.length) {
    return (
      <CardContent>
        <center>
          <Typography variant="h6">
            {allStages[stage]}({details.length})
          </Typography>
        </center>
        {details.length == 0 && (
          <center>
            <p style={{ fontSize: 15, color: "red" }}>No record Found</p>
          </center>
        )}
      </CardContent>
    );
  }
  return (
    <div>
      <CardContent>
        <center>
          <Typography variant="h6">
            {allStages[stage]}({details.length})
          </Typography>
        </center>
        {details.length > 0 &&
          !expanded &&
          details.slice(0, 10).map(showContact)}
        {details.length > 0 && expanded && details.map(showContact)}
      </CardContent>
      <CardActions disableSpacing>
        {details.length > 10 && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {expanded ? (
              <div>
                <Typography>See Less</Typography>
                <ExpandLessIcon
                  className={classes.expandOpen}
                  color="primary"
                />
              </div>
            ) : (
              <div>
                <Typography>See More</Typography>
                <ExpandMoreIcon
                  className={classes.expandOpen}
                  color="primary"
                />
              </div>
            )}
          </IconButton>
        )}
      </CardActions>
    </div>
  );
};

export default CollapseStudentData;
