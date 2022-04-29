import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";
import history from "../../utils/history";
import Timer from "./Timer";
import set from "date-fns/esm/set";
import axios from "axios";
import ThankYouPage from "../ThankYouPage";
import SorryPage from "../SorryPage";
const baseUrl = process.env.API_URL;
const tutorialSteps = {
  content1: "Yeh Question no. ",
  content2: "(out of 18 questions) Aapne  ",
  content3: "questions already attempt kar liye hai!",
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
  const snackbar = useSnackbar();
  const classes = useStyles();
  const [index, setIndex] = useState(null);
  const [answerObj, setAnswerObj] = useState({});
  const [questionId, setQuestionId] = useState("");
  const Time = localStorage.getItem("time");
  const time = new Date(JSON.parse(Time));
  const questionsList = JSON.parse(localStorage.getItem("questionsList"));
  const [answerList, setAnswerList] = useState({});
  const [result, setResult] = useState({
    success: false,
    done: false,
    total_marks: "",
  });
  useEffect(() => {
    if (index !== null) {
      localStorage.setItem("index", JSON.stringify(index));
    }
  }, [index]);
  useEffect(() => {
    //console.log("Answer List", answerList);
  }, [answerList]);

  useEffect(() => {
    setIndex(JSON.parse(localStorage.getItem("index")));
    setAnswerObj(JSON.parse(localStorage.getItem("answerObj")));
    // console.log(JSON.parse(localStorage.getItem("index")));
    let questionNumbers = [];
    questionsList.map((question, index) => {
      questionNumbers.push(question.id);
    });
    let data = questionNumbers.reduce((acc, curr) => {
      acc[curr] = "";
      return acc;
    }, {});
    setAnswerList(data);
    //console.log("answerList", data);
  }, []);

  const correctAnswerObj = JSON.parse(localStorage.getItem("correctAnswerObj"));

  // const answerList = props.location.answerList;

  const changeHandler = (e, question_id) => {
    setAnswerObj({ ...answerObj, [question_id]: e.target.value });
    setQuestionId(e.target.name);
    setAnswerList({ ...answerList, [question_id]: e.target.value });
  };

  const previousClickHandler = () => {
    setIndex(index - 1);
  };

  const nextClickHandler = () => {
    setIndex(index + 1);
    localStorage.setItem("answerObj", JSON.stringify({ ...answerObj }));
    //console.log("answerObj", answerObj);

    //console.log("correctAnswerObj in nextClickHandler ", correctAnswerObj);

    let correctAnswer;
    questionsList[index].options.length > 0
      ? questionsList[index].options.map((option, i) => {
          const options = DOMPurify.sanitize(option.text);
          option.correct ? (correctAnswer = options) : null;
          correctAnswerObj[questionsList[index].id] = correctAnswer;
          localStorage.setItem(
            "correctAnswerObj",
            JSON.stringify({ ...correctAnswerObj })
          );
        })
      : null;

    localStorage.setItem("answerList", JSON.stringify({ ...answerList }));
  };

  //console.log("answerObj", answerObj);
  //console.log("correctAnswerObj", correctAnswerObj);

  const submitHandler = () => {
    let correctAnswer;
    {
      questionsList[index].options.length > 0
        ? questionsList[index].options.map((option, i) => {
            const options = DOMPurify.sanitize(option.text);
            option.correct ? (correctAnswer = options) : null;
            correctAnswerObj[questionsList[index].id] = correctAnswer;
            localStorage.setItem(
              "correctAnswerObj",
              JSON.stringify({ ...correctAnswerObj })
            );
          })
        : null;
    }

    fetch(
      `${baseUrl}on_assessment/questions/${
        location.pathname.split("/")[2]
      }/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: localStorage.getItem("answerList"),
      }
    )
      .then((res) => {
        fetch(
          `${baseUrl}on_assessment/Show_testResult/${
            location.pathname.split("/")[2]
          }`,
          {
            method: "GET",
          }
        ).then((res) => {
          res.json().then((data) => {
            //console.log("data", data);
            setResult({
              ...result,
              total_marks: data.total_marks,
            });
            if (data.Result === "Failed") {
              setResult({
                ...result,
                done: true,
                success: false,
              });
            } else {
              setResult({
                ...result,
                done: true,
                success: true,
              });
            }
          });
        });
      })
      .catch((err) => {
        //console.log("error", err);
      });
  };

  const isEqual = (answerObj, correctAnswerObj) => {
    //console.log("answerObj in isEqual", answerObj);
    const userAnswerKey = Object.keys(answerObj);
    const correctAnswerKey = Object.keys(correctAnswerObj);

    let correctAnswerCount = 0;
    for (const key of userAnswerKey) {
      if (answerObj[key] === correctAnswerObj[key]) {
        correctAnswerCount++;
      }
    }
    return correctAnswerCount;
  };

  if (index !== null) {
    //console.log("questionsList inside the condition", questionsList);
    const en_text = DOMPurify.sanitize(questionsList[index].en_text);
    const hi_text = DOMPurify.sanitize(questionsList[index].hi_text);
    const common_text = DOMPurify.sanitize(questionsList[index].common_text);
    const question_id = questionsList[index].id;

    return (
      <>
        {result.done ? (
          result.success ? (
            <ThankYouPage
              total_marks={result.total_marks}
              userID={location.pathname.split("/")[3]}
            />
          ) : (
            <SorryPage total_marks={result.total_marks} />
          )
        ) : (
          <>
            <Container maxWidth="lg" align="center" justifyContent="center">
              <div className={classes.root}>
                <Paper square elevation={0} className={classes.content}>
                  <Typography variant="subtitle1">
                    {tutorialSteps.content1}
                    {index + 1} {tutorialSteps.content2} {index}{" "}
                    {tutorialSteps.content3}
                  </Typography>
                  <Typography variant="subtitle1">
                    <Timer callback={submitHandler} expiryTimestamp={time} />
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
                  {questionsList[index].options.length > 2 ? (
                    questionsList[index].options.map((option, i) => {
                      const options = DOMPurify.sanitize(option.text);
                      return (
                        <Paper square elevation={0} className={classes.options}>
                          <Typography variant="subtitle1" key="i">
                            {i + 1} {"."}{" "}
                            <button
                              className={classes.optionButton}
                              dangerouslySetInnerHTML={{ __html: options }}
                              style={{
                                background: `
                                 ${
                                   answerList[question_id] == option.id
                                     ? "#f05f40"
                                     : ""
                                 }
                                `,
                              }}
                              onClick={() => {
                                setAnswerObj({
                                  ...answerObj,
                                  [question_id]: option.id,
                                });
                                setAnswerList({
                                  ...answerList,
                                  [question_id]: option.id,
                                });
                              }}
                            />
                          </Typography>
                        </Paper>
                      );
                    })
                  ) : (
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      type="number"
                      id={question_id}
                      className={classes.spacing}
                      // label="Your name"
                      placeholder="Write your answer here..."
                      value={
                        answerObj[question_id] ? answerObj[question_id] : ""
                      }
                      name={question_id}
                      autoComplete="off"
                      onChange={(e) => changeHandler(e, question_id)}
                      onKeyDown={(e) => {
                        if (e.key === "e" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}

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
                      {index > 0 && (
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
                      )}
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
          </>
        )}
      </>
    );
  }
  return null;
}

export default Questions;
