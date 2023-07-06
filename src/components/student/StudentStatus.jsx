import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import MUIDataTable from "mui-datatables";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { tableIcons } from "../../services/GlobalService";
import StudentService from "../../services/StudentService";

const baseUrl = import.meta.env.VITE_API_URL;

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "absolute",
//     marginLeft: "3vw",
//     marginRight: "3vw",
//     width: "94vw",
//     [theme.breakpoints.up("md")]: {
//       margin: "auto",
//       width: "50%",
//     },
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(4),
//     outline: "none",
//   },
// }));

const StudentStatus = () => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [status, setStatus] = React.useState([]);

  const fetchStatus = async () => {
    let mobile;
    if (location.pathname.includes("status")) {
      [, mobile] = location.pathname.split("status/");
    } else {
      mobile = location.state.mobile;
    }
    try {
      const response = await axios.get(`${baseUrl}students/status/${mobile}`);
      const allData =
        response && response?.data?.school
          ? [...response?.data?.data, ...response?.data?.school]
          : [...response?.data?.data];
      setStatus(allData);
    } catch (e) {
      enqueueSnackbar("Please Enter Registered Mobile Number!", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  useEffect(() => {
    (async () => fetchStatus())();
  }, []);
  return (
    <div>
      <Typography variant="h5" id="modal-title">
        Student Status
        <br />
      </Typography>
      <MUIDataTable
        columns={StudentService.columns.columnStudentStatus}
        data={status}
        icons={tableIcons}
        options={{
          exportButton: true,
          pageSize: 100,
          showTitle: false,
          selectableRows: "none",
          toolbar: false,
          filtering: true,
          filter: true,
          filterType: "dropdown",
          responsive: "vertical",
        }}
        style={{ maxWidth: "90%", margin: "0 auto", marginTop: 25 }}
      />
    </div>
  );
};

export default StudentStatus;
