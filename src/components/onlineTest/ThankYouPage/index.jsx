import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Button, Link, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    padding: theme.spacing(3),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
  link: {
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  thanks: {
    marginBottom: theme.spacing(2),
  },
}));

const tutorialSteps = {
  heading1: {
    en: "Thank you! you have passed the test. You have scored ",
    hi: "आपको धन्यवाद! आपने परीक्षा पास कर ली है। आपने ",
    ma: "धन्यवाद! तुम्ही परीक्षेत उत्तीर्ण झाला आहात. तुम्हाला ",
  },
  heading2: {
    en: " marks",
    hi: " अंक प्राप्त किए हैं",
    ma: " गुण मिळाले आहेत",
  },
  heading3:{
    en: "Good job! You've cleared the screening test for Navgurukul's Residential Program! However, all the spots are currently full. So, we've placed you on our waitlist. If a spot opens up, we'll let you know right away. Thanks for your understanding!",
    hi: " नमस्ते! नवगुरुकुल के रेजिडेंशियल प्रोग्राम के लिए आपने स्क्रीनिंग टेस्ट पास कर लिया है, बहुत बढ़िया! हालांकि, अभी सभी सीटें भर चुकी हैं, इसलिए हमने आपको वेटलिस्ट में रखा है। जैसे ही कोई सीट खाली होगी, हम आपको तुरंत सूचित करेंगे। समझने के लिए धन्यवाद!"
  },
  content1: {
    en: "Thank you for applying to NavGurukul Program",
    hi: "नवगुरुकुल की दो वर्षीय फेलोशिप में ",
    ma: "नवगुरुकुलच्या दोन वर्षाच्या फेलोशिपमध्ये ",
  },
  content2: {
    old: "Aap apna interview slot apne time ke hisab se book kar sakte hain.",
    en: "Admission team will reach out to you for the next steps",
    hi: "आप अपनी सुविधा के अनुसार अपना इंटरव्यू स्लॉट बुक कर सकते हैं।",
    ma: "तुमच्या सोयीनुसार तुम्ही तुमचा मुलाखतीचा स्लॉट बुक करू शकता.",
  },
  content3: {
    old: "Aap humein ",
    en: "You can send us a mail on ",
    hi: "आप हमें ",
    ma: "तुम्ही आम्हाला ",
  },
  content4: {
    en: ".",
    hi: " पर मेल भेज सकते हैं।",
    ma: " वर मेल पाठवू शकता.",
  },
  bookSlot: {
    en: "Book Slot",
    hi: "स्लॉट बुक करें",
    ma: "स्लॉट बुक करा",
  },
  visitNGSite: {
    en: "Visit NavGurukul Website",
    hi: "नवगुरुकुल वेबसाइट पर जाएँ",
    ma: "नवगुरुकुल वेबसाइटला भेट द्या",
  },
  startLearning: {
    en: "Start Learning Coding Now",
    hi: "अभी कोडिंग सीखना शुरू करें",
    ma: "आता कोडिंग शिकणे सुरू करा",
  },
};

function ThankYouPage({ userID }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { lang } = useSelector((state) => state.ui);
  const [totalMarks, setTotalMarks] = useState("");
  const [gender, setGender] = useState("");

  const clearTestData = () => {
    localStorage.removeItem("answerList");
    localStorage.removeItem("enrollmentKey");
    localStorage.removeItem("index");
    localStorage.removeItem("time");
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/on_assessment/Show_testResult/${location.pathname.split("/")[2]}`)
      .then(({ data }) => {
        setTotalMarks(data.total_marks);
        setGender(data.gender);
      });
  }, []);

  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root} align="center">
        <Typography variant="h4" className={classes.thanks}>
          {tutorialSteps.heading1[lang]}
          <b>{totalMarks}</b>
          {tutorialSteps.heading2[lang]}

        </Typography>
          {gender === 2 && tutorialSteps.heading3[lang] && (
            <Typography color="black" style={{ marginBottom: "16px" }}>
              {tutorialSteps.heading3[lang]}
            </Typography>
          )}

        <Typography>{tutorialSteps.content1[lang]}</Typography>
        <Typography>{tutorialSteps.content2[lang]}</Typography>

        <Typography className={classes.link}>
          {tutorialSteps.content3[lang]}
          <Link href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hi@navgurukul.org">
            hi@navgurukul.org
          </Link>{" "}
          {tutorialSteps.content4[lang]}
        </Typography>
          {/* <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => {
            clearTestData();
            navigate(`/bookSlot/${userID}`);
          }}
        >
          {tutorialSteps.bookSlot[lang]}
        </Button> */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={clearTestData}
        >
          <a
            href="https://www.navgurukul.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            {tutorialSteps.visitNGSite[lang]}
          </a>
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={clearTestData}
        >
          <a
            href="https://www.merakilearn.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            {tutorialSteps.startLearning[lang]}
          </a>
        </Button>
      </div>
    </Container>
  );
}

export default ThankYouPage;
