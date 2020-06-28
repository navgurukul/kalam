import React, { Component } from "react";
import clsx from 'clsx';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import { Typography, CardContent } from "@material-ui/core";
import { allStages } from '../config'


const showContact = (student) => {
  return <center><p key={student.name} style={{ fontSize: 15 }}>{student.name}: {student.mobile}</p></center>
}

class CollapseStudentData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  };

  render() {
    const { classes, details, stage } = this.props;
    const { expanded } = this.state;

    if (!details.length) {
      return <CardContent>
      <center><Typography variant="h6">{allStages[stage]}({details.length})</Typography></center>
        {details.length == 0 && <center><p style={{ fontSize: 15, color: "red" }}>No record Found</p></center>}
      </CardContent>
    }

    return <>
      <CardContent>
        <center><Typography variant="h6">{allStages[stage]}({details.length})</Typography></center>
        {details.length > 0 && !expanded && details.slice(0, 10).map(showContact)}
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
          {expanded ?
            <><Typography>See Less</Typography>
              <ExpandLessIcon className={classes.expandOpen} color="primary" /></>
            :
            <><Typography>See More</Typography>
              <ExpandMoreIcon className={classes.expandOpen} color="primary" /></>
          }
        </IconButton>

      </CardActions>
    </>
  }
}

export default CollapseStudentData;