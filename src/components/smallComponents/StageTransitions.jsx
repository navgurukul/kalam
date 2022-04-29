import "date-fns";
import React from "react";
import { Modal, Grid, Box, Typography, IconButton } from "@mui/material";
import { ThemeProvider, makeStyles } from "@mui/styles";

import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { useLocation } from "react-router-dom";
import theme from "../../theme";
import { changeFetching } from "../../store/slices/uiSlice";
import GlobalService from "../../services/GlobalService";
// eslint-disable-next-line import/no-cycle
import StudentService from "../../services/StudentService";
import StudentContact from "../contact/StudentContact";
import Loader from "../ui/Loader";
// eslint-disable-next-line import/no-cycle
import DeleteStudentDetails from "./DeleteStudentDetails";
import OutreachData from "../outreach/OutreachData";
import { campusStageOfLearning } from "../../utils/constants";

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = import.meta.env.VITE_API_URL;

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

const useStyles = makeStyles((_theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [_theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: _theme.palette.background.paper,
    boxShadow: _theme.shadows[5],
    padding: _theme.spacing(4),
    outline: "none",
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: "22px",
      },
    },
  },
  transitionIcon: {
    transform: "rotate(-180deg)",
  },
}));

const StageTransitions = (props) => {
  const classes = useStyles();
  const location = useLocation();
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
    const { studentId } = props;
    try {
      const transitionURL = `${baseURL}students/transitionsWithFeedback/${studentId}`;
      fetchingStart();
      const response = await axios.get(transitionURL, {});
      let newData;
      const joinedStudent = [];
      const joinedOutreach = [];
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

      const locationCampus = location.pathname.split("/")[1];
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
  const campusPath = location.pathname.split("/")[1];

  const modalStyle = getModalStyle();
  const { dataType } = props;
  return !state.modalOpen ? (
    <div>
      {isShow ? (
        <Typography
          variant="body1"
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
          onFocus={(e) => {
            e.target.style.color = "red";
          }}
          onBlur={(e) => {
            e.target.style.color = "black";
          }}
          onMouseOut={(e) => {
            e.target.style.color = "black";
          }}
        >
          {studentName}{" "}
        </Typography>
      ) : (
        <IconButton color="primary" align="right" onClick={handleOpen}>
          <ChangeHistoryIcon
            className={classes.transitionIcon}
            color="primary"
          />
        </IconButton>
      )}
    </div>
  ) : (
    <Modal open={state.modalOpen} onClose={handleClose}>
      <Box style={modalStyle} className={classes.paper}>
        <ThemeProvider theme={theme}>
          <Box display="flex" justifyContent="space-between" pt={4}>
            <Grid
              container
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
            columns={StudentService.columns[dataType]}
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
              filterType: "dropdown",
              responsive: "vertical",
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
