import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Typography } from '@material-ui/core';
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";


const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between"
  },
  link: {
    fontSize: "45px",
    color: "#f05f40",
    cursor: "pointer"
  },
});

class GraphLink extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5">{this.props.titleName} </Typography>
        <div>
          <Link
            className={classes.link}
            to={`${this.props.id}/students/distribution`}
            target="_blank"
          >
            <Typography variant="h6">Graph of job kab lagega</Typography>
          </Link>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(GraphLink);