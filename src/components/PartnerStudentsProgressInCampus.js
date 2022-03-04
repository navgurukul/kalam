import React, { useEffect } from "react";
import axios from "axios";
import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import StudentsProgressCards from "./StudentsProgressCards";
import SelectUiByButtons from "./SelectUiByButtons";
import GraphingPresentationJob from "./GraphingPresentationJob.js";

const baseUrl = process.env.API_URL;

const PartnerStudentsProgressInCampus = (props) => {
  const [state, setState] = React.useState({
    partnerName: "",
    isShow: false,
  });

  useEffect(() => {
    const partnerId = props.match.params.partnerId;
    axios.get(`${baseUrl}partners/${partnerId}`).then((res) => {
      setState({
        ...state,
        partnerName: res.data.data["name"],
      });
    });
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
  const { partnerName, isShow } = state;
  return (
    <div>
      <SelectUiByButtons
        name={`Hello ${partnerName}`}
        progressMade={progressMade}
        tabularData={tabularData}
        showGraphData={showGraphData}
      />
      {isShow ? (
        <DashboardPage
          displayData={StudentService["CampusData"]}
          url={`partners/joined_progress_made/${props.match.params.partnerId}`}
        />
      ) : isShow === null ? (
        <GraphingPresentationJob
          url={`/partners/${props.match.params.partnerId}/students/distribution`}
        />
      ) : (
        <StudentsProgressCards
          url={`partners/${props.match.params.partnerId}`}
        />
      )}
    </div>
  );
};

export default PartnerStudentsProgressInCampus;
