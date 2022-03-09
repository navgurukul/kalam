// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { changeFetching } from "../store/actions/auth";
import { allStages, feedbackableStagesData } from "../config";
import StudentService from "../services/StudentService";
import MainLayout from "./MainLayout";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const StageWiseGenderDistribution = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);

  const StageWiseGenderDistributionURL = baseURL + "students/report/all";

  useEffect(() => {
    (async () => await fetchonwerReport())();
  }, []);

  const fetchonwerReport = async () => {
    try {
      fetchingStart();
      const response = await axios.get(StageWiseGenderDistributionURL, {});
      dataConvert(response.data.data);
      fetchingFinish();
    } catch (e) {
      console.error(e);
      fetchingFinish();
    }
  };

  const dataConvert = (data) => {
    const newData = [];
    for (const [key, value] of Object.entries(data)) {
      if (!feedbackableStagesData[key]) {
        const dic = {};
        dic.female = value[1];
        dic.male = value[2];
        dic.transgender = value[3];
        dic.unspecified = value[null];
        dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
        dic.stage = allStages[key];
        newData.push(dic);
      }
    }
    setData(newData);
  };
  return (
    <MainLayout columns={StudentService.columnDanglingReports} data={data} />
  );
};

export default StageWiseGenderDistribution;
