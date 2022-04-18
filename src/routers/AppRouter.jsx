import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useCustomNotifier from "../utils/useCustomNotifier";

import LandingPage from "../components/pages/LandingPage";
import AdmissionsDash from "../components/dashboard/AdmissionsDash";
import NotFoundPage from "../components/layout/NotFoundPage";

import PartnerList from "../components/partner/PartnerList";
import OutreachDetails from "../components/outreach/OutreachDetails";
import AddPartner from "../components/partner/AddPartner";
import AssessmentAttempts from "../components/assessment/AssessmentAttempts";
import ViewAssessments from "../components/assessment/ViewAssessments";
import MyTaskReport from "../components/pages/MyTask";
import StageWiseDanglingReport from "../components/report/StageWiseDanglingReport";
import MyAssignReport from "../components/pages/MyAssign";
import LoginDesign from "../components/pages/LoginDesign";
import UserMoblieNumber from "../components/contact/UserMoblieNumber";
import UpdateMobileNumber from "../components/contact/UpdateMobileNumber";
import ReportContainer from "../components/report/ReportContainer";
import ProgressMadeForPartner from "../components/partner/progressMade";
import DonorList from "../components/donor/DonorList";
import DonorStudentsData from "../components/donor/DonorStudentsData";
import CampusList from "../components/campus/CampusList";
import CampusStudentsData from "../components/campus/CampusStudentsData";
import PartnerStudentsProgressInCampus from "../components/partner/PartnerStudentsProgressInCampus";
import OwnerList from "../components/owner/OwnerList";
import AllCampusStudentsData from "../components/campus/AllCampusStudentsData";

import history from "../utils/history";
import StudentStatus from "../components/student/StudentStatus";
import DuplicateStudents from "../components/pages/DuplicateStudents";
import TestInstructions from "../components/onlineTest/Instructions";
import StudentForm from "../components/onlineTest/StudentForm";
import FinalInstruction from "../components/onlineTest/FinalInstruction";
import Questions from "../components/onlineTest/Questions";
import NewAdminPage from "../components/pages/NewAdminPage";
import SlotBooking from "../components/pages/SlotBooking";
// if authenticated, redirect to /students else be there
// import PublicRoute from "./PublicRouter";
// if authenticated be there, else redirect to /login
// import PrivateRoute from "./PrivateRouter";
import theme from "../theme";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import RequireAuth from "./RequireAuth";
import { fetchCurrentUser } from "../store/slices/authSlice";
import { decryptText } from "../utils";

const AppRouter = () => {
  useCustomNotifier();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      const userId = parseInt(decryptText(localStorage.getItem("userId")), 10);
      dispatch(fetchCurrentUser({ userId }));
    }
  }, []);
  return (
    <Router history={history}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
        }}
      >
        <Header />
        <div style={{ marginTop: "2.4rem", flexGrow: 1 }}>
          <Routes>
            {/* <Route
          path="/"
          element={
            <RequireAuth privateRoute>
              <UpdateMobileNumber />
            </RequireAuth>
          }
        /> */}
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
              path="/admin"
              element={
                <RequireAuth privateRoute>
                  <NewAdminPage />
                </RequireAuth>
              }
            />
            <Route path="/students">
              <Route
                index
                element={
                  <RequireAuth privateRoute>
                    <AdmissionsDash />
                  </RequireAuth>
                }
              />
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
                path="add"
                element={
                  <RequireAuth privateRoute>
                    <AddPartner />
                  </RequireAuth>
                }
              />
              <Route path=":partnerId">
                <Route
                  index
                  element={
                    <RequireAuth privateRoute>
                      <ProgressMadeForPartner />
                    </RequireAuth>
                  }
                />
                <Route
                  path="progress"
                  element={<PartnerStudentsProgressInCampus />}
                />
                <Route path="assessments" element={<ViewAssessments />} />
                <Route
                  path="assessments/:assessmentId"
                  element={
                    <RequireAuth>
                      <AssessmentAttempts />
                    </RequireAuth>
                  }
                />
              </Route>
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
            <Route path="/campus">
              <Route
                index
                element={
                  <RequireAuth privateRoute>
                    <CampusList />
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
              <Route
                path="allcampus/students"
                element={
                  <RequireAuth privateRoute>
                    <AllCampusStudentsData />
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

            <Route path="/bookslot/:userId" element={<SlotBooking />} />
            {/* <Route path="/test/:enrollmentKey/:testId" element={<SlideShow />} /> */}
            <Route path="/test/">
              <Route index path="instructions" element={<TestInstructions />} />
              <Route path="studentdetails" element={<StudentForm />} />
              <Route path="finalinstruction" element={<FinalInstruction />} />
              <Route path=":enrollmentKey/:studentId" element={<Questions />} />
            </Route>
            {/* <Route path="/questions/:enrollmentKey" element={<Questions />} /> */}
            <Route path="/status/:mobile" element={<StudentStatus />} />
            {/* <AnyRoute path="/check_duplicate" component={<DuplicateStudents/>} /> */}
            <Route
              path="/check_duplicate/name=:name&number=:number&stage=:stage"
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRouter;
