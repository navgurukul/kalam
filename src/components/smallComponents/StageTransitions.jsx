import "date-fns";
import React from "react";
import { Modal, Grid, Box, Typography, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

import CancelIcon from "@mui/icons-material/Cancel";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import { useLocation } from "react-router-dom";
import theme from "../../theme";
import { changeFetching } from "../../store/slices/uiSlice";
import { setSelectedStudent } from "../../store/slices/studentSlice";
import { tableIcons } from "../../services/GlobalService";
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

const StageTransitions = ({ studentName, studentId, isShow, dataType }) => {
  const classes = useStyles();
  const location = useLocation();

  const { loggedInUser } = useSelector((state) => state.auth);
  const { selectedStudent } = useSelector((state) => state.students);

  const dispatch = useDispatch();
  const setTransitions = (transitions) =>
    dispatch(setSelectedStudent({ studentId, transitions }));
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));

  const [modalOpen, setModalOpen] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [toggleOutreach, setToggleOutreach] = React.useState(false);
  const [data, setData] = React.useState({
    joinedStudentData: [],
    joinedOutreach: [],
  });

  const fetchtransition = async () => {
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
          if (campusMilestoneKey.indexOf(v.to_stage) !== -1)
            joinedStudent.push(v);
          else joinedOutreach.push(v);

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

      setTransitions(newData);

      setData({
        joinedStudentData: joinedStudent,
        joinedOutreachData: joinedOutreach,
      });
      setContacts(response.data.contacts);
      setLoading(false);

      fetchingFinish();
    } catch (e) {
      fetchingFinish();
    }
  };

  const handleClose = () => setModalOpen(false);

  const handleOpen = () => {
    fetchtransition();
    setModalOpen(true);
  };

  const handleChange = () => {
    setTransitions(
      toggleOutreach ? data.joinedStudentData : data.joinedOutreachData
    );
    setToggleOutreach((prevData) => !prevData);
  };

  const campusPath = location.pathname.split("/")[1];

  const modalStyle = getModalStyle();
  const options = {
    headerStyle: {
      color: theme.palette.primary.main,
    },
    textLabels: {
      body: {
        noMatch: loading ? (
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
  };

  return (
    <>
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
          {studentName}
        </Typography>
      ) : (
        <IconButton color="primary" align="right" onClick={handleOpen}>
          <ChangeHistoryIcon
            className={classes.transitionIcon}
            color="primary"
          />
        </IconButton>
      )}
      <Modal open={modalOpen} onClose={handleClose}>
        <Box style={modalStyle} className={classes.paper}>
          <Box display="flex" justifyContent="space-between" pt={2}>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <Typography variant="h5" id="modal-title">
                  Student Name:- {studentName}
                </Typography>
              </Grid>
              <Grid item xs={2} display="flex">
                {campusPath === "campus" ? (
                  // <Grid item xs={4}>
                  <OutreachData onChange={handleChange} />
                ) : // </Grid>
                null}
                <StudentContact
                  studentId={studentId}
                  contacts={contacts}
                  closeTransition={handleClose}
                  studentName={studentName}
                />
                <DeleteStudentDetails
                  studentId={studentId}
                  closeModal={handleClose}
                  pathname={location.pathname}
                  studentName={studentName}
                />
              </Grid>
            </Grid>
            <Box display="flex" alignItems="flex-start">
              <IconButton
                sx={{ padding: 0, margin: 0, py: 0 }}
                size="small"
                onClick={handleClose}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          </Box>
          <MUIDataTable
            columns={StudentService.columns[dataType]}
            data={selectedStudent?.transitions || []}
            icons={tableIcons}
            options={options}
          />
        </Box>
      </Modal>
    </>
  );
};

export default StageTransitions;
