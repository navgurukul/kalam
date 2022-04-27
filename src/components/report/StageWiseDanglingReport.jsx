// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/styles";
import axios from "axios";
import Box from "@mui/material/Box";
import theme from "../../theme";
import { changeFetching } from "../../store/slices/uiSlice";
import GlobalService from "../../services/GlobalService";
import StudentService from "../../services/StudentService";
import { allStages } from "../../utils/constants";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = import.meta.env.API_URL;

const StageWiseDanglingReport = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);
  const stageWiseDanglingReportURL = `${baseURL}students/report/dangling`;

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
      const response = await axios.get(stageWiseDanglingReportURL, {});
      dataConvert(response.data.data);
      fetchingFinish();
    } catch (e) {
      // console.error(e);
      fetchingFinish();
    }
  };

  useEffect(() => {
    const fetchData = async () => fetchonwerReport();
    fetchData();
  }, []);

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <MUIDataTable
          columns={StudentService.columnDanglingReports}
          data={data}
          icons={GlobalService.tableIcons}
          options={{
            headerStyle: {
              color: theme.palette.primary.main,
            },
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            selectableRows: "none",
            toolbar: false,
            filtering: true,
            filter: true,
            filterType: "doprdown",
            responsive: "stacked",
          }}
        />
      </ThemeProvider>
    </Box>
  );
};

export default StageWiseDanglingReport;
