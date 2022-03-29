import React from "react";
import StudentService from "../services/StudentService";
import { donor } from "../config";
import DashboardPage from "./Dashboard";
import SelectUiByButtons from "./SelectUiByButtons";
import StudentsProgressCards from "./StudentsProgressCards";
import GraphingPresentationJob from "./GraphingPresentationJob";

const DonorStudentsData = (props) => {
  const [state, setState] = React.useState({
    isShow: true,
    donorName: donor.find((x) => x.id === parseInt(props.match.params.donorId))
      .name,
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
  const { donorId } = props.match.params;

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
          displayData={StudentService["DonorData"]}
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
