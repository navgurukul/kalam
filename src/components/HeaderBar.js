import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  AppBar, withStyles, IconButton, Box, Typography,
} from '@material-ui/core';


import NGLogo from '../assets/img/logoWhite.png';

import { connect } from 'react-redux';
import { selectors } from '../auth';

const styles = (theme) => ({
  appBarContainer: {
    flexDirection: 'row',
    padding: theme.spacing(1),
  },
  logoContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    height: 40,
    width: 158,
  },
  ngServiceNameContainer: {
    marginLeft: theme.spacing(1),
  },
});
const HeaderBar = ({ classes, theme, isAuthorized }) => (
<AppBar position="sticky" className={classes.appBarContainer}>
    {isAuthorized &&
      <IconButton edge="start" className={classes.menuButton} color="inherit">
        <MenuIcon />
      </IconButton>
    }
    <Box className={classes.logoContainer}>
      <img src={NGLogo} className={classes.logoImg} />
      <Box className={classes.ngServiceNameContainer}>
        <Typography variant="h6" style={{ fontWeight: 100 }}>
          Admissions
        </Typography>
      </Box>
    </Box>
    {isAuthorized && (
      <IconButton color="inherit">
        <ExitToAppIcon />
      </IconButton>
    )}
  </AppBar>);


const mapStateToProps = state => ({
  isAuthorized: selectors.selectIsAuthorized(state),
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, undefined)(HeaderBar)
);
