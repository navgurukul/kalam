/* eslint-disable prefer-destructuring */
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button, Dialog, IconButton, Typography } from "@mui/material";
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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [feedbackValue, setFeedbackValue] = React.useState("");
  const [feedbackType, setFeedbackType] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { feedback } = props;

  const addFeedbck = async () => {
    try {
      fetchingStart();
      const { change, rowMetaTable } = props;
      const { rowData } = rowMetaTable;
      let studentId;

      if (window.location.pathname.includes("/campus")) {
        studentId = rowData[10];
      } else {
        studentId = rowData[8];
      }

      const userId = parseInt(decryptText(localStorage.getItem("userId")), 10);
      const dataURL = `${baseUrl}students/feedback/${studentId}/${userId}`;
      await axios.post(dataURL, {
        student_stage: rowData[0],
        feedback: feedbackValue,
        feedback_type: feedbackType,
      });

      setDialogOpen(false);
      enqueueSnackbar("Feedback is successfully added!", { variant: "success" });

      change(
        feedback
          ? feedbackType === "edit"
            ? feedbackValue
            : `${feedbackValue}\n\n${feedback}`
          : feedbackValue
      );

      fetchingFinish();
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Please select student Status", { variant: "error" });
      fetchingFinish();
    }
  };

  const onSubmit = () => addFeedbck();

  const handleChange = (event) => {
    setFeedbackValue(event.target.value);
  };

  const handleClose = () => setDialogOpen(false);

  const handleOpen = (type) => {
    setFeedbackType(type);
    setDialogOpen(true);
  };

  const addFeedbackDetails = (feedback) => {
    const time = new Date();
    const month = time.getMonth() + 1;
    const currentUser = `@${
      loggedInUser?.user_name?.toString().split(" ").join("").toLowerCase() || "guest"
    }`;
    const feedbackTime = `Feedback date ${time.getDate()}/${month}/${time.getFullYear()}`;

    return feedbackType === "edit"
      ? `${feedback}\n\n`
      : `${currentUser}: ${feedbackTime}\n\n`;
  };

  return (
    <>
      <Button onClick={() => handleOpen("add")} style={{ textTransform: "none" }}>
        <EditIcon style={{ width: "10%" }} />
        <Typography style={{ fontWeight: "700", marginLeft: "5px" }}>
          Add Feedback
        </Typography>
      </Button>

      {feedback && (
        <>
          {/* <Button onClick={() => handleOpen("edit")} style={{ textTransform: "none" }}>
            <EditIcon style={{ width: "10%" }} />
            <Typography style={{ fontWeight: "700", marginLeft: "5px" }}>
              Edit Feedback
            </Typography>
          </Button> */}

          <Typography
            sx={{
              color: "#3f51b5",
              mt: 1,
              ml: 0.5,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontStyle: "normal",
            }}
            onClick={() => {
              setFeedbackType("view");
              setDialogOpen(true);
            }}
          >
            {feedback.split("\n\n")[0]}
          </Typography>
        </>
      )}

      <Dialog open={dialogOpen} onClose={handleClose}>
        {feedbackType === "add" || feedbackType === "edit" ? (
          <form className={classes.container}>
            <h1 style={{ color: "#f05f40", textAlign: "center" }}>
              {feedbackType === "edit" ? "Edit Feedback" : "Add Feedback"}
            </h1>
            <TextField
              id="outlined-multiline-static"
              label="Feedback"
              multiline
              rows="6"
              name="feedback"
              defaultValue={addFeedbackDetails(feedback)}
              onChange={handleChange}
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
        ) : (
          <div
            style={{
              padding: "1.5rem",
              maxWidth: 600,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "10px",
                borderBottom: "1px dashed #999",
                paddingBottom: "5px",
              }}
            >
              Full Feedback
            </Typography>

            {/* Render all feedback blocks properly */}
            {feedback
              ?.trim()
              ?.split("\n\n")
              ?.reduce((acc, curr, index, arr) => {
                if (index % 2 === 0) {
                  acc.push({ author: curr, content: arr[index + 1] || "" });
                }
                return acc;
              }, [])
              ?.map((block, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px dashed #ddd",
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginBottom: "0.5rem",
                      color: "#444",
                    }}
                  >
                    {block.author}
                  </Typography>
                  <Typography
                    style={{
                      whiteSpace: "pre-line",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#333",
                    }}
                  >
                    {block.content}
                  </Typography>
                </div>
              )) || <Typography>No feedback available.</Typography>}

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setFeedbackType("edit");
                }}
              >
                Edit Feedback
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default StudentFeedback;
