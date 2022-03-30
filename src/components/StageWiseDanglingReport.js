// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@material-ui/styles";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { theme } from "../theme/theme";
import { changeFetching } from "../store/actions/auth";
import { allStages } from "../config";
import GlobalService from "../services/GlobalService";
import StudentService from "../services/StudentService";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const StageWiseDanglingReport = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);
  const stageWiseDanglingReportURL = baseURL + "students/report/dangling";

  useEffect(() => {
    const fetchData = async () => await fetchonwerReport();
    fetchData();
  }, []);

  const fetchonwerReport = async () => {
    try {
      fetchingStart();
      const response = await axios.get(stageWiseDanglingReportURL, {});
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
      const dic = {};
      dic.female = value[1];
      dic.male = value[2];
      dic.transgender = value[3];
      dic.unspecified = value[null];
      dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
      dic.stage = allStages[key];
      newData.push(dic);
    }
    setData(newData);
  };

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