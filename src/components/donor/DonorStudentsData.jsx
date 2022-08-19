import React from "react";
import { useParams } from "react-router-dom";
import StudentService from "../../services/StudentService";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import PieRechartReport from "../partner/PieRechartReport";

import { donor } from "../../utils/constants";

const DonorStudentsData = () => {
  const { donorId } = useParams();
  const [dataView, setDataView] = React.useState(0);

  const donorName = donor.find((x) => x.id === parseInt(donorId, 10)).name;

  const progressMade = () => setDataView(1);

  const tabularData = () => setDataView(0);

  const showGraphData = () => setDataView(2);

  const getView = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <DashboardPage
            displayData={StudentService.DonorData}
            url={`donor/${donorId}/students`}
          />
        );
      case 1:
        return <StudentsProgressCards url={`donor/${donorId}`} />;
      case 2:
        return (
          <PieRechartReport url={`/donor/${donorId}/students/distribution`} />
        );
      default:
        return (
          <DashboardPage
            displayData={StudentService.DonorData}
            url={`donor/${donorId}/students`}
          />
        );
    }
  };

  return (
    <div>
      <SelectUiByButtons
        name={`${donorName} Donor`}
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

export default DonorStudentsData;
