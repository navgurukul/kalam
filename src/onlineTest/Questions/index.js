import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import history from "../../utils/history";
import Timer from "./Timer";

const tutorialSteps = {
  content1: "Yeh Question no. ",
  content2:
    "(out of 18 questions) Aapne 0 questions already attempt kar liye hai!",
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  content: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
  },
  optionButton: {
    marginBottom: theme.spacing(2),
  },
  options: {
    backgroundColor: theme.palette.background.default,
  },
}));

function Questions(props) {
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  // const time = new Date();
  // // store this time in localStorage every second and get it from localStorage and pass it as props
  // time.setSeconds(time.getSeconds() + 5400);
  // localStorage.setItem("Time", new Date().getTime());
  // const MyTime = localStorage.getItem("Time");

  let [time, setTime] = useState(props.location.time);
  let [timeLeft, setTimeLeft] = useState(new Date() + 90 * 60 * 1000);
  useEffect(() => {
    console.log(timeLeft);
    localStorage.setItem("TIME", timeLeft);
  });

  console.log("time", time);

  setTimeout(() => {
    setTimeLeft(time + 90 * 60 * 1000 - new Date().getTime());
  }, 1000);

  const [value, setValue] = useState({
    one: "",
    two: "",
  });

  const changeHandler = (e) => {
    setValue(e.target.value);
  };

  console.log("value", value);

  const previousClickHandler = () => {
    setIndex(index - 1);
  };

  const nextClickHandler = () => {
    setIndex(index + 1);
  };

  const submitHandler = () => {
    console.log("I love you Poonam!");
    // history.push({ pathname: "/totalMarks" });
    history.push({
      pathname: "/kuchAurDetails",
      enrolment_key: props.location.enrolment_key,
    });
  };

  console.log("props.location.questions", props.location.questions);

  const questionsList = props.location.questions;
  const en_text = DOMPurify.sanitize(questionsList[index].en_text);
  const hi_text = DOMPurify.sanitize(questionsList[index].hi_text);
  const common_text = DOMPurify.sanitize(questionsList[index].common_text);

  return (
    <Container maxWidth="lg" align="center" justifyContent="center">
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.content}>
          <Typography variant="subtitle1">
            {tutorialSteps.content1}
            {index + 1} {tutorialSteps.content2}
          </Typography>
          <Typography variant="subtitle1">
            {/* <Timer expiryTimestamp={parseInt(MyTime) + 90 * 60 * 1000} /> */}
            <Timer time={localStorage.getItem("TIME")} />
          </Typography>
          <Typography variant="subtitle1">
            <div dangerouslySetInnerHTML={{ __html: en_text }} />
          </Typography>
          {/* <Typography variant="subtitle1">
            <div dangerouslySetInnerHTML={{ __html: hi_text }} />
          </Typography> */}
          <Typography variant="subtitle1">
            <div dangerouslySetInnerHTML={{ __html: common_text }} />
          </Typography>
          {questionsList[index].options.length > 1
            ? questionsList[index].options.map((option, i) => {
                const options = DOMPurify.sanitize(option.text);
                console.log("Options", options);
                return (
                  <Paper square elevation={0} className={classes.options}>
                    <Typography variant="subtitle1" key="i">
                      {i + 1} {"."}{" "}
                      <button
                        className={classes.optionButton}
                        dangerouslySetInnerHTML={{ __html: options }}
                      />
                    </Typography>
                  </Paper>
                );
              })
            : null}
          <TextField
            variant="outlined"
            required
            fullWidth
            // id="name"
            className={classes.spacing}
            // label="Your name"
            placeholder="Write your answere here..."
            value={value.one}
            name="name"
            autoComplete="off"
            onChange={changeHandler}
          />

          {index == 17 ? (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={previousClickHandler}
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={previousClickHandler}
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={nextClickHandler}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      </div>
    </Container>
  );
}

export default Questions;
