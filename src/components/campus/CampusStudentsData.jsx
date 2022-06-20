import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import StudentService from "../../services/StudentService";
// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import GraphingPresentationJob from "../partner/GraphingPresentationJob";

import { campus } from "../../utils/constants";

// const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const { campusId } = useParams();
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const [dataView, setDataView] = React.useState(0);

  const campusName = campus.find((x) => x.id === parseInt(campusId, 10)).name;

  useEffect(() => fetchingFinish(), []);

  const progressMade = () => {
    setDataView(1);
  };
  const tabularData = () => {
    setDataView(0);
  };
  const showGraphData = () => {
    setDataView(2);
  };
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
    <>
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
    </>
  );
};

export default CampusStudentsData;
