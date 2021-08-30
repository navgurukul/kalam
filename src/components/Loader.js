import React from 'react';
import { HalfCircleSpinner } from 'react-epic-spinners'
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
        <HalfCircleSpinner color="#f05f40" />
      </div>
    )
  }
}

export default (withStyles(styles)(Loader));
