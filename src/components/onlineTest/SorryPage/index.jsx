import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const baseUrl = import.meta.env.VITE_API_URL;
const tutorialSteps = {
  heading: "Oh Sorry!",
  // hiContent1: ,
  content1: {
    en: "You could not clear the Navgurukul Preliminary Test this time. You have scored ",
    hi: "आप इस बारी इस टेस्ट में पास नहीं हो पाए। आपके ",
    ma: "यावेळी तुम्हाला नवगुरुकुल प्राथमिक चाचणी पास करता आली नाही. तुम्हाला ",
  },

  // hiContent2: " ",
  content2: {
    en: " marks in the test. Don't worry, you can give the test again after some preparation",
    hi: " नंबर आए है| कोई बात नहीं आप दोबारा कोशिश कर सकते हो।",
    ma: " गुण मिळाले आहेत.",
  },
  // hiContent3:    "आप थोड़ी और तैयारी के बाद यह टेस्ट फिर से दे सकते है | गणित की प्रैक्टिस के लिए ",
  content3: {
    en: "You can use this study guide for more maths practice ",
    hi: "आप थोड़ी और तैयारी के बाद यह टेस्ट फिर से दे सकते है | गणित की प्रैक्टिस के लिए ",
    ma: "अधिक गणिताच्या सरावासाठी तुम्ही या अभ्यास मार्गदर्शकाचा वापर करू शकता ",
  },
  // hiLink: "यहाँ क्लिक करे",
  link: {
    en: "Click Here. ",
    hi: "यहाँ क्लिक करे। ",
    ma: "इथे क्लिक करा. ",
  },
  // hiContent4: " स्टडी गाइड का उपयोग करे |",
  content4: {
    en: " Prepare, Practice and Pass :)",
    hi: " स्टडी गाइड का उपयोग करे |",
    ma: "तयारी करा, सराव करा आणि उत्तीर्ण व्हा :)",
  },
  button: "Ok",
};
// meraki = https://saral.navgurukul.org/

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
  // link: {
  //   color: "primary"
  // },
}));

function SorryPage() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [totalMarks, setTotalMarks] = useState("");
  const { lang } = useSelector((state) => state.ui);
  useEffect(() => {
    fetch(
      `${baseUrl}/on_assessment/Show_testResult/${
        location.pathname.split("/")[2]
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalMarks(data.total_marks);
      });
  }, []);
  //console.log(marks);
  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.content}>
          <Typography variant="h4">{tutorialSteps.heading}</Typography>
        </Paper>
        {/* <Paper square elevation={0} className={classes.content}>
          <Typography>
            {tutorialSteps.hiContent1}
            {marks}
            {tutorialSteps.hiContent2}
          </Typography>
        </Paper> */}
        <Paper square elevation={0} className={classes.content}>
          <Typography>
            {tutorialSteps.content1[lang]}
            {totalMarks}
            {tutorialSteps.content2[lang]}
          </Typography>
        </Paper>
        {/* <Paper square elevation={0} className={classes.content}>
          <Typography>
            {tutorialSteps.hiContent3}
            <a href="https://saral.navgurukul.org/" className={classes.link}>{tutorialSteps.hiLink}</a>
            {tutorialSteps.hiContent4}
          </Typography>
        </Paper> */}
        <Paper square elevation={0} className={classes.content}>
          <Typography>
            {tutorialSteps.content3[lang]}
            <a
              href="https://merakilearn.org/"
              style={{
                color: "blue",
              }}
            >
              {tutorialSteps.link[lang]}
            </a>
            {tutorialSteps.content4[lang]}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.button}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              localStorage.removeItem("answerList");
              localStorage.removeItem("enrollmentKey");
              localStorage.removeItem("index");
              localStorage.removeItem("time");
              navigate("/");
            }}
          >
            Ok
          </Button>
        </Paper>
      </div>
    </Container>
  );
}

export default SorryPage;
