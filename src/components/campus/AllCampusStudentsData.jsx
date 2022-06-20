/* eslint-disable no-nested-ternary */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import StudentService from "../../services/StudentService";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import GraphingPresentationJob from "../partner/GraphingPresentationJob";
// import user from "../utils/user";
import Loader from "../ui/Loader";

//baseUrl
// const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.ui);
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [dataView, setDataView] = React.useState(0);

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

  const getVIew = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <DashboardPage
            displayData={StudentService.CampusData}
            url="/allcampus/students"
          />
        );
      case 1:
        return <StudentsProgressCards url="allcampus" />;
      case 2:
        return (
          <GraphingPresentationJob url="/allcampus/students/distribution" />
        );
      default:
        return (
          <DashboardPage
            displayData={StudentService.CampusData}
            url="/allcampus/students"
          />
        );
    }
  };
  return isFetching ? ( //if user is allowed to access the page
    <>
      <SelectUiByButtons
        name="All Campus"
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
  ) : (
    <Loader container />
  );
};

export default CampusStudentsData;
