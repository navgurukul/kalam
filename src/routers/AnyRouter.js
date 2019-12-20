import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const AnyRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => (
      isAuthenticated ? (
        <div>
          <Header />
          <div className="bodyComponent">
            <Component {...props} />
          </div>
          <Footer/>
        </div>
      ) : (
          <div className="bodyComponent">
            <Component {...props} />
          </div>
        )
    )} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default AnyRoute;