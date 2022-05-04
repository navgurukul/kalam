/* eslint-disable prefer-destructuring */
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button, Dialog, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";

import EditIcon from "@mui/icons-material/Edit";
import { changeFetching } from "../../store/slices/uiSlice";
import { decryptText } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const StudentFeedback = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [state, setState] = React.useState({
    feedback: "",
    dialogOpen: false,
  });
  const addFeedbck = async () => {
    try {
      fetchingStart();
      const { change, rowMetaTable } = props;
      const { rowData, columnIndex } = rowMetaTable;
      let studentId;

      if (window.location.pathname.includes("/campus")) {
        studentId = rowData[7];
      } else {
        studentId = rowData[5];
      }
      const userId = parseInt(decryptText(localStorage.getItem("userId")), 10);

      const dataURL = `${baseUrl}students/feedback/${studentId}/${userId}`;
      await axios
        .post(dataURL, {
          student_stage: rowData[0],
          feedback: state.feedback,
        })
        .then(() => {
          //console.log(response.data);
          setState({
            ...state,
            dialogOpen: false,
          });
          snackbar.enqueueSnackbar("Feedback is successfully added!", {
            variant: "success",
          });
          change(state.feedback, columnIndex);
        });

      fetchingFinish();
    } catch (e) {
      snackbar.enqueueSnackbar("Please select student Status", {
        variant: "error",
      });
      fetchingFinish();
    }
  };

  const onSubmit = () => {
    setState({
      ...state,
      loading: true,
    });
    addFeedbck();
  };

  // const validate = () => {};

  const handleChange = (name) => (event) => {
    const valChange = {};
    valChange[name] = event.target.value;

    setState({ ...state, [name]: event.target.value });
  };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      dialogOpen: true,
    });
  };
  const addFeedbackDetails = (feedback) => {
    const time = new Date();
    const month = time.getMonth() + 1;

    const currentUser = `@${
      loggedInUser
        ? loggedInUser.user_name.toString().split(" ").join("").toLowerCase()
        : "guest"
    }`;
    const feedbackTime = `Feedback date ${time.getDate()}/${month}/${time.getFullYear()}`;
    return feedback
      ? `${currentUser}: ${feedbackTime}\n\n${feedback}`
      : `${currentUser}: ${feedbackTime}\n\n`;
  };

  const { feedback } = props;

  return (
    <>
      <Box onClick={handleOpen}>
        <EditIcon style={{ cursor: "pointer" }} />
      </Box>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <form className={classes.container}>
          <h1 style={{ color: "#f05f40", textAlign: "center" }}>
            Add Feedback
          </h1>
          <TextField
            id="outlined-multiline-static"
            label="Feedback"
            multiline
            rows="6"
            name="feedback"
            defaultValue={addFeedbackDetails(feedback)}
            onChange={handleChange("feedback")}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.btn}
          >
            Submit Feedback
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default StudentFeedback;
