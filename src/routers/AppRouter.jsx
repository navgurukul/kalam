import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
// import ReportContainer from "../components/ReportContainer";
// import ProgressMadeForPartner from "../components/progressMade";
// import DonorList from "../components/DonorList";
// import DonorStudentsData from "../components/DonorStudentsData";
// import CampusList from "../components/CampusList";
// import CampusStudentsData from "../components/CampusStudentsData";
// import PartnerStudentsProgressInCampus from "../components/PartnerStudentsProgressInCampus";
// import OwnerList from "../components/OwnerList";
// import AllCampusStudentsData from "../components/AllCampusStudentsData";
// // if authenticated, redirect to /students else be there
// import PublicRoute from "./PublicRouter";
// // if authenticated be there, else redirect to /login
// import PrivateRoute from "./PrivateRouter";
// // default behavior
// import AnyRoute from "./AnyRouter";
// import history from "../utils/history";
// import StudentStatus from "../components/StudentStatus";
// import DuplicateStudents from "../components/DuplicateStudents";
// import SlideShow from "../onlineTest/SlideShow";
// import EkAurBaat from "../onlineTest/EkAurBaat";
// import Questions from "../onlineTest/Questions";
// import NewAdminPage from "../components/NewAdminPage";
// import SlotBooking from "../components/SlotBooking";
// import SlotBooking2 from "../components/SlotBooking2";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

import RequireAuth from "./RequireAuth";

const AppRouter = () => (
  <Router history={history}>
    <div>
      {/* <Header /> */}
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth privateRoute>
              <UpdateMobileNumber />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <LandingPage />
            </RequireAuth>
          }
        />
        {/* <PublicRoute path="/" component={LandingPage} exact={true} /> */}
        <Route
          path="/students"
          element={
            <RequireAuth privateRoute>
              <AdmissionsDash />
            </RequireAuth>
          }
        >
          <Route
            path=":dataType"
            component={
              <RequireAuth privateRoute>
                <AdmissionsDash />
              </RequireAuth>
            }
          />
        </Route>
        {/* <PrivateRoute path="/students" component={AdmissionsDash} /> */}
        <Route
          path="/partners"
          element={
            <RequireAuth privateRoute>
              <PartnerList />
            </RequireAuth>
          }
        />
        <Route path="/partner">
          <Route
            path="/add"
            element={
              <RequireAuth privateRoute>
                <AddPartner />
              </RequireAuth>
            }
          />
          <Route
            path=":partnerId"
            element={
              <RequireAuth privateRoute>
                <ProgressMadeForPartner />
              </RequireAuth>
            }
          />
          <Route path=":partnerId/assessments" element={<ViewAssessments />} />
          <Route
            path=":partnerId/assessments/:assessmentId"
            element={
              <RequireAuth>
                <AssessmentAttempts />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="/partnerLanding/:slug" element={<LandingPage />} />

        <Route
          path="/donors"
          element={
            <RequireAuth privateRoute>
              <DonorList />
            </RequireAuth>
          }
        />
        <Route
          path="/donor/:donorId/students"
          element={<DonorStudentsData />}
        />
        <Route
          path="/campus"
          exact
          element={
            <RequireAuth privateRoute>
              <CampusList />
            </RequireAuth>
          }
        >
          <Route
            path="allcampus/students"
            element={
              <RequireAuth privateRoute>
                <AllCampusStudentsData />
              </RequireAuth>
            }
          />
          <Route
            path=":campusId/students"
            element={
              <RequireAuth privateRoute>
                <CampusStudentsData />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="/owner"
          element={
            <RequireAuth privateRoute>
              <OwnerList />
            </RequireAuth>
          }
        />
        <Route
          path="/outreachDetails"
          element={
            <RequireAuth privateRoute>
              <OutreachDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/tasks"
          element={
            <RequireAuth privateRoute>
              <MyTaskReport />
            </RequireAuth>
          }
        />
        <Route path="/report">
          <Route
            path="dangling" // report/dangling
            component={
              <RequireAuth privateRoute>
                <StageWiseDanglingReport />
              </RequireAuth>
            }
          />
          <Route
            path="all" // report/all
            element={
              <RequireAuth privateRoute>
                <ReportContainer />
              </RequireAuth>
            }
          />
        </Route>
        <Route
          path="/assign/user"
          element={
            <RequireAuth privateRoute>
              <MyAssignReport />
            </RequireAuth>
          }
        />
        <Route
          path="/user/mobile/number"
          element={
            <RequireAuth>
              <UserMoblieNumber />
            </RequireAuth>
          }
        />

        <Route path="/test/:enrollmentKey" element={<SlideShow />} />
        <Route path="/bookSlot/:userId" element={<SlotBooking2 />} />
        <Route path="/EkAurBaat/:enrollmentKey" element={<EkAurBaat />} />
        <Route path="/questions/:enrollmentKey" element={<Questions />} />
        <Route path="/status/:mobile" element={<StudentStatus />} />
        {/* <AnyRoute path="/check_duplicate" component={<DuplicateStudents/>} /> */}
        <Route
          path="/check_duplicate/Name=:fnamemnamelname&Number=:number&Stage=:stage"
          element={<DuplicateStudents />}
        />

        <Route
          path="/login"
          element={
            <RequireAuth>
              <LoginDesign />
            </RequireAuth>
          }
        />
        <Route
          path="/update/mobile/number"
          element={
            <RequireAuth privateRoute>
              <UpdateMobileNumber />
            </RequireAuth>
          }
        />
        <Route element={<NotFoundPage />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  </Router>
);

export default AppRouter;
