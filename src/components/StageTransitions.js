import "date-fns";
import React from "react";
import { Modal, Button, Grid } from "@material-ui/core";

import CancelIcon from "@material-ui/icons/Cancel";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Box from "@material-ui/core/Box";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import { theme } from "../theme/theme";
import { changeFetching } from "../store/actions/auth";
import { useHistory } from "react-router-dom";
import { ThemeProvider, makeStyles } from "@material-ui/styles";
import GlobalService from "../services/GlobalService";
import StudentService from "../services/StudentService";
import DetailsIcon from "@material-ui/icons/Details";
import StudentContact from "./StudentContact";
import Loader from "./Loader";
import DeleteStudentDetails from "./DeleteStudentDetails";
import { campusStageOfLearning } from "../config";
import OutreachData from "./OutreachData";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const getModalStyle = () => {
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
};

const useStyles = makeStyles((theme) => ({
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
}));

export const StageTransitions = (props) => {
  const classes = useStyles();
  const { location } = useHistory();
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [state, setState] = React.useState({
    data: [],
    contacts: [],
    modalOpen: false,
    showLoader: true,
    toggleOutreach: false,
    joinedStudentData: [],
    joinedOutreachData: [],
  });

  const fetchtransition = async () => {
    try {
      const transitionURL = `${baseURL}students/transitionsWithFeedback/${props.studentId}`;
      fetchingStart();
      const response = await axios.get(transitionURL, {});
      let newData;
      let joinedStudent = [];
      let joinedOutreach = [];
      const campusMilestoneKey = Object.keys(campusStageOfLearning);

      if (loggedInUser) {
        newData = response.data.data.map((v) => {
          if (campusMilestoneKey.indexOf(v.to_stage) !== -1) {
            joinedStudent.push(v);
          } else {
            joinedOutreach.push(v);
          }
          return {
            ...v,
            loggedInUser,
          };
        });
      } else {
        newData = response.data.data.map((v) => {
          if (campusMilestoneKey.indexOf(v.to_stage) !== -1) {
            joinedStudent.push(v);
          } else {
            joinedOutreach.push(v);
          }
          return {
            ...v,
          };
        });
      }

      let locationCampus = location.pathname.split("/")[1];
      if (locationCampus === "campus") {
        newData = joinedStudent;
      }

      setState((prevState) => ({
        ...prevState,
        data: newData,
        joinedStudentData: joinedStudent,
        joinedOutreachData: joinedOutreach,
        contacts: response.data.contacts,
        showLoader: false,
      }));
      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: false,
    }));
  };

  const handleOpen = () => {
    fetchtransition();
    setState((prevState) => ({
      ...prevState,
      modalOpen: true,
    }));
  };

  const handleChange = () => {
    setState((prevState) => ({
      ...prevState,
      toggleOutreach: !prevState.toggleOutreach,
      data: prevState.toggleOutreach
        ? prevState.joinedStudentData
        : prevState.joinedOutreachData,
    }));
  };

  const style = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "120%",
    marginBottom: "10px",
    minHeight: "40px",
    maxHeight: "140px",
    flexWrap: "wrap",
  };
  const { studentName, studentId, isShow } = props;
  let campusPath = location.pathname.split("/")[1];

  const modalStyle = getModalStyle();
  return !state.modalOpen ? (
    <div>
      {isShow ? (
        <p
          onClick={handleOpen}
          style={{
            fontSize: 17,
            fontStyle: "italic",
            fontFamily: ("Roboto", "Helvetica", "Arial"),
            cursor: "pointer",
            display: "inline",
          }}
          onMouseOver={(e) => {
            e.target.style.color = "red";
          }}
          onMouseOut={(e) => {
            e.target.style.color = "black";
          }}
        >
          {studentName}{" "}
        </p>
      ) : (
        <Button color="primary" align="right" onClick={handleOpen}>
          <DetailsIcon color="primary" />
        </Button>
      )}
    </div>
  ) : (
    <Modal open={state.modalOpen} onClose={handleClose}>
      <Box style={modalStyle} className={classes.paper}>
        <ThemeProvider theme={theme}>
          <Box display="flex" justifyContent="space-between" pt={4}>
            <Grid
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
            >
              <Typography variant="h6" id="modal-title">
                Student Name:- {studentName}
              </Typography>
              <br />
              <div className="transition-tools" style={style}>
                <StudentContact
                  studentId={studentId}
                  contacts={state.contacts}
                  closeTransition={handleClose}
                />

                {campusPath === "campus" ? (
                  <OutreachData onChange={handleChange} />
                ) : null}
                <DeleteStudentDetails
                  studentId={studentId}
                  handleClose={handleClose}
                  pathname={location.pathname}
                  studentName={studentName}
                />
              </div>
            </Grid>
            <Box style={{ cursor: "pointer" }} onClick={handleClose}>
              <CancelIcon />
            </Box>
          </Box>
          <MUIDataTable
            columns={StudentService.columns[props.dataType]}
            data={state.data}
            icons={GlobalService.tableIcons}
            options={{
              headerStyle: {
                color: theme.palette.primary.main,
              },
              textLabels: {
                body: {
                  noMatch: state.showLoader ? (
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
        </ThemeProvider>
      </Box>
    </Modal>
  );
};

// const mapStateToProps = (state) => ({
//   loggedInUser: state.auth.loggedInUser,
// });

// const mapDispatchToProps = (dispatch) => ({
//   fetchingStart: () => dispatch(changeFetching(true)),
//   fetchingFinish: () => dispatch(changeFetching(false)),
// });

// export default withRouter(
//   withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Transition))
// );

export default StageTransitions;
