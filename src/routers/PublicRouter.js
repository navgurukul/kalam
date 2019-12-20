import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const PublicRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
      return (
      isAuthenticated ? (
        <Redirect to="/students" />
      ) : (
      <React.Fragment>
        <Header/>
        <Component {...props} />
        <Footer/>
      </React.Fragment>
      )
    )}} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, undefined)(PublicRoute);
