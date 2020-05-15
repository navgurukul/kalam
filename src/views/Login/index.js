import React, { useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  AppBar, withStyles, IconButton, Box, Container, Avatar, Typography, Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  startAuthRequest, authFailure, selectors,
} from '../../auth';
import NGLogo from '../../assets/img/logoWhite.png';

import { googleAuthSuccess } from '../../auth/asyncActions';
import { history } from '../../providers/routing/app-history';

import Spacer from '../../components/Spacer';

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

const LoginPage = ({
  isAuthorized, authError, authPending, actions, classes, theme,
}) => {
  const onGoogleLogin = (googleResponse) => actions.googleAuthSuccess(googleResponse);

  const onGoogleLoginError = (error) => actions.authFailure(error.error);

  const onGoogleLoginRequest = () => actions.startAuthRequest();

  useEffect(() => {
    if (isAuthorized) {
      /* eslint-disable no-restricted-globals */
      const { state: locationState } = location;
      const redirectTo = locationState && locationState.from !== null ? locationState.from : '/home';
      history.push(redirectTo);
    }
  });

  return (
    <React.Fragment>
      <AppBar position="sticky" className={classes.appBarContainer}>
        <IconButton edge="start" className={classes.menuButton} color="inherit">
          <MenuIcon />
        </IconButton>
        <Box className={classes.logoContainer}>
          <img src={NGLogo} className={classes.logoImg} />
          <Box className={classes.ngServiceNameContainer}>
            <Typography variant="h6" style={{ fontWeight: 100 }}>Admissions</Typography>
          </Box>
        </Box>
        <IconButton color="inherit">
          <ExitToAppIcon />
        </IconButton>
      </AppBar>
      <Container maxWidth={false}>
        <Box style={{
          marginTop: '30vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        >
          <Avatar style={{
            backgroundColor: theme.palette.secondary.main,
            margin: theme.spacing(2),
          }}
          >
            <LockOutlinedIcon />
          </Avatar>
          {authError && (
            <Alert severity="error">
              Google sign in error. Error code —
              {authError}
            </Alert>
          )}
          <Spacer height={theme.spacing(2)} />
          <GoogleLogin
            clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={onGoogleLogin}
            onFailure={onGoogleLoginError}
            onRequest={onGoogleLoginRequest}
            scope="profile email"
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                variant="contained"
                size="large"
                color="primary"
                disabled={authPending}
              >
                Login with NG ID
              </Button>
            )}
            cookiePolicy="single_host_origin"
          />
        </Box>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthorized: selectors.selectIsAuthorized(state),
  authPending: selectors.selectAuthPending(state),
  authError: selectors.selectAuthError(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startAuthRequest, authFailure, googleAuthSuccess }, dispatch),
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true })
)(LoginPage);
