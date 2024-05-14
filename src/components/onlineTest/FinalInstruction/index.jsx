import React from "react";
import axios from "axios";
import { Paper, Typography, Button, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { encryptText } from "../../../utils";
import { setQuestions } from "../../../store/slices/onlineTestSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const tutorialSteps = {
  heading: {
    old: "Ek aur baat:",
    en: "One More Thing:",
    hi: "एक और बात:",
    ma: "आणखी एक गोष्ट:",
  },
  content: {
    old: "Aapse ab test mein kuch questions pooche jaenge. Aapko answers araam se soch samajh kar dena hai.",
    en: "Now, you will be asked some questions in the test. Answer them carefully.",
    hi: "अब, आपसे परीक्षण में कुछ प्रश्न पूछे जाएंगे। उन्हें ध्यान से उत्तर दें।",
    ma: "आता तुम्हाला परीक्षेत काही प्रश्न विचारले जातील. त्यांना काळजीपूर्वक उत्तर द्या.",
  },
  imp1: {
    old: "Par time ka bhi khyaal rakhe!",
    en: "But also keep an eye on time",
    hi: "लेकिन समय का भी ध्यान रखें",
    ma: "पण वेळेवरही लक्ष ठेवा",
  },
  imp2: {
    old: "Aapko next 18 questions, 1 Hour 30 Minutes me karne hai!",
    en: "You have to answer 18 questions in 1 Hour & 30 Minutes",
    hi: "आपको 1 घंटे और 30 मिनट में 18 प्रश्नों के उत्तर देने हैं",
    ma: "तुम्हाला 1 तास आणि 30 मिनिटांत 18 प्रश्नांची उत्तरे द्यावी लागतील",
  },
  button: {
    old: "Shuru karein",
    en: "Start the Test",
    hi: "शुरू करें",
    ma: "सुरू करा",
  },
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
  // const location = useLocation();
  const dispatch = useDispatch();
  const { enrollmentKey, studentId } = useSelector((state) => state.onlineTest);
  const { lang } = useSelector((state) => state.ui);

  // //1. Where we'll get time 00:00:00
  // const time = useRef(new Date().setSeconds(new Date().getSeconds() + 5400));

  const answerList = [];
  // const correctAnswerObj = {};

  const schoolId = history.state.usr.usr.schoolId;

  // localStorage.setItem("correctAnswerObj", JSON.stringify(correctAnswerObj));

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
      .get(
        school.length === 0
          ? `${baseUrl}on_assessment/questions/${enrollmentKey}`
          : `${baseUrl}on_assessment/questions/${enrollmentKey}?school=${schoolId}`
      )
      .then((res) => {
        dispatch(setQuestions(res.data.data));
        navigate(`/test/${enrollmentKey}/${studentId}`, {
          state: { answerList },
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
          <Typography variant="h4">{tutorialSteps.heading?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps.content?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.imp}>
          <Typography variant="h5">{tutorialSteps.imp1?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.imp}>
          <Typography variant="h5">{tutorialSteps.imp2?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.button}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={fetchQuestionsAndOptions}
          >
            {tutorialSteps.button?.[lang]}
          </Button>
        </Paper>
      </div>
    </Container>
  );
}

export default FinalInstruction;
