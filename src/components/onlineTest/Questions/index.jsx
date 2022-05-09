/* eslint-disable react/no-danger */
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import Timer from "./Timer";
import ThankYouPage from "../ThankYouPage";
import SorryPage from "../SorryPage";
import { decryptText, encryptText } from "../../../utils";

const baseUrl = import.meta.env.VITE_API_URL;
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
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  optionButton: {
    marginBottom: theme.spacing(2),
  },
  options: {
    backgroundColor: theme.palette.background.default,
  },
}));

function Questions() {
  const classes = useStyles();
  const { enrollmentKey, studentId } = useParams();
  const { lang } = useSelector((state) => state.ui);
  const [index, setIndex] = useState(null);
  const Time = parseInt(decryptText(localStorage.getItem("time")), 10);
  const time = new Date(JSON.parse(Time));
  const location = useLocation();
  const { questionsList } = location.state;
  const [answerList, setAnswerList] = useState({});
  const [result, setResult] = useState({
    success: false,
    done: false,
    total_marks: "",
  });
  useEffect(() => {
    if (index !== null) {
      localStorage.setItem("index", encryptText(`${index}`));
    }
  }, [index]);

  useEffect(() => {
    setIndex(parseInt(decryptText(localStorage.getItem("index")), 10));
    const questionNumbers = [];
    questionsList.forEach((question) => {
      questionNumbers.push(question.id);
    });
    const data = questionNumbers.reduce((acc, curr) => {
      acc[curr] = "";
      return acc;
    }, {});
    const prevAnsList = JSON.parse(localStorage.getItem("answerList"));
    setAnswerList(prevAnsList || data);
    return () => {
      if (result.done) {
        localStorage.removeItem("answerList");
        localStorage.removeItem("enrollmentKey");
        localStorage.removeItem("index");
        localStorage.removeItem("time");
      }
    };
  }, []);

  const changeHandler = (e, upQuestionId) => {
    setAnswerList({
      ...answerList,
      [upQuestionId]: encryptText(e.target.value),
    });
  };

  const previousClickHandler = () => {
    setIndex(index - 1);
  };

  const nextClickHandler = () => {
    setIndex(index + 1);

    localStorage.setItem("answerList", JSON.stringify({ ...answerList }));
  };

  const submitHandler = () => {
    const finalAnswerList = JSON.parse(localStorage.getItem("answerList"));
    const decryptedAnsList = Object.entries(finalAnswerList).reduce(
      (acc, [key, value]) => {
        acc[key] = decryptText(value);
        return acc;
      },
      {}
    );

    fetch(`${baseUrl}on_assessment/questions/${enrollmentKey}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(decryptedAnsList),
    })
      .then(() => {
        fetch(`${baseUrl}on_assessment/Show_testResult/${enrollmentKey}`, {
          method: "GET",
        }).then((res) => {
          res.json().then((data) => {
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
      .catch(() => {
        //console.log("error", err);
      });
  };

  if (index !== null) {
    //console.log("questionsList inside the condition", questionsList);
    const enText = DOMPurify.sanitize(questionsList[index].en_text);
    const hiText = DOMPurify.sanitize(questionsList[index].hi_text);
    const commonText = DOMPurify.sanitize(questionsList[index].common_text);
    const questionID = questionsList[index].id;

    return result.done ? (
      result.success ? (
        <ThankYouPage total_marks={result.total_marks} userID={studentId} />
      ) : (
        <SorryPage total_marks={result.total_marks} />
      )
    ) : (
      <Container maxWidth="lg" align="center">
        <div className={classes.root}>
          <Paper square elevation={0} className={classes.content}>
            <Typography variant="subtitle1">
              <b>
                {tutorialSteps.content1} {index + 1}
              </b>{" "}
              {tutorialSteps.content2} <b>{index}</b> {tutorialSteps.content3}
            </Typography>
            <Typography variant="subtitle1">
              <Timer callback={submitHandler} expiryTimestamp={time} />
            </Typography>

            {/* <Typography variant="subtitle1">
            <div dangerouslySetInnerHTML={{ __html: hi_text }} />
          </Typography> */}
            <Typography variant="subtitle1">
              <div dangerouslySetInnerHTML={{ __html: commonText }} />
            </Typography>
            <Typography variant="subtitle1">
              <div
                dangerouslySetInnerHTML={{
                  __html: lang === "en" ? enText : hiText,
                }}
              />
            </Typography>
            {questionsList[index].options.length > 2 ? (
              questionsList[index].options.map((option, i) => {
                const purifiedOptions = DOMPurify.sanitize(option.text);
                return (
                  <Paper
                    key={`${option.id}`}
                    square
                    elevation={0}
                    className={classes.options}
                  >
                    <Typography variant="subtitle1" key="i">
                      {i + 1} {"."}{" "}
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        type="button"
                        className={classes.optionButton}
                        style={{
                          border: "none",
                          borderRadius: ".2rem",
                          backgroundColor: `
                                 ${
                                   parseInt(
                                     decryptText(answerList[questionID]),
                                     10
                                   ) === option.id
                                     ? "#f05f40"
                                     : ""
                                 }
                                `,
                          color: `
                                ${
                                  parseInt(
                                    decryptText(answerList[questionID]),
                                    10
                                  ) === option.id
                                    ? "#000000"
                                    : ""
                                }
                               `,
                        }}
                        onClick={() => {
                          setAnswerList({
                            ...answerList,
                            [questionID]: encryptText(`${option.id}`),
                          });
                        }}
                        dangerouslySetInnerHTML={{ __html: purifiedOptions }}
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
                id={`${questionID}`}
                className={classes.spacing}
                // label="Your name"
                placeholder="Write your answer here..."
                value={decryptText(answerList[questionID]) || ""}
                name={`${questionID}`}
                autoComplete="off"
                type="number"
                onChange={(e) => changeHandler(e, questionID)}
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
              />
            )}

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={previousClickHandler}
                  disabled={index === 0}
                >
                  Previous
                </Button>
              </Grid>
              {index === 17 ? (
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
              ) : (
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
              )}
            </Grid>
          </Paper>
        </div>
      </Container>
    );
  }
  return null;
}

export default Questions;
