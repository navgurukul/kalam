import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import LazyLoading from '../../components/LazyLoading';
import { history } from './app-history';
import PrivateRoute from './PrivateRoute';

import LoginPage from '../../views/Login';

// This is show case how you can lazy loading component
const ExampleRouteHandler = LazyLoading(() => import('../../views/example'));

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <PrivateRoute exact path="/home" component={ExampleRouteHandler} />
      <PrivateRoute exact path="/home234" component={ExampleRouteHandler} />
    </Switch>
  </Router>
);

export default AppRouter;
