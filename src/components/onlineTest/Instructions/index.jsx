import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import {
  MobileStepper,
  Paper,
  Typography,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Container,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { encryptText } from "../../../utils";
import { changeLanguage } from "../../../store/slices/uiSlice";
// import Form from "../Form/index";

const tutorialSteps = [
  {
    heading: "NavGurukul Scholarship Test",
    subHadding: "Select Your Languge/ अपनी भाषा चुने",
    enContent:
      "You can also change the langauge between Hindi and English during the test.",
    hiContent: "आप test के बीच मे भी अपने test की भाशा बदल सकते है।",
    inputField: true,
    button: "Aage chalein",
    button3: false,
  },
  {
    heading: "NavGurukul Scholarship Test",
    enContent:
      "Yeh test shuru hone se pehle kuch important cheezein padh lein. Yeh cheezein aapko test dene ke time bahot kaam aayengi.",
    one: "1. Poora test 1 hour ka hoga. Kisi shaant jagah pe jaa ke iss test to dijiye. Isse aap ache se saare saavalon ka javab de payenge.",
    two: "2. Test dete waqt apne paas ek notebook aur pen rakhein. Aap koi bhi rough work notebook mein kar sakte hain.",
    three:
      "3. Har question ka answer apne phone pe hi test dete hue daal dein.",
    four: "4. Aapko cheating karne ka mauke mil sakte hain, lekin humein aap pe bharosa hai ki aap cheating nahi karenge :)",
    inputField: false,
    button: "Main tyaar hu",
    button3: false,
  },
  {
    heading: "Read Carefully",
    enContent1:
      "Kafi sare students pure India se NavGurukul ka test dete ha taki woh NavGurukul ke 1 saal wale program ke madad se high paying software engineering jobs le sake. Hala ki akhir me bohut bada eenam hota ha, magar uske liye apko kafi jada mehnat bi karni padhti hai. Hume har kisi student ko padhna chate hai chae uske educational qualifications kuch bi ho magar hume kuch basic knowledge chaiye kuch chizo me. Yeh test ke duwara hum yeh jane ki kosish karte ha ki kya apke pass woh basic knowledge hai. Kuch students test meh cheat karke score kar lete ha but woh program meh ache tarike se perform ni kar pahte ha, Jiske karan uneh yeh program chorna padhta ha. Agar aap ish test ke liye aage badh rahe hai toh kripaya ish test ko khudse de bina kisike madad ke. Agar hume pata chalta ha ki apne cheating ki hai toh hum apko disqualify kardenge aage.",
    enContent2:
      "Kuch students test meh cheat karke score kar lete ha but woh program meh ache tarike se perform ni kar pahte ha, Jiske karan uneh yeh program chorna padhta ha.",
    enContent3:
      "Agar aap ish test ke liye aage badh rahe hai toh kripaya ish test ko khudse de bina kisike madad ke. Agar hume pata chalta ha ki apne cheating ki hai toh hum apko disqualify kardenge aage.",
    inputField: false,
    button: false,
    button3: "Test shuru karein",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  },
  heading: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  one: {
    paddingTop: theme.spacing(-8),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  },
  textField: {
    paddingTop: theme.spacing(-4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  },
}));

const TestInstructions = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.ui);
  // const [shuruKarein, SetShuruKarein] = useState(true);
  // const { enrolmentKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enrollmentKey, ...rest } = location.state;
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      // console.log(enrollmentKey, rest);
      localStorage.setItem("enrollmentKey", encryptText(`${enrollmentKey}`));
      if (rest.studentId) {
        localStorage.setItem("studentId", encryptText(`${rest.studentId}`));
      }
      // if (rest.partner)
      //   localStorage.setItem(
      //     "partner",
      //     encryptText(JSON.stringify(rest.partner))
      //   );
      navigate("/test/studentdetails", {
        state: { enrollmentKey, lang, ...rest },
      });
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const clickHandler = () => {
    if (activeStep === maxSteps - 1) {
      // console.log(enrollmentKey);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  useEffect(() => {
    localStorage.removeItem("answerList");
    localStorage.removeItem("enrollmentKey");
    localStorage.removeItem("index");
    localStorage.removeItem("time");
    localStorage.removeItem("testStarted");
  }, []);

  const changeHandler = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root}>
        <Paper square elevation={0} className={classes.heading}>
          <Typography variant="h4">
            {tutorialSteps[activeStep].heading}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography variant="h5">
            {tutorialSteps[activeStep].subHadding}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps[activeStep].enContent}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps[activeStep].hiContent}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].enContent1}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].enContent2}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].enContent3}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.one} align="left">
          <Typography>{tutorialSteps[activeStep].one}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].two}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].three}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].four}</Typography>
        </Paper>
        {tutorialSteps[activeStep].inputField ? (
          <Paper
            square
            elevation={0}
            className={classes.textField}
            align="left"
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Choose your language
              </InputLabel>
              <Select
                value={lang}
                onChange={changeHandler}
                label="Choose your language"
                name="Language"
              >
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        ) : null}
        {tutorialSteps[activeStep].button ? (
          <Paper square elevation={0} className={classes.content}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={clickHandler}
            >
              {tutorialSteps[activeStep].button}
            </Button>
          </Paper>
        ) : null}
        {tutorialSteps[activeStep].button3 ? (
          <Paper square elevation={0} className={classes.content}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                // const query = new URLSearchParams(window.location.search);
                // query.append("enabled", "true");
                handleNext();
              }}
            >
              {tutorialSteps[activeStep].button3}
            </Button>
          </Paper>
        ) : null}
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="dots"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
    </Container>
  );
  // : (
  //   <Form lang={value} />
  // );
};

export default TestInstructions;
