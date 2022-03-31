import React from "react";
import { useParams } from "react-router-dom";
import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob";

const { donor } = require("../config");

const DonorStudentsData = () => {
  const { donorId } = useParams();
  const [state, setState] = React.useState({
    isShow: true,
    donorName: donor.find((x) => x.id === parseInt(donorId, 10)).name,
  });

  const progressMade = (value) => {
    setState({ ...state, isShow: value });
  };

  const tabularData = (value) => {
    setState({ ...state, isShow: value });
  };

  const showGraphData = (value) => {
    setState({ ...state, isShow: value });
  };

  const { donorName, isShow } = state;

  return (
    <div>
      <SelectUiByButtons
        name={`${donorName} Donor`}
        progressMade={progressMade}
        tabularData={tabularData}
        showGraphData={showGraphData}
      />
      {isShow ? (
        <DashboardPage
          displayData={StudentService.DonorData}
          url={`donor/${donorId}/students`}
        />
      ) : isShow === null ? (
        <GraphingPresentationJob
          url={`/donor/${donorId}/students/distribution`}
        />
      ) : (
        <StudentsProgressCards url={`donor/${donorId}`} />
      )}
    </div>
  );
};

export default DonorStudentsData;
