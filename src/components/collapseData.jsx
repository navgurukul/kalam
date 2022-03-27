import React from "react";
import clsx from "clsx";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import { Typography, CardContent } from "@mui/material";
import { allStages } from "../config";
import StageTransitions from "./StageTransitions";

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
          fontFamily: ("Roboto", "Helvetica", "Arial"),
          display: "flex",
        }}
      >
        {locationCampus === "campus" ? (
          <StageTransitions
            isShow={true}
            studentName={student.name}
            studentId={student.id}
            dataType="columnTransition"
          />
        ) : (
          student.name
        )}{" "}
        :{student.mobile ? student.mobile : student.contacts[0]["mobile"]}
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
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded((prevExp) => !prevExp);
  };

  const { classes, details, stage } = props;

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
