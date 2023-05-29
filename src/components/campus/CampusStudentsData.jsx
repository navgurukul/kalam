import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import axios from "axios";
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

// import { campus } from "../../utils/constants";
import RedFlag from "./FlagModal";

const baseURL = import.meta.env.VITE_API_URL;

const CampusStudentsData = () => {
  const { campusId } = useParams();
  const { loggedInUser, roles } = useSelector((state) => state.auth);
  const { privileges } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const usersSetup = (users) => dispatch(setupUsers(users));
  const [dataView, setDataView] = React.useState(0);
  const [campusList, setCampusList] = useState([]);

  // const campusName = campus.find((x) => x.id === parseInt(campusId, 10)).name;
  // useEffect(() => fetchingFinish(), []);
  const fetchCampus = async () => {
    try {
      const adminRole = roles.findIndex(
        (roleItem) => roleItem.role === "Admin"
      );
      const role = roles.find((roleItem) => roleItem.role === "Campus");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseURL}campus`;
      const response = await axios.get(dataURL);
      const campus = response.data.data;
      setCampusList(
        adminRole !== -1
          ? [...campus, { campus: "All" }]
          : [...campus.filter((campusItem) => access.includes(campusItem.id))]
      );
    } catch (error) {
      console.error("Error fetching campus data:", error);
    } finally {
      fetchingFinish();
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCampus();
    })();
  }, [loggedInUser]);

  const campusName = campusList.find(
    (x) => x.id === parseInt(campusId, 10)
  )?.campus;

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

  const overview = () => {
    setDataView(0);
  };

  const studentData = () => {
    setDataView(1);
  };
  const progressMade = () => {
    setDataView(2);
  };
  const showGraphData = () => {
    setDataView(3);
  };

  //console.log(campusName, campusId);

  const getVIew = (viewNo) => {
    switch (viewNo) {
      case 0:
        return <OverviewData />;
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
        return <StudentsProgressCards url={`campus/${campusId}`} />;
      case 3:
        return (
          <PieRechartReport url={`/campus/${campusId}/students/distribution`} />
        );
      default:
        return <OverviewData />;
    }
  };
  return (
    <>
      <SelectUiByButtons
        name={`${campusName} Campus`}
        overview={{ label: "Overview", action: overview }}
        progressMade={{ label: "Progress Made", action: progressMade }}
        studentData={{ label: "Student Data", action: studentData }}
        showGraphData={{ label: "Graph on Job", action: showGraphData }}
        selected={
          dataView === 0
            ? "overview"
            : dataView === 1
            ? "studentData"
            : dataView === 2
            ? "progressMade"
            : "showGraphData"
        }
      />
      {getVIew(dataView)}
    </>
  );
};

export default CampusStudentsData;
