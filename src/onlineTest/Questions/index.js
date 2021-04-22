import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

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
}));

function Questions(props) {
  const classes = useStyles();
  const [index, setIndex] = useState(1);

  const questionsList = props.location.questions;
  console.log("data came from ek aur baat", questionsList);

  questionsList.map((question) => {
    console.log("Okay!", question);
  });

  console.log("Ho rha h kya", questionsList[4].en_text);

  const enText = questionsList[index].en_text.split("<p>");
  let en_text = "";
  enText.map((question) => {
    console.log("Kya aata h dekhna hai", question.split("</p>"));
    const enQuestion = question.split("</p>")[0];
    en_text = en_text + enQuestion + " ";
    // en_text = en_text + enQuestion.split("<strong>")[0] + " "
  });
  console.log("final", en_text);

  const hiText = questionsList[index].hi_text.split("<p>");
  let hi_text = "";
  hiText.map((question) => {
    console.log("Kya aata h dekhna hai", question.split("</p>"));
    const hiQuestion = question.split("</p>")[0];
    hi_text = hi_text + hiQuestion + " ";
    // hi_text = hi_text + hiQuestion.split("<strong>")[0] + " "
  });
  console.log("string done", hi_text);

  let common_text = "";
  if (questionsList[index].common_text == null) {
    common_text = null;
  } else {
    const commonText = questionsList[index].common_text.split("<p>");
    commonText.map((question) => {
      console.log("Kya aata h dekhna hai", question.split("</p>"));
      common_text = common_text + question.split("</p>")[0] + " ";
    });
    console.log("string done", common_text);
  }

  questionsList[index].options.length > 0
    ? questionsList[index].options.map((option, i) => {
        console.log("Our options are ready", option.text, i + 1);
      })
    : null;

  const previousClickHandler = () => {
    console.log("Previous click", 3);
    setIndex(index - 1);
  };

  const nextClickHandler = () => {
    console.log("Next click", 3);
    setIndex(index + 1);
  };

  const purifiedHTML = DOMPurify.sanitize(questionsList[index].en_text);

  return (
    <Container maxWidth="lg" align="center" justifyContent="center">
      <div className={classes.root}>
        <div dangerouslySetInnerHTML={{ __html: purifiedHTML }} />

        {/* <Paper square elevation={0} className={classes.content}>
                    <Typography variant="h7">{tutorialSteps.content1}{index}{" "}{tutorialSteps.content2}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.content}>
                    <Typography variant="h7">{questionsList[index].en_text}</Typography>
                    <Typography variant="h7">{en_text}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.content}>
                    <Typography variant="h7">{questionsList[index].hi_text}</Typography>
                    <Typography variant="h7">{hi_text}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.content}>
                    <Typography variant="h7">{questionsList[index].common_text}</Typography>
                    <Typography variant="h7">{common_text}</Typography>
                </Paper>  */}
        {questionsList[index].options.length > 1
          ? questionsList[index].options.map((option, i) => (
              <Paper square elevation={0} className={classes.content}>
                <Typography variant="h7" key="i">
                  {i + 1}
                  {"."} {option.text}
                </Typography>
              </Paper>
            ))
          : null}
        <Paper square elevation={0} className={classes.content}>
          <TextField
            variant="outlined"
            required
            fullWidth
            // id="name"
            className={classes.spacing}
            // label="Your name"
            placeholder="Write your answere here..."
            // value={values.name}
            name="name"
            autoComplete="off"
            // onChange={changeHandler}
          />
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
        </Paper>
      </div>
    </Container>
  );
}

export default Questions;
