import React from 'react';
import { BrowserRouter, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import DashboardPage from '../components/Dashboard';
import PartnerList from '../components/PartnerList';
import AddPartner from '../components/AddPartner';
import AdmissionsDash from '../components/AdmissionsDash';
import AssessmentAttempts from '../components/AssessmentAttempts';
import ViewAssessments from '../components/ViewAssessments';

import HomePage from '../components/HomePage';
import ContactPage from '../components/ContactPage';
import FAQPage from '../components/FAQPage';
import NotFoundPage from '../components/NotFoundPage';
import ServicesPage from '../components/ServicesPage';

import PublicRoute from './PublicRouter';
import PrivateRoute from './PrivateRouter';

import LoginPage from '../components/LoginPage';
import GetStartedPage from '../components/GetStartedPage';
import ProductsPage from '../components/ProductsPage';
import FormsPage from '../components/FormsPage';

import history from '../utils/history';

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>        
        <PublicRoute path="/" component={LandingPage} exact={true} />
        <PrivateRoute path="/home" component={HomePage} />
  
        <PublicRoute path="/login" component={LoginPage}  />

        <PublicRoute path="/students" component={AdmissionsDash} />
        <PublicRoute path="/students/:dataType" component={AdmissionsDash} />

        <PublicRoute path="/partner/add" component={AddPartner} />
        <PublicRoute path="/partner/:partnerId" component={DashboardPage} />
        <PublicRoute path="/partner/:partnerId/assessments" component={ViewAssessments} />
        <PublicRoute path="/partners" component={PartnerList} />
        <PublicRoute path="/partners/:partnerId/assessments/:assessmentId" component={AssessmentAttempts} />

        <PublicRoute path="/products" component={ProductsPage} />
        <PublicRoute path="/forms" component={FormsPage} />
        
        <PublicRoute path="/start" component={GetStartedPage} />
        <PublicRoute path="/contact" component={ContactPage} />
        <PublicRoute path="/FAQ" component={FAQPage} />
         
        <Route path="/services" component={ServicesPage} />
        <Route component={NotFoundPage} />
      </Switch>
      
    </div>
  </Router>
);

export default AppRouter;