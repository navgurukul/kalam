import React, { useState, useRef } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import history from "../../utils/history";

const baseUrl = process.env.API_URL;

const tutorialSteps = {
  heading: "Ek aur baat:",
  content:
    "Aapse ab test mein kuch questions pooche jaenge. Aapko answers araam se soch samajh kar dena hai.",
  imp1: "Par time ka bhi khyaal rakhe!",
  imp2: "Aapko next 18 questions, 1 Hour me karne hai!",
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

function EkAurBaat(props) {
  console.log("Props in ek aur baat", props.location.enrolment_key);
  const classes = useStyles();

  // //1. Where we'll get time 00:00:00
  const time = useRef(new Date().setSeconds(new Date().getSeconds() + 5400));
  localStorage.setItem("time", time.current);
  console.log("time.current", time.current);
  // const Time = time.current;
  // console.log("Time before store in local storage", Time);
  // Time.setSeconds(Time.getSeconds() + 5400);
  // localStorage.setItem("Time", time.current);
  // const TIME = localStorage.getItem("Time");

  //2. Where we won't able to set localStorage in this component
  // const time = useRef(new Date());

  // //3. Where can set the localStorage but we can't add 90 min with Time.setSeconds(Time.getSeconds() + 5400);
  // const time = useRef(new Date());
  // const Time = time.current;
  // localStorage.setItem("Time", Time);
  // const TIME = localStorage.getItem("Time");

  // //We can't call getSecond function after set the time in localStorage.

  const answerList = [];
  let correctAnswerObj = {};

  localStorage.setItem("correctAnswerObj", JSON.stringify(correctAnswerObj));
  localStorage.setItem("index", 0);

  const enrolmentKey = location.pathname.split("/")[2];
  console.log("enrolmentKey", enrolmentKey);

  const fetchQuestionsAndOptions = () => {
    localStorage.setItem("answerObj", JSON.stringify(""));
    axios
      .post(`${baseUrl}on_assessment/questions/${enrolmentKey}`)
      .then((res) => {
        console.log("response", res.data.data);
        localStorage.setItem("questionsList", JSON.stringify(res.data.data));
        // localStorage.setItem("questionsList", res.data.data);
        history.push({
          pathname: `/questions/${enrolmentKey}`,
          // questions: res.data.data,
          // time: time.current, // 2nd point
          // time: TIME,   // 1st point and 3rd point
          answerList: answerList,
          // correctAnswerObj: correctAnswerObj,
        });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <Container maxWidth="lg" align="center" justifyContent="center">
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

export default EkAurBaat;

// import React, { useState, useRef } from "react";
// import axios from "axios";
// import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import Container from "@material-ui/core/Container";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
// import history from "../../utils/history";

// const baseUrl = process.env.API_URL;

// const tutorialSteps = {
//   heading: "Ek aur baat:",
//   content:
//     "Aapse ab test mein kuch questions pooche jaenge. Aapko answers araam se soch samajh kar dena hai.",
//   imp1: "Par time ka bhi khyaal rakhe!",
//   imp2: "Aapko next 18 questions, 1 Hour me karne hai!",
// };

// const useStyles = makeStyles((theme) => ({
//   root: {
//     maxWidth: 800,
//     paddingTop: theme.spacing(6),
//     paddingBottom: theme.spacing(3),
//   },
//   heading: {
//     paddingTop: theme.spacing(3),
//     backgroundColor: theme.palette.background.default,
//   },
//   content: {
//     paddingTop: theme.spacing(4),
//     paddingLeft: theme.spacing(8),
//     paddingRight: theme.spacing(8),
//     backgroundColor: theme.palette.background.default,
//   },
//   imp: {
//     paddingTop: theme.spacing(1),
//     paddingLeft: theme.spacing(8),
//     paddingRight: theme.spacing(8),
//     backgroundColor: theme.palette.background.default,
//   },
//   button: {
//     paddingTop: theme.spacing(2),
//     paddingLeft: theme.spacing(8),
//     paddingRight: theme.spacing(8),
//     paddingBottom: theme.spacing(3),
//     backgroundColor: theme.palette.background.default,
//   },
// }));

// function EkAurBaat(props) {
//   console.log("Props in ek aur baat", props.location.enrolment_key);
//   const classes = useStyles();

//   const time = useRef(new Date().setSeconds(new Date().getSeconds() + 5400));
//   localStorage.setItem("TIME", time.current);
//   const TIME = localStorage.getItem("TIME");
//   console.log("TIME", TIME, typeof TIME);

//   const answerList = [];
//   let correctAnswerObj = {};

//   const fetchQuestionsAndOptions = () => {
//     history.push({
//       pathname: "/questions",
//       time: parseInt(TIME), // 2nd point
//       // time: time.current,
//       answerList: answerList,
//       correctAnswerObj: correctAnswerObj,
//     });
//     // axios
//     //   .post(`${baseUrl}on_assessment/questions/${props.location.enrolment_key}`)
//     //   .then((res) => {
//     //     console.log("response", res.data.data);
//     //     history.push({
//     //       pathname: "/questions",
//     //       questions: res.data.data,
//     //       time: time.current, // 2nd point
//     //       // time: TIME,   // 1st point and 3rd point
//     //       answerList: answerList,
//     //       correctAnswerObj: correctAnswerObj,
//     //     });
//     //   })
//     //   .catch((err) => {
//     //     console.log("error", err);
//     //   });
//   };

//   return (
//     <Container maxWidth="lg" align="center" justifyContent="center">
//       <div className={classes.root}>
//         <Paper square elevation={0} className={classes.heading}>
//           <Typography variant="h4">{tutorialSteps.heading}</Typography>
//         </Paper>
//         <Paper square elevation={0} className={classes.content}>
//           <Typography>{tutorialSteps.content}</Typography>
//         </Paper>
//         <Paper square elevation={0} className={classes.imp}>
//           <Typography variant="h5">{tutorialSteps.imp1}</Typography>
//         </Paper>
//         <Paper square elevation={0} className={classes.imp}>
//           <Typography variant="h5">{tutorialSteps.imp2}</Typography>
//         </Paper>
//         <Paper square elevation={0} className={classes.button}>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             onClick={fetchQuestionsAndOptions}
//           >
//             Shuru karein
//           </Button>
//         </Paper>
//       </div>
//     </Container>
//   );
// }

// export default EkAurBaat;
