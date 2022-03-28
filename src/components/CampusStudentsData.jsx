import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeFetching, setupUsers } from "../store/actions/auth";

import axios from "axios";

import StudentService from "../services/StudentService";
import { campus } from "../config";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob.js";
import user from "../utils/user";
import NotHaveAccess from "./NotHaveAccess";

const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = (props) => {
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  const usersSetup = (users) => dispatch(setupUsers(users));
  const [state, setState] = React.useState({
    isShow: true,
    campusName: campus.find(
      (x) => x.id === parseInt(props.match.params.campusId)
    ).name,
    access: null,
    userLoggedIn: user(),
    campusRouteCondition: false,
  });
  const fetchAccess = async () => {
    try {
      const accessUrl = baseUrl + "rolebaseaccess";

      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus;
        const conditions = //variable to check if user is allowed to access the page
          campusData &&
          state.userLoggedIn &&
          state.userLoggedIn.email &&
          campusData[state.campusName] &&
          campusData[state.campusName].view &&
          campusData[state.campusName].view.includes(state.userLoggedIn.email);

        setState({
          ...state,
          access: campusData ? campusData : null,
          campusRouteCondition: conditions, //to set access object
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    const usersURL = baseUrl + "users/getall";
    try {
      const response = await axios.get(usersURL, {});
      usersSetup(response.data.data);
      fetchingFinish();
    } catch (e) {
      console.error(e);
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
  const { campusId } = props.match.params;
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
              displayData={StudentService["CampusData"]}
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
