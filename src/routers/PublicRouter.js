import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const PublicRoute = ({
  isAuthenticated,
  loggedInUser,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
      return (
        isAuthenticated && loggedInUser.mobile ? (
          <Redirect to="/students" />
        ) : (props.location.pathname === '/' ? <Component {...props} /> :
          <React.Fragment>
            <Header />
            <Component {...props} />
            <Footer />
          </React.Fragment>
          )
      )
    }} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loggedInUser: state.auth.loggedInUser
});

export default connect(mapStateToProps, undefined)(PublicRoute);
