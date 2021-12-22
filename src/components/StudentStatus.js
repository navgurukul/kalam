import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import GlobalService from "../services/GlobalService";
import StudentService from "../services/StudentService";
import { useLocation } from "react-router-dom";

const baseUrl = process.env.API_URL;

const useStyles = (theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
});

export class StudentStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      data: [],
    };
  }

  async componentDidMount() {
    let mobile;
    if (window.location.href.includes("status")) {
      mobile = window.location.href.split("status/")[1];
    } else {
      mobile = history.state.state.mobile;
    }

    try {
      const response = await axios.get(`${baseUrl}students/status/${mobile}`);
      this.setState({ data: response.data.data });
    } catch (e) {
      this.props.enqueueSnackbar("Please Enter Registered Mobile Number!", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      console.log(e);
    }
  }

  render = () => {
    const { data } = this.state;
    return (
      <div>
        <Typography variant="h5" id="modal-title">
          Student Status
          <br />
        </Typography>
        <MUIDataTable
          columns={StudentService.columns["columnStudentStatus"]}
          data={data}
          icons={GlobalService.tableIcons}
          options={{
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
          style={{ maxWidth: "90%", margin: "0 auto", marginTop: 25 }}
        />
      </div>
    );
  };
}

export default withSnackbar(withRouter(withStyles(useStyles)(StudentStatus)));
