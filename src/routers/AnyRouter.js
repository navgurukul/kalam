import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux';


export const AnyRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
      return (
        <div>
          <Header />
          <div className="bodyComponent">
            <Component {...props} />
          </div>
          <Footer/>
        </div>
      )
    }}/>
  );

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, undefined)(AnyRoute);
