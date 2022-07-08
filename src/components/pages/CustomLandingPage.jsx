/* eslint-disable camelcase */
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Container, List, ListItem } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import { makeStyles, ThemeProvider } from "@mui/styles";
import { changeFetching } from "../../store/slices/uiSlice";
import VideoSlider from "../ui/VideoSlider";
import theme from "../../theme";
import { decryptText } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles(() => ({
  loginContainer: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    boxShadow: "none",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: theme.spacing(4),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    textAlign: "center",
    fontSize: 32,
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
    },
  },
  typography: {
    fontFamily: "BlinkMacSystemFont",
  },
  fixedFooter: {
    [theme.breakpoints.up("sm")]: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  modal: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
}));

// const getModalStyle = () => {
//   const top = 50; // + rand()
//   const left = 50; //+ rand()

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//     overflowY: "scroll",
//     maxHeight: "80vh",
//     width: "60%",
//   };
// };

const CustomLandingPage = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const slug = location.pathname.split("/")[1];
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const { lang: selectedLang } = useSelector((state) => state.ui);
  const [state, setState] = React.useState({
    mobileNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    selectedLang: "en",
    partnerId: "",
    modalOpen: false,
    data: [],
    pendingInterviewStage: "checking",
    enrollmentKey: "",
  });
  const [goToTest, setGoToTest] = React.useState(false);
  const testClosed = ["amravati"];
  const lang = {
    Heading: {
      en: "AKANKSHA Campus",
      hi: "आकांक्षा Campus",
      ma: "आकांक्षा Campus",
    },
    Course: {
      en: "Course Information",
      hi: "कोर्स के बारे में जाने",
      ma: "अभ्यासक्रम माहिती",
    },
    Status: {
      en: "Check your test result by entering the number you gave test from",
      hi: "आपने जिस नंबर से परीक्षा दी है, उसे एंटर करके अपना परीक्षा रिजल्ट देखें",
      ma: "तुम्ही ज्या क्रमांकावरून चाचणी दिली होती ती क्रमांक टाकून तुमचा चाचणी निकाल तपासा",
    },
    AdmisssionTitle: {
      en: "Start Admisssion Test",
      hi: "परीक्षा शुरू करें",
      ma: "प्रवेश परीक्षा सुरू करा",
    },
    TestButton: {
      en: "GIVE TEST",
      hi: "परीक्षा दे।",
      ma: "परीक्षा द्या.",
    },
    StatusButton: {
      en: "Check Result",
      hi: "रिजल्ट देखे",
      ma: "निकाल तपासा",
    },
    Footer: {
      en: "For more queries, write at hi@navgurukul.org",
      hi: "अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org",
      ma: "अधिक प्रश्नांसाठी, येथे लिहा: hi@navgurukul.org",
    },
    mandatoryField: {
      en: "To attempt the test, it is compulsory to enter your First Name, Last Name and Mobile Number. Middle Name is optional, you can choose not to enter.",
      hi: "टेस्ट देने के लिए अपना फर्स्ट नेम, लास्ट नेम और मोबाइल नंबर डालना आवश्यक  है। मध्य नाम वैकल्पिक है, आप प्रवेश नहीं करना चुन सकते हैं।",
      ma: "चाचणीचा प्रयत्न करण्यासाठी, आपले नाव, आडनाव आणि मोबाइल नंबर प्रविष्ट करणे अनिवार्य आहे. मधले नाव ऐच्छिक आहे, तुम्ही एंटर न करणे निवडू शकता.",
    },
    mobileNumber: {
      en: "Please give 10 digits of the mobile number.",
      hi: "कृपया मोबाइल नंबर के 10 अंक दें।",
      ma: "कृपया मोबाईल नंबरचे 10 अंक द्या.",
    },
  };

  const getTestData = () => ({
    enrollmentKey: localStorage.getItem("enrollmentKey"),
    time: localStorage.getItem("time"),
    studentId: localStorage.getItem("studentId"),
  });
  const partnerFetch = async (_slug) => {
    const response = await axios.get(`${baseUrl}partners/slug/${_slug}`, {});
    setState({
      ...state,
      partnerId: response.data.data.id,
    });
  };

  const generateTestLink = async (studentId) => {
    try {
      const partnerId = state.partnerId ? state.partnerId : null;
      const mobile = `0${state.mobileNumber}`;
      fetchingStart();
      const dataURL = `${baseUrl}helpline/register_exotel_call`;
      const response = await axios.get(dataURL, {
        params: {
          ngCallType: "getEnrolmentKey",
          From: mobile,
          partner_id: partnerId,
          student_id: studentId,
        },
      });
      return response;
    } catch (e) {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      fetchingFinish();
    }
  };

  const { enrollmentKey, time } = getTestData();

  useEffect(() => {
    if (slug) {
      partnerFetch(slug);
    }
    if (time && enrollmentKey) {
      const Time = parseInt(decryptText(time), 10);
      const date = new Date(JSON.parse(Time));
      if (parseInt(dayjs(date).diff(dayjs(), "seconds"), 10) > 0) {
        setGoToTest(true);
      } else {
        localStorage.removeItem("answerList");
        localStorage.removeItem("enrollmentKey");
        localStorage.removeItem("index");
        localStorage.removeItem("time");
        localStorage.removeItem("testStarted");
      }
    }
  }, []);

  const onChangeEvent = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeEventStatus = (e) => {
    setState({
      ...state,
      mobile: e.target.value,
    });
  };

  const isDuplicate = () => {
    const { mobileNumber, firstName, middleName, lastName } = state;
    const first_name = firstName.replace(
      firstName[0],
      firstName[0].toUpperCase()
    );
    const middle_name =
      middleName &&
      middleName.replace(middleName[0], middleName[0].toUpperCase());
    const last_name = lastName.replace(lastName[0], lastName[0].toUpperCase());
    axios
      .get(`${baseUrl}check_duplicate`, {
        params: {
          Name: firstName.concat(" ", middleName, lastName),
          Number: mobileNumber,
        },
      })
      .then(async (data) => {
        const response = data.data.data;
        if (response.alreadyGivenTest) {
          navigate(
            `/check_duplicate/name=${first_name}_${middle_name}_${last_name}&number=${mobileNumber}&stage=${response.pendingInterviewStage}`,
            {
              state: {
                ...state,
                data: response.data,
              },
            }
          );
        } else {
          const res = await generateTestLink();

          setState({
            ...state,
            mobileNumber: "",
            firstName: "",
            middleName: "",
            lastName: "",
            enrollmentKey: res.data.key,
          });
          fetchingFinish();

          navigate(`/test/instructions`, {
            state: {
              firstName,
              middleName,
              lastName,
              mobileNumber,
              enrollmentKey: res.data.key,
              partner: { slug, partnerId: state.partnerId },
            },
          });
        }
      });
  };

  const giveTest = async () => {
    const { mobileNumber, firstName, lastName } = state;
    if (!mobileNumber || !firstName || !lastName) {
      enqueueSnackbar(<strong>{lang.mandatoryField[selectedLang]}</strong>, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }
    if (mobileNumber.toString().length !== 10) {
      enqueueSnackbar(<strong>{lang.mobileNumber[selectedLang]}</strong>, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }
    await isDuplicate();
  };

  // if (slug && testClosed.includes(slug))
  //   return (
  //     <Container sx={{ display: "flex", justifyContent: "center" }}>
  //       <Typography color="error" variant="h4">
  //         Tests will open on 10th July
  //       </Typography>
  //     </Container>
  //   );

  const { mobileNumber, firstName, middleName, lastName, mobile } = state;
  return (
    <div
      style={{
        flexDirection: "column",
        // justifyContent: "space-between",
        alignItems: "center",
        // minHeight: "calc(100vh - 8rem)",
        display: "flex",
      }}
    >
      <ThemeProvider theme={theme}>
        {goToTest ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back to Test
          </Button>
        ) : null}
        <Typography className={classes.paper}>
          {lang.Heading[selectedLang]}
        </Typography>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              display: "flex",
              p: "0.4rem",
              // border: "1px solid black",
              overflowX: "hidden",
              overflowY: "scroll",
              height: {
                xs: "100%",
                sm: "calc(100vh - 14rem)",
              },
            }}
            className="custom-scroll"
          >
            <VideoSlider
              customLinks={[
                {
                  label: {
                    hi: "रानी पंडित की कहानी!",
                    en: "Rani Pandit's Story",
                    ma: "राणी पंडितची गोष्ट",
                  },
                  videoId: "XJ6hcfkSDkw",
                },
                {
                  label: {
                    hi: "नवगुरुकुल क्या है २ मिनट मे समजे!",
                    en: "2 mins introduction to NavGurukul",
                    ma: "नवगुरुकुलचा 2 मिनिटे परिचय",
                  },
                  videoId: "HjqfZ-Matyk",
                },
                {
                  label: {
                    hi: "नवगुरुकुल परीक्षा को कैसे क्रैक करें",
                    en: "How to crack NavGurukul Examination",
                    ma: "नवगुरुकुल परीक्षा कशी क्रॅक करावी",
                  },
                  videoId: "ivHrBBRAp9s",
                },
              ]}
              language={selectedLang}
            />

            <Grid
              container
              spacing={2}
              sx={{
                mt: "1.2rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Grid item xs={6} xl={4}>
                <Typography variant="h5" textAlign="center">
                  प्रवेश पात्रता
                </Typography>
                <List sx={{ listStyleType: "disc", ml: "1.4rem" }}>
                  {[
                    "वयोमर्यादा: १७ ते २८",
                    "किमान शैक्षणिक पात्रता: १२वी पास  (विज्ञान, कला अथवा वाणिज्य) / ITI पूर्ण",
                    "अमरावती विभागातील   (अमरावती, अकोला, यवतमाळ,बुलढाणा व वाशीम जिल्ह्यातील ) रहिवासी",
                    "पालक शासकीय क्षेत्रातील नोकरीत नसावे",
                    "आर्थिकदृष्ट्या दुर्बल   घटकातील",
                    "महिलांना प्राधान्य",
                  ].map((el) => (
                    <ListItem
                      key={el}
                      sx={{
                        display: "list-item",
                        py: "0.1rem",
                        pl: "0.4rem",
                      }}
                    >
                      {el}
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6} xl={4}>
                <Typography
                  variant="h5"
                  textAlign="center"
                  sx={{ border: "1px solid black", mt: "-2.7rem" }}
                >
                  प्रशिक्षण वैशिष्ठ
                </Typography>
                <List sx={{ listStyleType: "disc" }}>
                  {[
                    "प्रशिक्षण कालावधी - १८ महिने",
                    "निशुल्क प्रशिक्षण, निवास व भोजन व्यवस्था",
                    "प्रशिक्षण कालावधीमध्ये लॅपटॉप दिले जाईल",
                    "प्रशिक्षित व तज्ञ प्रशिक्षकांकडून मार्गदर्शन",
                    "संभाषण कौशल्य व व्यक्तिमत्व विकासावर भर",
                    "प्रशिक्षण व मुल्यामापनानंतर नामांकित कं पनी / स्टार्ट अप मध्ये रोजगाराची हमी",
                  ].map((el) => (
                    <ListItem
                      key={el}
                      sx={{
                        display: "list-item",
                        py: "0.1rem",
                        pl: "0.4rem",
                      }}
                    >
                      {el}
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid
                item
                xs={6}
                xl={4}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography textAlign="center" variant="h5">
                  संपर्क
                </Typography>
                <Typography
                  textAlign="center"
                  variant="body1"
                  fontWeight="bold"
                >
                  जिल्हा कौशल्य विकास , रोजगार व उद्योजकता मार्गदर्शन कें द्र
                </Typography>
                <List sx={{ listStyleType: "disc" }}>
                  {[
                    "अमरावती: ९४०५१०२६००/०७२१२ ५६६०६६",
                    "बुलढाणा: ९७५७०८६६०३/०७२६२ २४२३४२",
                    "अकोला: ८२७५३६९८००/०७२४२ ४३३८४९",
                    "यवतमाळ: ८३७९८९८७९८/०७२३२ २४४३९५",
                    "वाशीम: ९०९६८५५७९८/०७२५२ २३१४९४",
                  ].map((el) => (
                    <ListItem
                      key={el}
                      sx={{
                        display: "list-item",
                        py: "0rem",
                        pl: "0.4rem",
                        // pl: "3.2rem",
                      }}
                    >
                      {el}
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid
                item
                xs={6}
                xl={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  textAlign="center"
                  fontWeight="bold"
                  // sx={{ pt: "0.8rem" }}
                >
                  प्रवेश परीक्षा पद्धती
                </Typography>
                <Typography
                  textAlign="center"
                  variant="body1"
                  fontWeight="bold"
                >
                  (ऑनलाईन व ऑफलाईन)
                </Typography>
                <List sx={{ listStyleType: "disc" }}>
                  {[
                    "अमरावती: ९४०५१०२६००/०७२१२ ५६६०६६",
                    "बुलढाणा: ९७५७०८६६०३/०७२६२ २४२३४२",
                    "अकोला: ८२७५३६९८००/०७२४२ ४३३८४९",
                    "यवतमाळ: ८३७९८९८७९८/०७२३२ २४४३९५",
                    "वाशीम: ९०९६८५५७९८/०७२५२ २३१४९४",
                  ].map((el) => (
                    <ListItem
                      key={el}
                      sx={{
                        display: "list-item",
                        py: "0rem",
                        pl: "0.4rem",
                      }}
                    >
                      {el}
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            {/* <Box
                sx={{
                  width: {
                    sm: "45%",
                    lg: "30%",
                  },
                }}
              >
                
              </Box> */}
          </Grid>
          <Grid item container spacing={1} xs={12} sm={6}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                textAlign="center"
                fontWeight="bold"
                sx={{ pt: "0.8rem" }}
              >
                ऑनलाईन परीक्षा : १० - २३ जुलै २०२२
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.loginContainer}>
              {/* <Paper className={classes.loginContainer}> */}
              <Box>
                <Typography variant="h5" component="h4">
                  {lang.AdmisssionTitle[selectedLang]}
                </Typography>
              </Box>
              <Box style={{ height: theme.spacing(2) }} />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  required
                  id="filled-full-width"
                  margin="normal"
                  style={{ margin: 8 }}
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  placeholder="First Name..."
                  onChange={onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <TextField
                  id="filled-full-width"
                  margin="normal"
                  style={{ margin: 8 }}
                  name="middleName"
                  label="Middle Name"
                  value={middleName}
                  placeholder="Middle Name..."
                  onChange={onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Box>
              <div
                style={{
                  display: "flex",
                }}
              >
                <TextField
                  required
                  id="filled-full-width"
                  margin="normal"
                  name="lastName"
                  style={{ margin: 8 }}
                  label="Last Name"
                  value={lastName}
                  placeholder="Last Name..."
                  onChange={onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <TextField
                  required
                  id="filled-full-width"
                  margin="normal"
                  style={{
                    margin: 8,
                  }}
                  type="number"
                  name="mobileNumber"
                  label="Mobile Number"
                  value={mobileNumber}
                  placeholder="Mobile Number..."
                  onChange={onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </div>
              <div className={classes.root}>
                <Button variant="outlined" onClick={giveTest} color="primary">
                  {lang.TestButton[selectedLang]}
                </Button>
              </div>
            </Grid>
            <Box style={{ height: theme.spacing(6) }} />
            <Grid item>
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                px={4}
                style={{ textAlign: "center" }}
              >
                <Typography
                  className={classes.typography}
                  variant="h5"
                  component="h3"
                >
                  {lang.Status[selectedLang]}
                </Typography>
              </Box>
            </Grid>
            <Grid item className={classes.loginContainer}>
              <Box>
                <TextField
                  id="filled-full-width"
                  margin="normal"
                  style={{ margin: 8 }}
                  label="Mobile Number"
                  value={state.mobile}
                  placeholder="Mobile Number..."
                  onChange={onChangeEventStatus}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </Box>
              <div className={classes.root}>
                <Link
                  to={{
                    pathname: `/status/${mobile}`,
                    state: { mobile },
                  }}
                >
                  <Button variant="outlined" color="primary">
                    {lang.StatusButton[selectedLang]}
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
      {/* <Box style={{ height: theme.spacing(6) }} /> */}
    </div>
  );
};

export default CustomLandingPage;
