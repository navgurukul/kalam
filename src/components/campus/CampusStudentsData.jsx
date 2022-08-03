import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import StudentService, {
  navGurukulSurveyForm,
} from "../../services/StudentService";
// import { setupUsers } from "../store/slices/authSlice";
import { changeFetching } from "../../store/slices/uiSlice";
import DashboardPage from "../dashboard/Dashboard";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import StudentsProgressCards from "../student/StudentsProgressCards";
import GraphingPresentationJob from "../partner/GraphingPresentationJob";
import EvaluationSelect from "../smallComponents/EvaluationSelect";

import { campus } from "../../utils/constants";
import RedFlag from "./FlagModal";

// const baseUrl = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const { campusId } = useParams();
  const { privileges } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const [dataView, setDataView] = React.useState(0);

  const campusName = campus.find((x) => x.id === parseInt(campusId, 10)).name;

  useEffect(() => fetchingFinish(), []);

  const EvaluationColumn = {
    name: "evaluation",
    label: "Evaluation",
    options: {
      filter: false,
      sort: true,
      display: privileges.some(
        (priv) => priv.privilege === "UpdateStudentEvaluation"
      ),
      viewColumns: privileges.some(
        (priv) => priv.privilege === "UpdateStudentEvaluation"
      ),
      customBodyRender: React.useCallback(
        (value, rowMeta, updateValue) => (
          <EvaluationSelect
            rowMetatable={rowMeta}
            evaluation={value}
            change={(event) => updateValue(event)}
          />
        ),
        []
      ),
    },
  };

  const redFlagColumn = {
    label: "Flag",
    name: "redflag",
    options: {
      filter: true,
      filterType: "dropdown",
      display: privileges.some((priv) => priv.privilege === "ViewFlag"),
      viewColumns: privileges.some((priv) => priv.privilege === "ViewFlag"),
      customBodyRender: React.useCallback(
        (value, rowMeta, updateValue) => (
          <RedFlag
            rowMetaTable={rowMeta}
            studentId={rowMeta.rowData[0]}
            comment={value}
            change={(event) => updateValue(event)}
          />
        ),
        []
      ),
    },
  };

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
            isCampus
            displayData={[
              ...StudentService.CampusData,
              EvaluationColumn,
              redFlagColumn,
              navGurukulSurveyForm,
            ]}
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
            isCampus
            displayData={[
              ...StudentService.CampusData,
              EvaluationColumn,
              redFlagColumn,
              navGurukulSurveyForm,
            ]}
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
