import React from 'react';
import { Router, Route, Switch,withRouter } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { history } from './app-history';
import LazyLoading from '../../components/LazyLoading';
import PrivateRoute from './PrivateRoute';
import HeaderBar from '../../components/HeaderBar';
import LoginPage from '../../views/Login';
import Partners from '../../components/Partners/PartnersFile';
import Students from '../../components/Students/StudentsFile';
// This is show case how you can lazy loading component
const ExampleRouteHandler = LazyLoading(() => import('../../views/example'));

const AppRouter = () => (
  <Router history={history}>
    <HeaderBar />
    <Container maxWidth={false}>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <PrivateRoute exact path="/home" component={ExampleRouteHandler} />
        <PrivateRoute exact path="/home234" component={ExampleRouteHandler} />
        <Route exact  path="/Partners/add" component={Partners} />
        <Route exact  path="/Partners/:id" component={Partners} />
        <Route exact path="/Partners" component={Partners} />
        <Route exact path="/Students" component={Students} />
      </Switch>
    </Container>
  </Router>
);

export default withRouter(AppRouter);
