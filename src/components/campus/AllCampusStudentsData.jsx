/* eslint-disable no-nested-ternary */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import StudentService from "../../services/StudentService";
import DashboardPage from "../Dashboard";
import SelectUiByButtons from "../SelectUiByButtons";
import StudentsProgressCards from "../StudentsProgressCards";
import GraphingPresentationJob from "../GraphingPresentationJob";
// import user from "../utils/user";
import NotHaveAccess from "../NotHaveAccess";

//baseUrl
const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const [state, setState] = React.useState({
    isShow: true,
    access: null, //access object to store data who are allowed to access the page
    // userLoggedIn: user(), //user object to store data of logged in user
    allCampusCondition: false, //condition to check if user is allowed to access the page
  });
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const fetchUsers = async () => {
    const usersURL = `${baseUrl}users/getall`;
    try {
      const response = await axios.get(usersURL, {});
      // usersSetup(response.data.data);
      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };
  const fetchAccess = async () => {
    try {
      const accessUrl = `${baseUrl}rolebaseaccess`; //request url
      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus; //storing response data in campusData variable
        const conditions = //variable to check if user is allowed to access the page
          campusData &&
          loggedInUser &&
          loggedInUser.email &&
          campusData.All &&
          campusData.All.view &&
          campusData.All.view.includes(loggedInUser.email);

        setState({
          ...state,
          access: campusData || null,
          allCampusCondition: conditions, //to set access object
        });
      });
    } catch (e) {
      // console.error(e);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchAccess();
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
  const { isShow } = state;
  return (
    <div>
      {state.allCampusCondition ? ( //if user is allowed to access the page
        <div>
          <SelectUiByButtons
            name="All Campus"
            progressMade={progressMade}
            tabularData={tabularData}
            showGraphData={showGraphData}
          />
          {isShow ? (
            <DashboardPage
              displayData={StudentService.CampusData}
              url="/allcampus/students"
            />
          ) : isShow === null ? (
            <GraphingPresentationJob url="/allcampus/students/distribution" />
          ) : (
            <StudentsProgressCards url="allcampus" />
          )}
        </div>
      ) : (
        <NotHaveAccess />
      )}
    </div>
  );
};

export default CampusStudentsData;
