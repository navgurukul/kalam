import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import LandingPage from "../components/LandingPage";
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
import SlideShow from "../onlineTest/SlideShow";
import EkAurBaat from "../onlineTest/EkAurBaat";
import Questions from "../onlineTest/Questions";
import NewAdminPage from "../components/NewAdminPage";
import SlotBooking from "../components/SlotBooking";
import SlotBooking2 from "../components/SlotBooking2";
const AppRouter = () => {
  return (
    <Router history={history}>
      <div>
        <Switch>
          <PublicRoute path="/" component={LandingPage} exact={true} />
          <PrivateRoute path="/students" component={AdmissionsDash} />
          <PrivateRoute path="/students/:dataType" component={AdmissionsDash} />
          <PrivateRoute exact path="/partners" component={PartnerList} />
          <PrivateRoute path="/partner/add" component={AddPartner} />
          <PrivateRoute path="/admin" exact component={NewAdminPage} />
          <AnyRoute
            exact
            path="/partner/:partnerId"
            component={ProgressMadeForPartner}
          />
          <AnyRoute
            path="/partners/:partnerId/assessments/:assessmentId"
            component={AssessmentAttempts}
          />
          <AnyRoute path="/partnerLanding/:slug" component={LandingPage} />
          <AnyRoute
            path="/partner/:partnerId/assessments"
            component={ViewAssessments}
          />
          <AnyRoute
            path="/partner/:partnerId/progress"
            component={PartnerStudentsProgressInCampus}
          />
          <PrivateRoute path="/donors" component={DonorList} />
          <AnyRoute
            path="/donor/:donorId/students"
            component={DonorStudentsData}
          />
          <PrivateRoute path="/campus" exact component={CampusList} />
          <PrivateRoute
            path="/campus/allcampus/students"
            component={AllCampusStudentsData}
          />
          <PrivateRoute
            path="/campus/:campusId/students"
            component={CampusStudentsData}
          />

          <PrivateRoute path="/owner" component={OwnerList} />
          <PrivateRoute path="/outreachDetails" component={OutreachDetails} />
          <PrivateRoute path="/tasks" component={MyTaskReport} />

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

          <AnyRoute path="/test/:enrollmentKey" component={SlideShow} />
          <AnyRoute path="/bookSlot/:userId" component={SlotBooking2} />
          <AnyRoute path="/EkAurBaat/:enrollmentKey" component={EkAurBaat} />
          <AnyRoute path="/questions/:enrollmentKey" component={Questions} />
          <AnyRoute path="/status/:mobile" component={StudentStatus} />
          <AnyRoute path="/check_duplicate" component={DuplicateStudents} />
          <AnyRoute
            path="/check_duplicate/Name=:fnamemnamelname&Number=:number&Stage=:stage"
            component={DuplicateStudents}
          />

          <PublicRoute path="/login" component={LoginDesign} exact={true} />
          <PrivateRoute
            path="/update/mobile/number"
            component={UpdateMobileNumber}
            exact={true}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
