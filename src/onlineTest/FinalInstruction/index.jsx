import React from "react";
import axios from "axios";
import { Paper, Typography, Button, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { encryptText } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

const tutorialSteps = {
  heading: "Ek aur baat:",
  content:
    "Aapse ab test mein kuch questions pooche jaenge. Aapko answers araam se soch samajh kar dena hai.",
  imp1: "Par time ka bhi khyaal rakhe!",
  imp2: "Aapko next 18 questions, 1 Hour 30 Minutes me karne hai!",
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  heading: {
    paddingTop: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  content: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  },
  imp: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  },
  button: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
}));

function FinalInstruction() {
  //console.log("Props in ek aur baat", props.location.enrolment_key);
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const { enrollmentKey, studentId } = location.state;

  // //1. Where we'll get time 00:00:00
  // const time = useRef(new Date().setSeconds(new Date().getSeconds() + 5400));
  //console.log("time.current", time.current);

  const answerList = [];
  // const correctAnswerObj = {};

  // localStorage.setItem("correctAnswerObj", JSON.stringify(correctAnswerObj));

  //console.log("enrolmentKey", enrolmentKey);

  const fetchQuestionsAndOptions = () => {
    // localStorage.setItem("answerObj", JSON.stringify(""));
    if (!localStorage.getItem("index"))
      localStorage.setItem("index", encryptText(`0`));
    if (!localStorage.getItem("time"))
      localStorage.setItem(
        "time",
        encryptText(`${new Date().setSeconds(new Date().getSeconds() + 5400)}`)
      );
    axios
      .get(`${baseUrl}on_assessment/questions/${enrollmentKey}`)
      .then((res) => {
        //console.log("response", res.data.data);
        // localStorage.setItem("questionsList", JSON.stringify(res.data.data));
        // localStorage.setItem("questionsList", res.data.data);
        navigate(`/test/${enrollmentKey}/${studentId}`, {
          // questions: res.data.data,
          // time: time.current, // 2nd point
          // time: TIME,   // 1st point and 3rd point
          state: { answerList, questionsList: res.data.data },
          // correctAnswerObj: correctAnswerObj,
        });
      })
      .catch(() => {
        // console.error(err);
      });
  };

  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.heading}>
          <Typography variant="h4">{tutorialSteps.heading}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps.content}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.imp}>
          <Typography variant="h5">{tutorialSteps.imp1}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.imp}>
          <Typography variant="h5">{tutorialSteps.imp2}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.button}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={fetchQuestionsAndOptions}
          >
            Shuru karein
          </Button>
        </Paper>
      </div>
    </Container>
  );
}

export default FinalInstruction;
