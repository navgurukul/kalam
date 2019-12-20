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
import StageWiseDanglingReport from '../components/StageWiseDanglingReport';
import StageWiseGenderDistribution from '../components/StageWiseGenderDistribution';
import MyAssignReport from '../components/MyAssign';
import NotFoundPage from '../components/NotFoundPage';
import LoginDesign from '../components/LoginDesign';

// if authenticated, redirect to /students else be there
import PublicRoute from './PublicRouter';
// if authenticated be there, else redirect to /login
import PrivateRoute from './PrivateRouter';
// default behavior
import AnyRoute from './AnyRouter';

import history from '../utils/history';

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>        
        <AnyRoute path="/" component={LandingPage} exact={true} />
        <PublicRoute path="/login" component={LoginDesign} exact={true} />
        <PrivateRoute path="/tasks" component={MyTaskReport} />
        <PrivateRoute path="/report/dangling" component={StageWiseDanglingReport} />
        <PrivateRoute path="/report/all" component={StageWiseGenderDistribution} />
        <PrivateRoute path="/assign/user" component={MyAssignReport} />
        <PrivateRoute path="/students" component={AdmissionsDash} />
        <PrivateRoute path="/students/:dataType" component={AdmissionsDash} />

        <PrivateRoute path="/partner/add" component={AddPartner} />
        <AnyRoute path="/partner/:partnerId" component={DashboardPage} />
        <AnyRoute path="/partner/:partnerId/assessments" component={ViewAssessments} />
        <PrivateRoute path="/partners" component={PartnerList} />
        <AnyRoute path="/partners/:partnerId/assessments/:assessmentId" component={AssessmentAttempts} />

        <Route component={NotFoundPage} />
      </Switch>
      
    </div>
  </Router>
);

export default AppRouter;