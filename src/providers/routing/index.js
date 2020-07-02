import React, { PureComponent } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import { history } from './app-history';
import LazyLoading from '../../components/LazyLoading';
import PrivateRoute from './PrivateRoute';
import HeaderBar from '../../components/HeaderBar';
import LoginPage from '../../views/Login';
import Partners from '../../components/Partners/PartnersFile';
import Students from '../../components/Students/StudentsFile';
// This is show case how you can lazy loading component
const ExampleRouteHandler = LazyLoading(() => import('../../views/example'));

class AppRouter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAddEdit: false,
    };
  }

  render() {
    return (
      <Router history={history}>
        {true ? <Grid xs={9}><HeaderBar /></Grid> : <HeaderBar />}
        <Container maxWidth={false}>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <PrivateRoute exact path="/home" component={ExampleRouteHandler} />
            <PrivateRoute exact path="/home234" component={ExampleRouteHandler} />
            <Route
              exact
              path="/Partners"
              render={() => (
                <Partners />
              )}
            />
            <Route exact path="/Students" component={Students} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

export default AppRouter;
