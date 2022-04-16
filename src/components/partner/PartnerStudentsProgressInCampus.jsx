import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudentService from "../../services/StudentService";
import DashboardPage from "../Dashboard";
import StudentsProgressCards from "../StudentsProgressCards";
import SelectUiByButtons from "../SelectUiByButtons";
import GraphingPresentationJob from "../GraphingPresentationJob";

const baseUrl = import.meta.env.VITE_API_URL;

const PartnerStudentsProgressInCampus = () => {
  const { partnerId } = useParams();
  const [state, setState] = React.useState({
    partnerName: "",
    isShow: false,
  });

  useEffect(() => {
    axios.get(`${baseUrl}partners/${partnerId}`).then((res) => {
      setState({
        ...state,
        partnerName: res.data.data.name,
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
          displayData={StudentService.CampusData}
          url={`partners/joined_progress_made/${partnerId}`}
        />
      ) : isShow === null ? (
        <GraphingPresentationJob
          url={`/partners/${partnerId}/students/distribution`}
        />
      ) : (
        <StudentsProgressCards url={`partners/${partnerId}`} />
      )}
    </div>
  );
};

export default PartnerStudentsProgressInCampus;
