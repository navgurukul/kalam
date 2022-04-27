import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { useParams } from "react-router-dom";

import StudentService from "../../services/StudentService";
// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import GraphingPresentationJob from "../partner/GraphingPresentationJob";
// import user from "../utils/user";
import NotHaveAccess from "../layout/NotHaveAccess";

import { campus } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const { campusId } = useParams();
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const [state, setState] = React.useState({
    isShow: true,
    campusName: campus.find((x) => x.id === parseInt(campusId, 10)).name,
    access: null,
    // userLoggedIn: user(),
    campusRouteCondition: false,
  });
  const fetchAccess = async () => {
    try {
      const accessUrl = `${baseUrl}rolebaseaccess`;

      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus;
        const conditions = //variable to check if user is allowed to access the page
          campusData &&
          loggedInUser &&
          loggedInUser.email &&
          campusData[state.campusName] &&
          campusData[state.campusName].view &&
          campusData[state.campusName].view.includes(loggedInUser.email);

        setState({
          ...state,
          access: campusData || null,
          campusRouteCondition: conditions, //to set access object
        });
      });
    } catch (e) {
      // console.error(e);
    }
  };

  const fetchUsers = async () => {
    const usersURL = `${baseUrl}users/getall`;
    try {
      const response = await axios.get(usersURL, {});
      // usersSetup(response.data.data);
      fetchingFinish();
    } catch (e) {
      // console.error(e);
      fetchingFinish();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchAccess();
    };
    fetchData();
  }, []);

  const progressMade = (value) => {
    setState({ ...state, isShow: value });
  };
  const tabularData = (value) => {
    setState({ ...state, isShow: value });
  };
  const showGraphData = (value) => {
    setState({ ...state, isShow: value });
  };

  const { campusName, isShow } = state;
  //console.log(campusName, campusId);
  return (
    <div>
      {state.campusRouteCondition ? (
        <div>
          <SelectUiByButtons
            name={`${campusName} Campus`}
            progressMade={progressMade}
            tabularData={tabularData}
            showGraphData={showGraphData}
          />
          {isShow ? (
            <DashboardPage
              displayData={StudentService.CampusData}
              url={`campus/${campusId}/students`}
              campusID={campusId}
            />
          ) : isShow === null ? (
            <GraphingPresentationJob
              url={`/campus/${campusId}/students/distribution`}
            />
          ) : (
            <StudentsProgressCards url={`campus/${campusId}`} />
          )}
        </div>
      ) : (
        <NotHaveAccess />
      )}
    </div>
  );
};

export default CampusStudentsData;