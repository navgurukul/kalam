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
    dataView: 0,
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

  const progressMade = () => {
    setState({ ...state, dataView: 1 });
  };
  const tabularData = () => {
    setState({ ...state, dataView: 0 });
  };
  const showGraphData = () => {
    setState({ ...state, dataView: 2 });
  };

  const { campusName, dataView } = state;
  //console.log(campusName, campusId);

  const getVIew = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <DashboardPage
            displayData={StudentService.CampusData}
            url={`campus/${campusId}/students`}
            campusID={campusId}
          />
        );
      case 1:
        return <StudentsProgressCards url={`campus/${campusId}`} />;
      case 2:
        return (
          <GraphingPresentationJob
            url={`/campus/${campusId}/students/distribution`}
          />
        );
      default:
        return (
          <DashboardPage
            displayData={StudentService.CampusData}
            url={`campus/${campusId}/students`}
            campusID={campusId}
          />
        );
    }
  };
  return (
    <div>
      {state.campusRouteCondition ? (
        <div>
          <SelectUiByButtons
            name={`${campusName} Campus`}
            progressMade={{ label: "Progress Made", action: progressMade }}
            tabularData={{ label: "Tabular Data", action: tabularData }}
            showGraphData={{ label: "Graph on Job", action: showGraphData }}
            selected={
              dataView === 0
                ? "tabularData"
                : dataView === 1
                ? "progressMade"
                : "showGraphData"
            }
          />
          {getVIew(dataView)}
        </div>
      ) : (
        <NotHaveAccess />
      )}
    </div>
  );
};

export default CampusStudentsData;
