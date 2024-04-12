import React from "react";
import { useParams } from "react-router-dom";
import StudentService from "../../services/StudentService";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import PieRechartReport from "../partner/PieRechartReport";

import { donor } from "../../utils/constants";
// import OverviewData from "../dashboard/OverviewData";
const DonorStudentsData = () => {
  const { donorId } = useParams();
  const [dataView, setDataView] = React.useState(1);

  const donorName = donor.find((x) => x.id === parseInt(donorId, 10)).name;

  // const overview = () => {
  //   setDataView(0);
  // };
  const studentData = () => {
    setDataView(1);
  };
  const progressMade = () => {
    setDataView(2);
  };
  const showGraphData = () => {
    setDataView(3);
  };
  const getView = (viewNo) => {
    switch (viewNo) {
      // case 0:
      //   return <OverviewData />;
      case 1:
        return (
          <DashboardPage
            displayData={StudentService.DonorData}
            url={`donor/${donorId}/students`}
          />
        );
      case 2:
        return <StudentsProgressCards url={`donor/${donorId}`} />;
      case 3:
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
        // overview={{ label: "Overview", action: overview }}
        progressMade={{ label: "Progress Made", action: progressMade }}
        studentData={{ label: "Student Data", action: studentData }}
        showGraphData={{ label: "Graph on Job", action: showGraphData }}
        selected={
          // dataView === 0
          //   ? "overview"
          //   :
          dataView === 1
            ? "studentData"
            : dataView === 2
            ? "progressMade"
            : "showGraphData"
        }
      />
      {getView(dataView)}
    </div>
  );
};

export default DonorStudentsData;
