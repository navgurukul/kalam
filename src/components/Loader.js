import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core/styles";


const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
});

class Loader extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CircularProgress color="primary" />
      </div>
    )
  }
}

export default (withStyles(styles)(Loader));
