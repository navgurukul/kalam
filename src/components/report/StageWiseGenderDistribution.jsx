// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { changeFetching } from "../../store/slices/uiSlice";
import StudentService from "../../services/StudentService";
import MainLayout from "../muiTables/MainLayout";

const { allStages } = require("../../config");

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = import.meta.env.VITE_API_URL;

const StageWiseGenderDistribution = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);

  const StageWiseGenderDistributionURL = `${baseURL}students/report/all`;

  const dataConvert = (_data) => {
    const newData = [];
    Object.entries(_data).forEach(([key, value]) => {
      const dic = {};
      const [, female, male, trans] = value;
      dic.female = female;
      dic.male = male;
      dic.transgender = trans;
      dic.unspecified = value.null;
      dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
      dic.stage = allStages[key];
      newData.push(dic);
    });
    setData(newData);
  };

  const fetchonwerReport = async () => {
    try {
      fetchingStart();
      const response = await axios.get(StageWiseGenderDistributionURL, {});
      dataConvert(response.data.data);
      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };

  useEffect(() => {
    (async () => fetchonwerReport())();
  }, []);

  return (
    <MainLayout columns={StudentService.columnDanglingReports} data={data} />
  );
};

export default StageWiseGenderDistribution;
