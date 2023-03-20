import React, { useEffect, useState } from "react";
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
import PieRechartReport from "../partner/PieRechartReport";
import EvaluationSelect from "../smallComponents/EvaluationSelect";
import OverviewData from "../dashboard/OverviewData";
import NewCustomToolbar from "./ToolbarAddButtonNewSchool";

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

  const [addSchool, setAddSchool] = useState(false);

  const openAddSchool = () =>{
    setAddSchool(true);
  }

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddButtonNewSchool openAddSchool={setAddSchool}/>,
      []
    ),
  };


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
    setDataView(2);
  };
  const studentData = () => {
    setDataView(1);
  };
  const showGraphData = () => {
    setDataView(3);
  };
//-----------------------OVERVIEW DATA------------
  const overview = () =>{
    setDataView(0)
  }
  //console.log(campusName, campusId);

  const getVIew = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <OverviewData
          isCampus
          displayData={[
          // ...StudentService.CampusData,
           //EvaluationColumn,
           //redFlagColumn,
           //navGurukulSurveyForm,
         ]}
          url={`campus/${campusId}/students`}
          campusID={campusId}
          options={options}
        />
        );
      case 1:
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
      case 2:
        return (
                <StudentsProgressCards url={`campus/${campusId}`} />
        );
      default:
        return (
          <PieRechartReport url={`/campus/${campusId}/students/distribution`} />
        );
    }
  };
  return (
    <>
      <SelectUiByButtons
        name={`${campusName} Campus`}
        progressMade={{ label: "Progress Made", action: progressMade }}
        studentData={{ label: "Student Data", action: studentData }}
        showGraphData={{ label: "Graph on Job", action: showGraphData }}
        overview={{label: "overview", action : overview}}
        selected={
          dataView === 1 ? "studentData" : 
          dataView === 2 ? "progressMade" : 
          dataView === 0? "overview": 
          "showGraphData"
        }
      />
      {getVIew(dataView)}
    </>
  );
};

export default CampusStudentsData;
