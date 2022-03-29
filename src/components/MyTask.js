// Todo
// Logic of RQC Columns

import "date-fns";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { changeFetching } from "../store/actions/auth";
import StudentService from "../services/StudentService";
import MainLayout from "./MainLayout";
import PendingInterview from "./pendingInterview";
import Typography from "@material-ui/core/Typography";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const MyTaskReport = () => {
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [data, setData] = React.useState([]);
  const onwerDetailsURL = baseURL + "students/my_tasks";

  useEffect(() => {
    const fetchData = async () => await fetchonwerReport();
    fetchData();
  }, []);

  const fetchonwerReport = async () => {
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
        params: {
          user: user,
        },
      });
      dataConvert(response.data.data);
      fetchingFinish();
    } catch (e) {
      console.error(e);
      fetchingFinish();
    }
  };

  const dataConvert = (data) => {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      data[i].name = data[i].student.name;
      delete data[i].student;
      newData.push(data[i]);
    }
    setData(newData);
  };

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
      <br></br>
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
      <br></br>
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
