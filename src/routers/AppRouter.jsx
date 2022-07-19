import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSnackbar } from "notistack";
import useCustomNotifier from "../utils/useCustomNotifier";
import theme from "../theme";
import RequireAuth from "./RequireAuth";
import { fetchCurrentUser, logout } from "../store/slices/authSlice";
import { decryptText } from "../utils";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LandingPage from "../components/pages/LandingPage";
import CustomLandingPage from "../components/pages/CustomLandingPage";
import AdmissionsDash from "../components/dashboard/AdmissionsDash";
import NotFoundPage from "../components/layout/NotFoundPage";
import Loader from "../components/ui/Loader";
import { changeFetching } from "../store/slices/uiSlice";

const AssessmentAttempts = React.lazy(() =>
  import("../components/assessment/AssessmentAttempts")
);
const ViewAssessments = React.lazy(() =>
  import("../components/assessment/ViewAssessments")
);

const CampusList = React.lazy(() => import("../components/campus/CampusList"));
const AllCampusStudentsData = React.lazy(() =>
  import("../components/campus/AllCampusStudentsData")
);
const CampusStudentsData = React.lazy(() =>
  import("../components/campus/CampusStudentsData")
);

const DonorList = React.lazy(() => import("../components/donor/DonorList"));
const DonorStudentsData = React.lazy(() =>
  import("../components/donor/DonorStudentsData")
);

const OwnerList = React.lazy(() => import("../components/owner/OwnerList"));

const PlacementStudentsData = React.lazy(() =>
  import("../components/placement/placementStudentsData")
);

const AddPartner = React.lazy(() => import("../components/partner/AddPartner"));
const PartnerList = React.lazy(() =>
  import("../components/partner/PartnerList")
);
const PartnerStudentsProgressInCampus = React.lazy(() =>
  import("../components/partner/PartnerStudentsProgressInCampus")
);
const ProgressMadeForPartner = React.lazy(() =>
  import("../components/partner/progressMade")
);

const UserMoblieNumber = React.lazy(() =>
  import("../components/contact/UserMoblieNumber")
);
const UpdateMobileNumber = React.lazy(() =>
  import("../components/contact/UpdateMobileNumber")
);

const StageWiseDanglingReport = React.lazy(() =>
  import("../components/report/StageWiseDanglingReport")
);
const ReportContainer = React.lazy(() =>
  import("../components/report/ReportContainer")
);

const OutreachDetails = React.lazy(() =>
  import("../components/outreach/OutreachDetails")
);

const StudentStatus = React.lazy(() =>
  import("../components/student/StudentStatus")
);

const MyTaskReport = React.lazy(() => import("../components/pages/MyTask"));
const MyAssignReport = React.lazy(() => import("../components/pages/MyAssign"));
const LoginDesign = React.lazy(() => import("../components/pages/LoginDesign"));
const AdminPage = React.lazy(() => import("../components/admin/AdminPage"));
const CreateRP = React.lazy(() => import("../components/admin/CreateRP"));
const SlotBooking = React.lazy(() => import("../components/pages/SlotBooking"));
const DuplicateStudents = React.lazy(() =>
  import("../components/pages/DuplicateStudents")
);

const TestInstructions = React.lazy(() =>
  import("../components/onlineTest/Instructions")
);
const StudentForm = React.lazy(() =>
  import("../components/onlineTest/StudentForm")
);
const FinalInstruction = React.lazy(() =>
  import("../components/onlineTest/FinalInstruction")
);
const Questions = React.lazy(() =>
  import("../components/onlineTest/Questions")
);

const AppRouter = () => {
  useCustomNotifier();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      const userId = parseInt(decryptText(localStorage.getItem("userId")), 10);
      if (isNaN(userId)) {
        enqueueSnackbar("Token Expierd: Login Again", { variant: "info" });
        dispatch(logout());
        return;
      }
      dispatch(changeFetching(true));
      dispatch(fetchCurrentUser({ userId }));
    }
  }, []);
  return (
    <Router>
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
            <Route path="/admin">
              <Route
                index
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <AdminPage />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route
                path="create"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <CreateRP />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
            </Route>
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
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <PartnerList />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route path="/partner">
              <Route
                path="add"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <AddPartner />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route
                path=":partnerId/assessments/:assessmentId"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <AssessmentAttempts />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route path=":partnerId">
                <Route
                  index
                  element={
                    <React.Suspense fallback={<Loader container />}>
                      <ProgressMadeForPartner />
                    </React.Suspense>
                  }
                />
                <Route
                  path="progress"
                  element={
                    <React.Suspense fallback={<Loader container />}>
                      <PartnerStudentsProgressInCampus />
                    </React.Suspense>
                  }
                />
                <Route path="assessments" element={<ViewAssessments />} />
              </Route>
              <Route path="group">
                <Route path=":partnerId">
                  <Route
                    index
                    element={
                      <React.Suspense fallback={<Loader container />}>
                        <ProgressMadeForPartner />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path="progress"
                    element={
                      <React.Suspense fallback={<Loader container />}>
                        <PartnerStudentsProgressInCampus />
                      </React.Suspense>
                    }
                  />
                  <Route path="assessments" element={<ViewAssessments />} />
                </Route>
              </Route>
            </Route>

            <Route path="/partnerLanding/:slug" element={<LandingPage />} />
            <Route path="/amravati" element={<CustomLandingPage />} />

            <Route
              path="/donors"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <DonorList />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route
              path="/donor/:donorId/students"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <DonorStudentsData />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route path="/campus">
              <Route
                index
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <CampusList />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route
                path=":campusId/students"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <CampusStudentsData />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route
                path="allcampus/students"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <AllCampusStudentsData />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
            </Route>

            <Route
              path="/owner"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <OwnerList />
                  </RequireAuth>{" "}
                </React.Suspense>
              }
            />
            <Route
              path="/placements"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <PlacementStudentsData />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route
              path="/outreachDetails"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <OutreachDetails />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route
              path="/tasks"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <MyTaskReport />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route path="/report">
              <Route
                path="dangling" // report/dangling
                component={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <StageWiseDanglingReport />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
              <Route
                path="all" // report/all
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <RequireAuth privateRoute>
                      <ReportContainer />
                    </RequireAuth>
                  </React.Suspense>
                }
              />
            </Route>
            <Route
              path="/assign/user"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <MyAssignReport />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route
              path="/user/mobile/number"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth>
                    <UserMoblieNumber />
                  </RequireAuth>
                </React.Suspense>
              }
            />

            <Route
              path="/bookslot/:userId"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <SlotBooking />
                </React.Suspense>
              }
            />
            {/* <Route path="/test/:enrollmentKey/:testId" element={<SlideShow />} /> */}
            <Route path="/test/">
              <Route
                index
                path="instructions"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <TestInstructions />
                  </React.Suspense>
                }
              />
              <Route
                path="studentdetails"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <StudentForm />
                  </React.Suspense>
                }
              />
              <Route
                path="finalinstruction"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <FinalInstruction />
                  </React.Suspense>
                }
              />
              <Route
                path=":enrollmentKey/:studentId"
                element={
                  <React.Suspense fallback={<Loader container />}>
                    <Questions />
                  </React.Suspense>
                }
              />
            </Route>
            {/* <Route path="/questions/:enrollmentKey" element={<Questions />} /> */}
            <Route
              path="/status/:mobile"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <StudentStatus />
                </React.Suspense>
              }
            />
            {/* <AnyRoute path="/check_duplicate" component={<DuplicateStudents/>} /> */}
            <Route
              path="/check_duplicate/name=:name&number=:number&stage=:stage"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <DuplicateStudents />
                </React.Suspense>
              }
            />

            <Route
              path="/login"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth>
                    <LoginDesign />
                  </RequireAuth>
                </React.Suspense>
              }
            />
            <Route
              path="/update/mobile/number"
              element={
                <React.Suspense fallback={<Loader container />}>
                  <RequireAuth privateRoute>
                    <UpdateMobileNumber />
                  </RequireAuth>
                </React.Suspense>
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
