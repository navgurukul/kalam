import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import { history } from './app-history';
import LazyLoading from '../../components/LazyLoading';
import PrivateRoute from './PrivateRoute';
// import HeaderBar from '../../components/HeaderBar';
import LoginPage from '../../views/Login';
import Partners from '../../components/Partners/PartnersFile';
import Students from '../../components/Students/StudentsFile';
import '../../style/index.css';
// This is show case how you can lazy loading component
const ExampleRouteHandler = LazyLoading(() => import('../../views/example'));

const AppRouter = () => (
  <Router history={history}>
    <Container maxWidth={false} disableGutters>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <PrivateRoute exact path="/home" component={ExampleRouteHandler} />
        <PrivateRoute exact path="/home234" component={ExampleRouteHandler} />
        <Route exact path="/Partners" component={Partners} />
        <Route exact path="/Partners/add" component={Partners} />
        <Route exact path="/Partners/:id" component={Partners} />
        <Route exact path="/Students" component={Students} />
      </Switch>
    </Container>
  </Router>
);

export default AppRouter;
