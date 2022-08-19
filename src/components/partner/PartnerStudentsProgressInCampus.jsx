import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudentService from "../../services/StudentService";
import DashboardPage from "../dashboard/Dashboard";
import StudentsProgressCards from "../student/StudentsProgressCards";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import PieRechartReport from "./PieRechartReport";

const baseUrl = import.meta.env.VITE_API_URL;

const PartnerStudentsProgressInCampus = () => {
  const { partnerId } = useParams();
  const [partnerName, setPartnerName] = React.useState("");
  const [dataView, setDataView] = React.useState(1);

  const isPartnerGroup =
    location.pathname.split("/")[2] === "group" ? "partnerGroup" : "partners";

  useEffect(() => {
    axios
      .get(
        `${baseUrl}${isPartnerGroup}/${partnerId}${
          isPartnerGroup === "partnerGroup" ? "/name" : ""
        }`
      )
      .then((res) => {
        setPartnerName(res.data.data[0]?.name || res.data.data.name);
      });
  }, []);

  const progressMade = () => setDataView(1);

  const tabularData = () => setDataView(0);

  const showGraphData = () => setDataView(2);

  const getView = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <DashboardPage
            displayData={StudentService.CampusData}
            url={`${isPartnerGroup}/joined_progress_made/${partnerId}`}
          />
        );
      case 1:
        return <StudentsProgressCards url={`${isPartnerGroup}/${partnerId}`} />;

      case 2:
        return (
          <PieRechartReport
            url={`/${isPartnerGroup}/${partnerId}/students/distribution`}
          />
        );
      default:
        return <StudentsProgressCards url={`${isPartnerGroup}/${partnerId}`} />;
    }
  };
  return (
    <div>
      <SelectUiByButtons
        name={`Hello ${partnerName}`}
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
      {getView(dataView)}
    </div>
  );
};

export default PartnerStudentsProgressInCampus;
