import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import DashboardPage from "../components/Dashboard";
import PartnerList from "../components/PartnerList";
import OutreachDetails from "../components/OutreachDetails";
import AddPartner from "../components/AddPartner";
import AdmissionsDash from "../components/AdmissionsDash";
import AssessmentAttempts from "../components/AssessmentAttempts";
import ViewAssessments from "../components/ViewAssessments";
import MyTaskReport from "../components/MyTask";
import StageWiseDanglingReport from "../components/StageWiseDanglingReport";
import MyAssignReport from "../components/MyAssign";
import NotFoundPage from "../components/NotFoundPage";
import LoginDesign from "../components/LoginDesign";
import UserMoblieNumber from "../components/UserMoblieNumber";
import UpdateMobileNumber from "../components/UpdateMobileNumber";
import ReportContainer from "../components/ReportContainer";
import ProgressMadeForPartner from "../components/progressMade";
import DonorList from "../components/DonorList";
import DonorStudentsData from "../components/DonorStudentsData";
import CampusList from "../components/CampusList";
import CampusStudentsData from "../components/CampusStudentsData";
import PartnerStudentsProgressInCampus from "../components/PartnerStudentsProgressInCampus";
import OwnerList from "../components/OwnerList";
import AllCampusStudentsData from "../components/AllCampusStudentsData";
// if authenticated, redirect to /students else be there
import PublicRoute from "./PublicRouter";
// if authenticated be there, else redirect to /login
import PrivateRoute from "./PrivateRouter";
// default behavior
import AnyRoute from "./AnyRouter";

import history from "../utils/history";
import StudentStatus from "../components/StudentStatus";
import DuplicateStudents from "../components/DuplicateStudents";
import axios from "axios";
import user from "../utils/user";

import NotHaveAccess from "../components/NotHaveAccess.js";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
const baseUrl = process.env.API_URL;

//importing user from utils/user.js

const AppRouter = () => {
  const [access, setAccess] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(user());
  const [campusRouteCondition, setCampusRouteCondition] = useState(false);

  useEffect(async () => {
    setUserLoggedIn(user());
    await axios.get(`${baseUrl}rolebaseaccess`).then((res) => {
      setAccess(res.data);
    });
    var campusRouteCondition1 =
      window.location.href.split("/")[4] == 1
        ? access.campus &&
          access.campus.Pune &&
          access.campus.Pune.view &&
          access.campus.Pune.view.includes(userLoggedIn.email)
        : window.location.href.split("/")[4] == 2
        ? access.campus &&
          access.campus.Dharamshala &&
          access.campus.Dharamshala.view &&
          access.campus.Dharamshala.view.includes(userLoggedIn.email)
        : window.location.href.split("/")[4] == 3
        ? access.campus &&
          access.campus.Bangalore &&
          access.campus.Bangalore.view &&
          access.campus.Bangalore.view.includes(userLoggedIn.email)
        : window.location.href.split("/")[4] == 4
        ? access.campus &&
          access.campus.Sarjapura &&
          access.campus.Sarjapura.view &&
          access.campus.Sarjapura.view.includes(userLoggedIn.email)
        : window.location.href.split("/")[4] == 5
        ? access.campus &&
          access.campus.Tripura &&
          access.campus.Tripura.view &&
          access.campus.Tripura.view.includes(userLoggedIn.email)
        : window.location.href.split("/")[4] == 6
        ? access.campus &&
          access.campus.Delhi &&
          access.campus.Delhi.view &&
          access.campus.Delhi.view.includes(userLoggedIn.email)
        : false;

    setCampusRouteCondition(campusRouteCondition1);
  }, []);

  return (
    <Router history={history}>
      <div>
        <Switch>
          <PublicRoute path="/" component={LandingPage} exact={true} />
          <PrivateRoute
            path="/update/mobile/number"
            component={UpdateMobileNumber}
            exact={true}
          />
          <PrivateRoute
            path="/students"
            component={
              access &&
              userLoggedIn &&
              userLoggedIn.email &&
              access.students &&
              access.students.view &&
              access.students.view.includes(userLoggedIn.email)
                ? AdmissionsDash
                : NotHaveAccess
            }
          />
          <PrivateRoute
            path="/students/:dataType"
            component={
              access &&
              userLoggedIn &&
              userLoggedIn.email &&
              access.students &&
              access.students.view &&
              access.students.view.includes(userLoggedIn.email)
                ? AdmissionsDash
                : NotHaveAccess
            }
          />
          <PrivateRoute
            path="/campus/allcampus/students"
            component={
              access &&
              userLoggedIn &&
              userLoggedIn.email &&
              access.campus &&
              access.campus.All &&
              access.campus.All.view &&
              access.campus.All.view.includes(userLoggedIn.email)
                ? AllCampusStudentsData
                : NotHaveAccess
            }
          />
          <PrivateRoute
            path="/campus/:campusId/students"
            component={CampusStudentsData}
          />

          <PrivateRoute
            path="/campus"
            component={
              access &&
              userLoggedIn &&
              userLoggedIn.email &&
              access.campus &&
              access.campus.view &&
              access.campus.view.includes(userLoggedIn.email)
                ? CampusList
                : NotHaveAccess
            }
          />
          <PrivateRoute
            path="/partners"
            component={
              access &&
              userLoggedIn &&
              userLoggedIn.email &&
              access.partners &&
              access.partners.view &&
              access.partners.view.includes(userLoggedIn.email)
                ? PartnerList
                : NotHaveAccess
            }
          />

          <PublicRoute path="/login" component={LoginDesign} exact={true} />
          <PrivateRoute path="/tasks" component={MyTaskReport} />
          <PrivateRoute path="/donors" component={DonorList} />
          <PrivateRoute
            path="/report/dangling"
            component={StageWiseDanglingReport}
          />
          <PrivateRoute path="/report/all" component={ReportContainer} />
          <PrivateRoute path="/assign/user" component={MyAssignReport} />
          <PublicRoute
            path="/user/mobile/number"
            component={UserMoblieNumber}
          />
          <PrivateRoute path="/partner/add" component={AddPartner} />
          <AnyRoute
            path="/donor/:donorId/students"
            component={DonorStudentsData}
          />
          <AnyRoute
            path="/partner/:partnerId/assessments"
            component={ViewAssessments}
          />
          <AnyRoute
            path="/partner/:partnerId/progress"
            component={PartnerStudentsProgressInCampus}
          />
          <AnyRoute
            path="/partner/:partnerId"
            component={ProgressMadeForPartner}
          />
          <AnyRoute path="/partnerLanding/:slug" component={LandingPage} />
          <AnyRoute path="/status/:mobile" component={StudentStatus} />
          <AnyRoute
            path="/check_duplicate/Name=:fnamemnamelname&Number=:number&Stage=:stage"
            component={DuplicateStudents}
          />
          <PrivateRoute path="/outreachDetails" component={OutreachDetails} />
          <PrivateRoute path="/owner" component={OwnerList} />
          <AnyRoute
            path="/partners/:partnerId/assessments/:assessmentId"
            component={AssessmentAttempts}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
