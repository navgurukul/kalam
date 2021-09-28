import "date-fns";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Modal, Button, Grid } from "@material-ui/core";

import CancelIcon from "@material-ui/icons/Cancel";

import { connect } from "react-redux";
import axios from "axios";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import { theme } from "../theme/theme";
import { changeFetching } from "../store/actions/auth";
import { withRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";

import GlobalService from "../services/GlobalService";
import StudentService from "../services/StudentService";
import DetailsIcon from "@material-ui/icons/Details";
import StudentContact from "./StudentContact";
import Loader from "./Loader";
import DeleteStudentDetails from "./DeleteStudentDetails";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

function getModalStyle() {
  const top = 50; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "90vh",
    width: "90%",
  };
}

const styles = (theme) => ({
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
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: "22px",
      },
    },
  },
});

export class Transition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      contacts: [],
      modalOpen: false,
      showLoader: true,
    };
  }

  transitionsChangeEvent = () => {
    this.fetchtransition();
  };

  async fetchtransition() {
    try {
      this.transitionURL = `${baseURL}students/transitionsWithFeedback/${this.props.studentId}`;
      this.props.fetchingStart();
      const response = await axios.get(this.transitionURL, {});
      let newData;
      if (this.props.loggedInUser) {
        newData = response.data.data.map((v) => ({
          ...v,
          loggedInUser: this.props.loggedInUser,
        }));
      } else {
        newData = response.data.data.map((v) => ({
          ...v,
        }));
      }
      this.setState(
        {
          data: newData,
          contacts: response.data.contacts,
          showLoader: false,
        },
        this.props.fetchingFinish
      );
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  };

  handleOpen = () => {
    this.fetchtransition();
    this.setState({
      modalOpen: true,
    });
  };

  render = () => {
    const { classes, studentName, studentId, location } = this.props;
    const modalStyle = getModalStyle();
    return !this.state.modalOpen ? (
      <div>
        <Button color="primary" align="right" onClick={this.handleOpen}>
          <DetailsIcon color="primary" />
        </Button>
      </div>
    ) : (
      <Modal open={this.state.modalOpen} onClose={this.handleClose}>
        <Box style={modalStyle} className={classes.paper}>
          <MuiThemeProvider theme={theme}>
            <Box display="flex" justifyContent="space-between" pt={4}>
              <Grid
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Typography variant="h6" id="modal-title">
                  Student Name:- {studentName} (studentId {studentId})
                </Typography>
                <br />
                <StudentContact
                  studentId={studentId}
                  contacts={this.state.contacts}
                  closeTransition={this.handleClose}
                />
                <DeleteStudentDetails
                  studentId={studentId}
                  handleClose={this.handleClose}
                  pathname={location.pathname}
                  studentName = {studentName}
                />
              </Grid>
              <Box onClick={this.handleClose}>
                <CancelIcon />
              </Box>
            </Box>
            <MUIDataTable
              columns={StudentService.columns[this.props.dataType]}
              data={this.state.data}
              icons={GlobalService.tableIcons}
              options={{
                headerStyle: {
                  color: theme.palette.primary.main,
                },
                textLabels: {
                  body: {
                    noMatch: this.state.showLoader ? (
                      <Loader />
                    ) : (
                      "Sorry, there is no matching data to display"
                    ),
                  },
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
          </MuiThemeProvider>
        </Box>
      </Modal>
    );
  };
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser,
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withRouter(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Transition))
);
