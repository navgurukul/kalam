/* eslint-disable no-plusplus */
// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { changeFetching } from "../../store/slices/uiSlice";
import StudentService from "../../services/StudentService";
import MainLayout from "../muiTables/MainLayout";
import PendingInterview from "../smallComponents/pendingInterview";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = import.meta.env.VITE_API_URL;

const MyTaskReport = () => {
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);
  const onwerDetailsURL = `${baseURL}students/my_tasks`;

  const dataConvert = () => {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      data[i].name = data[i].student.name;
      delete data[i].student;
      newData.push(data[i]);
    }
    setData(newData);
  };

  const fetchonwerReport = async (signal) => {
    try {
      fetchingStart();
      // response = ngFetch(this.studentsURL, 'GET', {
      //   params: {
      //     dataType: this.dataType,
      //     fromDate: this.fromDate,
      //     toDate: this.toDate
      //   }
      // }, true);
      const user = loggedInUser.email.split("@")[0];
      const response = await axios.get(onwerDetailsURL, {
        signal,
        params: {
          user,
        },
      });
      dataConvert(response.data.data);
      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = () => fetchonwerReport(controller.signal);
    fetchData();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <Typography
        variant="h5"
        color="primary"
        gutterBottom
        display="block"
        style={{ marginTop: 20 }}
      >
        All tasks
      </Typography>
      <br />
      <MainLayout columns={StudentService.columnMyReports} data={data} />
      <Typography
        variant="h5"
        color="primary"
        gutterBottom
        display="block"
        style={{ marginTop: 20 }}
      >
        Pending interview
      </Typography>
      <br />
      <PendingInterview />
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   loggedInUser: state.auth.loggedInUser,
// });

// const mapDispatchToProps = (dispatch) => ({
//   fetchingStart: () => dispatch(changeFetching(true)),
//   fetchingFinish: () => dispatch(changeFetching(false)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(MyTaskReport);
export default MyTaskReport;
