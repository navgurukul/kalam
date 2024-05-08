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
import { useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import ThankYouPage from "../ThankYouPage";
import SorryPage from "../SorryPage";
import Loader from "../../ui/Loader";
import { decryptText, encryptText } from "../../../utils";
import { customPartner } from "../../../utils/constants";
import { setQuestions } from "../../../store/slices/onlineTestSlice";

const baseUrl = import.meta.env.VITE_API_URL;
const tutorialSteps = {
  content1: {
    old: "Yeh Question no. ",
    en: "Current Question No. ",
    hi: "सध्याचा प्रश्न क्र. ",
    ma: "वर्तमान प्रश्न no. ",
  },
  content2: {
    old: "(out of ",
    en: "(out of ",
    hi: "( ",
    ma: "( ",
  },
  content3: {
    old: " questions) Aapne  ",
    en: " questions) You have attempted ",
    hi: " प्रश्नों में से) आपने अब तक ",
    ma: " प्रश्नांपैकी) तुम्ही आतापर्यंत ",
  },
  content4: {
    old: "questions already attempt kar liye hai!",
    en: " so far.",
    hi: " प्रश्नों का प्रयास किया है।",
    ma: " प्रश्नांचा प्रयत्न केला आहे.",
  },
  inputText: {
    en: "Write Your Answer Here...",
    hi: "अपना उत्तर यहां लिखें...",
    ma: "तुमचे उत्तर इथे लिहा...",
  },
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
  const dispatch = useDispatch();
  const { partner, questions: questionsList } = useSelector(
    (state) => state.onlineTest
  );
  const [loading, setLoading] = useState(true);
  const partnerSlug = partner?.slug;
  const { lang } = useSelector((state) => state.ui);
  const [index, setIndex] = useState(null);
  const Time =
    parseInt(decryptText(localStorage.getItem("time")), 10) || Date.now();
  const time = new Date(JSON.parse(Time));
  // const { questionsList  } = location.state;
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
    axios
      .get(`${baseUrl}on_assessment/questions/${enrollmentKey}`)
      .then((res) => {
        dispatch(setQuestions(res.data.data));
        const questionNumbers = [];
        res.data.data.forEach((question) => {
          questionNumbers.push(question.id);
        });
        const data = questionNumbers.reduce((acc, curr) => {
          acc[curr] = "";
          return acc;
        }, {});
        const prevAnsList = JSON.parse(localStorage.getItem("answerList"));
        setAnswerList(prevAnsList || data);
        setLoading(false);
      });

    return () => {
      if (result.done) {
        localStorage.removeItem("answerList");
        localStorage.removeItem("enrollmentKey");
        localStorage.removeItem("index");
        localStorage.removeItem("time");
        localStorage.removeItem("partnerSlug");
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
    const finalAnswerList =
      JSON.parse(localStorage.getItem("answerList")) || {};
    const decryptedAnsList = Object.entries(finalAnswerList).reduce(
      (acc, [key, value]) => {
        acc[key] = decryptText(value);
        return acc;
      },
      {}
    );

    axios
      .post(
        `${baseUrl}on_assessment/questions/${enrollmentKey}/answers`,
        decryptedAnsList
      )
      .then(() => {
        axios
          .get(`${baseUrl}on_assessment/Show_testResult/${enrollmentKey}`)
          .then(({ data }) => {
            setResult({
              ...result,
              total_marks: data.total_marks,
              done: true,
              success: data.Result !== "Failed",
            });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (index !== null && !loading) {
    const text = {
      en: DOMPurify.sanitize(questionsList[index]?.en_text),
      hi: DOMPurify.sanitize(questionsList[index]?.hi_text),
      ma: DOMPurify.sanitize(questionsList[index]?.ma_text),
    };
    const commonText = DOMPurify.sanitize(questionsList[index]?.common_text);
    const questionID = questionsList[index]?.id;

    return loading ? (
      <Loader container />
    ) : result.done ? (
      result.success ? (
        <ThankYouPage total_marks={result.total_marks} userID={studentId} />
      ) : (
        <SorryPage
          redirect={
            customPartner.includes(partnerSlug) ? `/${partnerSlug}` : "/"
          }
          total_marks={result.total_marks}
        />
      )
    ) : (
      <Container maxWidth="lg" align="center">
        <div className={classes.root}>
          <Paper square elevation={0} className={classes.content}>
            <Typography variant="subtitle1">
              <b>
                {tutorialSteps.content1[lang]} {index + 1}
              </b>{" "}
              {tutorialSteps.content2[lang]}
              {questionsList.length}
              {tutorialSteps.content3[lang]}
              <b>{index}</b> {tutorialSteps.content4[lang]}
            </Typography>
            <Typography variant="subtitle1">
              <Timer
                callback={submitHandler}
                lang={lang}
                expiryTimestamp={time}
              />
            </Typography>

            {/* <Typography variant="subtitle1">
            <div dangerouslySetInnerHTML={{ __html: hi_text }} />
          </Typography> */}

            <Typography variant="subtitle1">
              <div
                dangerouslySetInnerHTML={{
                  __html: text[lang] !== "" ? text[lang] : text.hi,
                }}
              />
            </Typography>
            <Typography variant="subtitle1">
              <div dangerouslySetInnerHTML={{ __html: commonText }} />
            </Typography>
            {questionsList[index]?.options.length > 2 ? (
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
                placeholder={tutorialSteps.inputText[lang]}
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
              {index === questionsList.length - 1 ? (
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
