import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import DashboardPage from '../components/Dashboard';
import PartnerList from '../components/PartnerList';
import AddPartner from '../components/AddPartner';
import AdmissionsDash from '../components/AdmissionsDash';
import AssessmentAttempts from '../components/AssessmentAttempts';
import ViewAssessments from '../components/ViewAssessments';
import MyTaskReport from '../components/MyTask';
import NotFoundPage from '../components/NotFoundPage';

import PublicRoute from './PublicRouter';
import PrivateRoute from './PrivateRouter';

import history from '../utils/history';

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>        
        <PublicRoute path="/" component={LandingPage} exact={true} />
        <PrivateRoute path="/tasks" component={MyTaskReport} />
        <PrivateRoute path="/students" component={AdmissionsDash} />
        <PrivateRoute path="/students/:dataType" component={AdmissionsDash} />

        <PublicRoute path="/partner/add" component={AddPartner} />
        <PublicRoute path="/partner/:partnerId" component={DashboardPage} />
        <PublicRoute path="/partner/:partnerId/assessments" component={ViewAssessments} />
        <PublicRoute path="/partners" component={PartnerList} />
        <PublicRoute path="/partners/:partnerId/assessments/:assessmentId" component={AssessmentAttempts} />

        <Route component={NotFoundPage} />
      </Switch>
      
    </div>
  </Router>
);

export default AppRouter;