import React from 'react';
import { Route, Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { selectors } from '../../auth';

const PrivateRoute = ({
  isAuthorized, component: Component, location, ...rest
}) => {
  if (!isAuthorized) {
    return <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />;
  }
  return <Route {...rest} component={(props) => <Component {...props} />} />;
};

const mapStateToProps = (state) => ({
  isAuthorized: selectors.selectIsAuthorized(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps, undefined),
)(PrivateRoute);
