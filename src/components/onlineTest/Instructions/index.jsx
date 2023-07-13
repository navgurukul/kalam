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
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { encryptText } from "../../../utils";
import { changeLanguage } from "../../../store/slices/uiSlice";
import { setStudentId } from "../../../store/slices/onlineTestSlice";
// import Form from "../Form/index";

const tutorialSteps = [
  {
    heading: {
      en: "NavGurukul Entrance Test",
      hi: "NavGurukul Entrance Test",
      ma: "NavGurukul Entrance Test",
    },
    subHadding: {
      // old:"Select Your Languge/ अपनी भाषा चुने",
      en: "Select Your Language",
      hi: "अपनी भाषा चुने",
      ma: "तुमची भाषा निवडा",
    },
    // enContent:"You can also change the langauge between Hindi and English during the test.",
    // hiContent: "आप test के बीच मे भी अपने test की भाशा बदल सकते है।",
    content: "",
    inputField: true,
    button: {
      // old:"Aage chalein",
      en: "Let's go Ahead",
      hi: "आगे बढ़ो",
      ma: "पुढे जा",
    },
    button3: false,
  },
  {
    heading: {
      en: "NavGurukul Entrance Test",
      hi: "NavGurukul Entrance Test",
      ma: "NavGurukul Entrance Test",
    },
    content: {
      en: "Please read the following important instructions before starting the test. These instruction will come in handy while giving the test",
      // old: "Yeh test shuru hone se pehle kuch important cheezein padh lein. Yeh cheezein aapko test dene ke time bahot kaam aayengi.",
      hi: "परीक्षा शुरू करने से पहले कृपया निम्नलिखित महत्वपूर्ण निर्देश पढ़ें। परीक्षा देते समय ये निर्देश काम आएंगे",
      ma: "परीक्षा सुरू करण्यापूर्वी कृपया खालील महत्त्वाच्या सूचना वाचा. परीक्षा देताना या सूचना उपयोगी पडतील",
    },
    one: {
      en: "1. The complete test will be of 1 hour. Please give the test in a quiet place, where you can answer the questions without any disruptions.",
      // old: "1. Poora test 1 hour ka hoga. Kisi shaant jagah pe jaa ke iss test to dijiye. Isse aap ache se saare saavalon ka javab de payenge.",
      hi: "1. पूरी परीक्षा 1 घंटे की होगी। कृपया किसी शांत स्थान पर परीक्षा दें, जहां आप बिना किसी व्यवधान के प्रश्नों का उत्तर दे सकें।",
      ma: "1. संपूर्ण चाचणी 1 तासाची असेल. कृपया शांत ठिकाणी चाचणी द्या, जिथे तुम्ही कोणत्याही व्यत्ययाशिवाय प्रश्नांची उत्तरे देऊ शकता.",
    },
    two: {
      // old:"2. Test dete waqt apne paas ek notebook aur pen rakhein. Aap koi bhi rough work notebook mein kar sakte hain.",
      en: "2. While giving the test, keep a notebook and a pen with you. You can use any rough notebook.",
      hi: "2. परीक्षा देते समय एक नोटबुक और एक पेन अपने पास रखें। आप किसी भी रफ नोटबुक का उपयोग कर सकते हैं।",
      ma: "२. परीक्षा देताना एक वही आणि पेन सोबत ठेवा. तुम्ही कोणतीही रफ नोटबुक वापरू शकता.",
    },
    three: {
      // old:"3. Har question ka answer apne phone pe hi test dete hue daal dein.",
      en: "3. While giving the test, answer each question on your phone itself.",
      hi: "3. परीक्षा देते समय प्रत्येक प्रश्न का उत्तर अपने फोन पर ही दें।",
      ma: "3. परीक्षा देताना प्रत्येक प्रश्नाचे उत्तर तुमच्या फोनवरच द्या.",
    },
    four: {
      // old:"4. Aapko cheating karne ka mauke mil sakte hain, lekin humein aap pe bharosa hai ki aap cheating nahi karenge :)",
      en: "4. You may get the chance of cheating exam, but we believe that you will not cheat.",
      hi: "4. आपको परीक्षा में नकल करने का मौका मिल सकता है, लेकिन हमें विश्वास है कि आप नकल नहीं करेंगे।",
      ma: "4. तुम्हाला परीक्षेत फसवणूक करण्याची संधी मिळू शकते, परंतु आम्हाला विश्वास आहे की तुम्ही असे कोणतेही काम करणार नाही.",
    },
    inputField: false,
    button: {
      // old: "Main tyaar hu",
      en: "I'm ready",
      hi: "मैं तैयार हूँ",
      ma: "मी तयार आहे",
    },
    button3: false,
  },
  {
    heading: {
      en: "Read Carefully",
      hi: "Read Carefully",
      ma: "Read Carefully",
    },
    content1: {
      // old:"Kafi sare students pure India se NavGurukul ka test dete ha taki woh NavGurukul ke 1 saal wale program ke madad se high paying software engineering jobs le sake. Hala ki akhir me bohut bada eenam hota ha, magar uske liye apko kafi jada mehnat bi karni padhti hai. Hume har kisi student ko padhna chate hai chae uske educational qualifications kuch bi ho magar hume kuch basic knowledge chaiye kuch chizo me. Yeh test ke duwara hum yeh jane ki kosish karte ha ki kya apke pass woh basic knowledge hai. Kuch students test meh cheat karke score kar lete ha but woh program meh ache tarike se perform ni kar pahte ha, Jiske karan uneh yeh program chorna padhta ha. Agar aap ish test ke liye aage badh rahe hai toh kripaya ish test ko khudse de, bina kisike madad ke. Agar hume pata chalta ha ki apne cheating ki hai toh hum apko disqualify kardenge aage.",
      en: "Many students from all over India give NavGurukul test so that they can get high paying software engineering job with the help of NavGurukul 1 year program. Even though there is a huge reward, but in order to achieve that, you have to work very hard. We want to teach all students irrespective of their educational qualification, but need knowledge of some basic concecpts. Through this test we will be assessing your of those basic concepts. Some students cheat to pass the exam, but are unable to perform well in the program due to which they have to quit the program. If you're going for the test, then pleease give the test by yourself without any help. If we suspect any cheating in exam, you'll get disqualified.",
      hi: "पूरे भारत से कई छात्र नवगुरुकुल परीक्षा देते हैं ताकि वे नवगुरुकुल 1 साल के कार्यक्रम की मदद से उच्च भुगतान वाली सॉफ्टवेयर इंजीनियरिंग की नौकरी पा सकें। इनाम भले ही बहुत बड़ा हो, लेकिन उसे पाने के लिए बहुत मेहनत करनी पड़ती है। हम सभी छात्रों को उनकी शैक्षिक योग्यता के बावजूद पढ़ाना चाहते हैं, लेकिन कुछ बुनियादी अवधारणाओं के ज्ञान की आवश्यकता है। इस परीक्षण के माध्यम से हम आपकी उन बुनियादी अवधारणाओं का आकलन करेंगे। कुछ छात्र परीक्षा पास करने के लिए परीक्षा में नकल करते हैं, लेकिन कार्यक्रम में अच्छा प्रदर्शन करने में असमर्थ होते हैं जिसके कारण उन्हें कार्यक्रम छोड़ना पड़ता है। यदि आप परीक्षण के लिए जा रहे हैं, तो कृपया बिना किसी सहायता के स्वयं ही परीक्षा दें। यदि हमें परीक्षा में किसी नकल का संदेह होता है, तो आप अयोग्य हो जाएंगे।",
      ma: "संपूर्ण भारतातील अनेक विद्यार्थी नवगुरुकुल परीक्षा देतात जेणेकरून त्यांना नवगुरुकुल 1 वर्षाच्या कार्यक्रमाच्या मदतीने उच्च पगाराची सॉफ्टवेअर अभियांत्रिकी नोकरी मिळू शकेल. भले मोठे बक्षीस असेल, पण ते मिळवण्यासाठी तुम्हाला खूप मेहनत करावी लागेल. आम्ही सर्व विद्यार्थ्यांना त्यांची शैक्षणिक पात्रता विचारात न घेता शिकवू इच्छितो, परंतु काही मूलभूत संकल्पनांचे ज्ञान आवश्यक आहे. या परीक्षेद्वारे आम्ही तुमच्या त्या मूलभूत संकल्पनांचे मूल्यमापन करणार आहोत. काही विद्यार्थी परीक्षेत उत्तीर्ण होण्यासाठी फसवणूक करतात, परंतु कार्यक्रमात चांगली कामगिरी करू शकत नाहीत त्यामुळे त्यांना कार्यक्रम सोडावा लागतो. तुम्ही चाचणीसाठी जात असाल, तर कृपया कोणत्याही मदतीशिवाय स्वतः चाचणी द्या. परीक्षेत फसवणूक झाल्याचा आम्हाला संशय असल्यास, तुम्हाला अपात्र घोषित केले जाईल.",
    },
    content2: {
      old: "Kuch students test meh cheat karke score kar lete ha but woh program meh ache tarike se perform ni kar pahte ha, Jiske karan uneh yeh program chorna padhta ha.",
      en: "Some students cheat to pass the test, but are unable to perform well in the program due to which they have to quit the program",
      hi: "कुछ छात्र परीक्षा पास करने के लिए धोखा देते हैं, लेकिन कार्यक्रम में अच्छा प्रदर्शन करने में असमर्थ होते हैं जिसके कारण उन्हें कार्यक्रम छोड़ना पड़ता है।",
      ma: "काही विद्यार्थी परीक्षेत उत्तीर्ण होण्यासाठी फसवणूक करतात, परंतु कार्यक्रमात चांगली कामगिरी करू शकत नाहीत ज्यामुळे त्यांना कार्यक्रम सोडावा लागतो.",
    },
    content3: {
      // old:"Agar aap ish test ke liye aage badh rahe hai toh kripaya ish test ko khudse de bina kisike madad ke. Agar hume pata chalta ha ki apne cheating ki hai toh hum apko disqualify kardenge aage."
      en: "If you're going for the test, then pleease give the test by yourself without any help. If we suspect any cheating in exam, you'll get disqualified.",
      hi: "यदि आप परीक्षण के लिए जा रहे हैं, तो कृपया बिना किसी सहायता के स्वयं ही परीक्षा दें। यदि हमें परीक्षा में किसी नकल का संदेह होता है, तो आप अयोग्य हो जाएंगे।",
      ma: "तुम्ही परीक्षेला जात असाल, तर कृपया कोणाच्याही मदतीशिवाय स्वतः परीक्षा द्या. परीक्षेत फसवणूक झाल्याचा आम्हाला संशय असल्यास, तुम्हाला अपात्र घोषित केले जाईल.",
    },
    inputField: false,
    button: false,
    button3: {
      old: "Test shuru karein",
      en: "Start the test",
      hi: "परीक्षा शुरू करें",
      ma: "परीक्षा सुरू करा",
    },
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
  const { enrollmentKey, studentId } = useSelector((state) => state.onlineTest);
  const { lang } = useSelector((state) => state.ui);
  // const [shuruKarein, SetShuruKarein] = useState(true);
  // const { enrolmentKey } = useParams();
  const navigate = useNavigate();
  // const { enrollmentKey, ...rest } = location.state;
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      // console.log(enrollmentKey, rest);
      localStorage.setItem("enrollmentKey", encryptText(`${enrollmentKey}`));
      // dispatch(setEnrollmentKey(enrollmentKey));
      if (studentId) {
        localStorage.setItem("studentId", encryptText(`${studentId}`));
        dispatch(setStudentId(studentId));
      }
      // if (rest.partner)
      //   localStorage.setItem(
      //     "partner",
      //     encryptText(JSON.stringify(rest.partner))
      //   );
      navigate("/test/studentdetails", {
        // state: { enrollmentKey, lang, ...rest },
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
          <Typography data-cy="heading" variant="h4">
            {tutorialSteps[activeStep].heading[lang]}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography data-cy="title" variant="h5">
            {tutorialSteps[activeStep].subHadding?.[lang]}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps[activeStep].content?.[lang]}</Typography>
        </Paper>
        {/* <Paper square elevation={0} className={classes.content}>
          <Typography>{tutorialSteps[activeStep].hiContent}</Typography>
        </Paper> */}
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>
            {tutorialSteps[activeStep]?.content1?.[lang] || ""}
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].content2?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].content3?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.one} align="left">
          <Typography>{tutorialSteps[activeStep].one?.[[lang]]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].two?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].three?.[lang]}</Typography>
        </Paper>
        <Paper square elevation={0} className={classes.content} align="left">
          <Typography>{tutorialSteps[activeStep].four?.[lang]}</Typography>
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
                data-cy="lang-dropdown"
                value={lang}
                onChange={changeHandler}
                label="Choose your language"
                name="Language"
              >
                <MenuItem data-cy="en" value="en">
                  English
                </MenuItem>
                <MenuItem data-cy="hi" value="hi">
                  Hindi
                </MenuItem>
                <MenuItem data-cy="ma" value="ma">
                  Marathi
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>
        ) : null}
        {tutorialSteps[activeStep].button ? (
          <Paper square elevation={0} className={classes.content}>
            <Button
              data-cy="nextStepButton"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={clickHandler}
            >
              {tutorialSteps[activeStep].button[lang]}
            </Button>
          </Paper>
        ) : null}
        {tutorialSteps[activeStep].button3 ? (
          <Paper square elevation={0} className={classes.content}>
            <Button
              data-cy="startTestButton"
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
              {tutorialSteps[activeStep].button3[lang]}
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
