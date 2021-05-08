import React, { Component } from "react";
import clsx from "clsx";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import IconButton from "@material-ui/core/IconButton";
import CardActions from "@material-ui/core/CardActions";
import { Typography, CardContent } from "@material-ui/core";
import { allStages } from "../config";

const showContact = (student) => {
  let studentStatus = "";
  if (student.status != null) {
    const status_student =
      student.status.charAt(0).toUpperCase() + student.status.slice(1);
    const status = status_student.split(/(?=[A-Z])/);
    studentStatus = status.join(" ");
  }

  return (
    <center>
      <div key={student.name} style={{ fontSize: 15, marginTop: 8 }}>
        {student.name}:{student.mobile}
      </div>
      {student.status != null ? (
        <span style={{ fontSize: 15, fontWeight: 500 }}>({studentStatus})</span>
      ) : (
        <span>{student.status}</span>
      )}
    </center>
  );
};

class CollapseStudentData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { classes, details, stage } = this.props;
    const { expanded } = this.state;

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
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={this.handleExpandClick}
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
        </CardActions>
      </div>
    );
  }
}

export default CollapseStudentData;
