import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;
const tutorialSteps = {
  heading: "Oh Sorry!",
  hiContent1: "आप इस बारी इस टेस्ट में पास नहीं हो पाए। आपके ",
  enContent1:
    "You could not clear the Navgurukul Scholarship Test this time. You have scored ",
  hiContent2: " नंबर आए है| कोई बात नहीं आप दोबारा कोशिश कर सकते हो।",
  enContent2:
    " marks in the test. Don't worry, you can give the test again after some preparation",
  hiContent3:
    "आप थोड़ी और तैयारी के बाद यह टेस्ट फिर से दे सकते है | गणित की प्रैक्टिस के लिए ",
  enContent3: "You can use this study guide for more maths practice ",
  hiLink: "यहाँ क्लिक करे",
  enLink: "click here",
  hiContent4: " स्टडी गाइड का उपयोग करे |",
  enContent4: " Prepare, Practice and Pass :)",
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
    <Container maxWidth="lg" align="center" justifyContent="center">
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
            {tutorialSteps.enContent1}
            {totalMarks}
            {tutorialSteps.enContent2}
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
            {tutorialSteps.enContent3}
            <a
              href="https://merakilearn.org/"
              style={{
                color: "blue",
              }}
            >
              {tutorialSteps.enLink}
            </a>
            {tutorialSteps.enContent4}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.button}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Ok
          </Button>
        </Paper>
      </div>
    </Container>
  );
}

export default SorryPage;