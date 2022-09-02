/* eslint-disable camelcase */
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Divider, List, ListItem } from "@mui/material";
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
import { decryptText, encryptText } from "../../utils";
import { testClosed } from "../../utils/constants";
import Carousel from "../ui/Carousel";
import akansha1 from "../../assets/img/akansha/1.jpg";
import akansha2 from "../../assets/img/akansha/2.jpg";
import akansha3 from "../../assets/img/akansha/3.jpg";
import akansha4 from "../../assets/img/akansha/4.jpg";
import akansha5 from "../../assets/img/akansha/5.jpg";
import mhGovtLogo from "../../assets/img/akansha/mh-govt-logo.jpg";
import MSSDSLogo from "../../assets/img/akansha/MSSDS-logo.jpg";
import sdeedLogo from "../../assets/img/akansha/sdeed-logo.png";
import amravatiSelectionList from "../../assets/amravati/Amravati_Selection_List.pdf";
import {
  setEnrollmentKey,
  setPartner,
  setStudentData,
} from "../../store/slices/onlineTestSlice";

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
    // marginTop: theme.spacing(2),
    // padding: theme.spacing(1),
    // textAlign: "center",
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
  logo: {
    [theme.breakpoints.up("xs")]: {
      width: "35px",
      height: "35px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "80px",
      height: "80px",
    },
    [theme.breakpoints.up("xl")]: {
      width: "100px",
      height: "100px",
    },
  },
  goForTestButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
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
  // const [goToTest, setGoToTest] = React.useState(false);
  // const testClosed = ["amravati"];
  const lang = {
    Heading: {
      en: "AKANKSHA",
      hi: "आकांक्षा",
      ma: "आकांक्षा",
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
    courseDetails: [
      {
        en: "Special Course for Women : 2022 - 2024",
        hi: "महिलाओं के लिए विशेष पाठ्यक्रम : 2022 - 2024",
        ma: "महिलांकरिता विशेष कोर्स - २०२२-२४",
        isBold: false,
      },
      {
        en: "(Advanced Diploma in Software Programming)",
        hi: "(सॉफ्टवेयर प्रोग्रामिंग में उन्नत डिप्लोमा)",
        ma: "(अडव्हांस डिप्लोमा इन सॉफ्टवेअर प्रोग्रामिंग )",
        isBold: false,
      },
      {
        en: "Hurry Up...! Register Now!",
        hi: "जल्दी करो...! अभी पंजीकरण करें!",
        ma: "त्वरित अर्ज करा, प्रवेश प्रक्रिया सुरु!",
        isBold: true,
      },
      {
        en: "200 Seats only...!",
        hi: "सिर्फ 200 सीट...!",
        ma: "केवळ २०० जागा..!",
        isBold: true,
      },
    ],
    trainingVenue: {
      en: "Training Venue: ",
      hi: "प्रशिक्षण स्थल: ",
      ma: "प्रशिक्षण स्थळ: ",
      venue: {
        en: "Dr Punjabrao Deshmukh Vidarbha Administrative & Development Training Academy, Amravati (Prabodhini Amravati)",
        hi: "डॉ पंजाबराव देशमुख विदर्भ प्रशासनिक एवं विकास प्रशिक्षण अकादमी, अमरावती (प्रबोधिनी अमरावती)",
        ma: "डॉ. पंजाबराव देशमुख विदर्भ प्रशासकीय व विकास प्रशिक्षण प्रबोधिनी, अमरावती (प्रबोधिनी अमरावती)",
      },
    },
    exam: [
      {
        en: "Online Exam",
        hi: "ऑनलाइन परीक्षा",
        ma: "ऑनलाईन परीक्षा",
        date: {
          en: "10 - 30 July 2022",
          hi: "१० - ३० जुलै २०२२",
          ma: "१० - ३० जुलै २०२२",
        },
      },
      {
        en: "Offline Exam",
        hi: "ऑफलाइन परीक्षा",
        ma: "ऑफलाइन परीक्षा",
        date: {
          en: "7th August 2022",
          hi: "७ ऑगस्ट २०२२",
          ma: "७ ऑगस्ट २०२२",
        },
      },
    ],

    eligibilityCriteria: {
      en: "Eligibility Criteria for Admission",
      hi: "प्रवेश पात्रता मानदंड",
      ma: "प्रवेश पात्रता",
      criteria: [
        {
          en: "Age: 17-28 years",
          hi: "आयु: १७ से २८ वर्ष",
          ma: "वयोमर्यादा: १७ ते २८",
        },
        {
          en: "Education: 12th Pass (Science, Arts or Commerce)/Completed ITI",
          hi: "शिक्षा : 12वीं पास (विज्ञान, कला या वाणिज्य) / पूर्ण ITI",
          ma: "किमान शैक्षणिक पात्रता: १२वी पास  (विज्ञान, कला अथवा वाणिज्य) / ITI पूर्ण",
        },
        {
          en: "Residents of Amravati & Nagpur Division (Amravati, Akola, Yavatmal, Buldhana, Washim, Nagpur, Gondia, Bhandara, Chadrapur, Gadchiroli and Wardha)",
          hi: "अमरावती और नागपुर के निवासी संभाग (अमरावती, अकोला, यवतमाल, बुलढाणा, वाशिम, नागपुर, गोंदिया, भंडारा, चद्रपुर, गढ़चिरौली और वर्धा)",
          ma: "अमरावती व नागपूर विभागातील रहिवासी (अमरावती, अकोला, यवतमाळ,बुलढाणा, वाशीम, नागपूर, चंद्रपूर, गडचिरोली, गोंदिया, भंडारा व वर्धा )",
        },
        {
          en: "Neither Parent should be in Government Sector job",
          hi: "कोई भी अभिभावक सरकारी क्षेत्र की नौकरी में नहीं होना चाहिए",
          ma: "पालक शासकीय क्षेत्रातील नोकरीत नसावे",
        },
        {
          en: "Women from Economically Vulnerable Sections will be given preference",
          hi: "आर्थिक रूप से महिलाएं कमजोर धाराएं दी जाएंगी पसंद",
          ma: "आर्थिकदृष्ट्या दुर्बल   घटकातील महिलांना प्राधान्य",
        },
      ],
    },
    trainingFeatures: {
      en: "Training Features",
      hi: "प्रशिक्षण सुविधाएँ",
      ma: "प्रशिक्षण वैशिष्ठे",
      features: [
        {
          en: "Duration of training: 18 months",
          hi: "प्रशिक्षण की अवधि: 18 महीने",
          ma: "प्रशिक्षण कालावधी: १८ महिने",
        },
        {
          en: "Free of cost training, food and accommodation",
          hi: "नि:शुल्क प्रशिक्षण, भोजन और आवास",
          ma: "निशुल्क प्रशिक्षण, निवास व भोजन व्यवस्था",
        },
        {
          en: "Laptops will be provided during training",
          hi: "नि:शुल्क प्रशिक्षण, भोजन और आवास",
          ma: "प्रशिक्षण कालावधीमध्ये लॅपटॉप दिले जाईल",
        },
        {
          en: "Guidance from expert trainers",
          hi: "विशेषज्ञ प्रशिक्षकों से मार्गदर्शन",
          ma: "प्रशिक्षित व तज्ञ प्रशिक्षकांकडून मार्गदर्शन",
        },
        {
          en: "Emphasis on communication skills & personality development",
          hi: "संचार कौशल और व्यक्तित्व विकास पर जोर",
          ma: "संभाषण कौशल्य व व्यक्तिमत्व विकासावर भर",
        },
        {
          en: "Guaranteed job in reputed company/start-up on Navgurukul Foundation State Level Coordinator course completion & evaluation",
          hi: "प्रतिष्ठित कंपनी में नौकरी की गारंटी/नवगुरुकुल फाउंडेशन पर स्टार्ट-अप राज्य स्तरीय समन्वयक पाठ्यक्रम समापन और मूल्यांकन",
          ma: "प्रशिक्षण व मुल्यामापनानंतर नामांकित कं पनी / स्टार्ट अप मध्ये रोजगाराची हमी",
        },
      ],
    },
    goForTest: {
      en: "Go For Test",
      hi: "परीक्षण के लिए जाएं",
      ma: "परीक्षेला जा",
    },

    contact: {
      en: "Contact",
      hi: "संपर्क",
      ma: "संपर्क",
      center: {
        en: "District Skill Development, Employment & Duration of training: 18 months Entrepreneurship Guidance Center",
        hi: "जिला कौशल विकास, रोजगार एवं प्रशिक्षण की अवधि: 18 महीने उद्यमिता मार्गदर्शन केंद्र",
        ma: "जिल्हा कौशल्य विकास , रोजगार व उद्योजकता मार्गदर्शन केंद्र",
      },
      locations: [
        {
          en: "Amravati: 9405102600/07212 566066",
          hi: "अमरावती: ९४०५१०२६००/०७२१२ ५६६०६६",
          ma: "अमरावती: ९४०५१०२६००/०७२१२ ५६६०६६",
        },
        {
          en: "Buldhana: 9975704117/07262 242342",
          hi: "बुलढाणा: ९७५७०८६६०३/०७२६२ २४२३४२",
          ma: "बुलढाणा: ९७५७०८६६०३/०७२६२ २४२३४२",
        },
        {
          en: "Akola: 8275369800/07242 433849",
          hi: "अकोला: ८२७५३६९८००/०७२४२ ४३३८४९",
          ma: "अकोला: ८२७५३६९८००/०७२४२ ४३३८४९",
        },
        {
          en: "Yavatmal: 8379898798/07232 244395",
          hi: "यवतमाळ: ८३७९८९८७९८/०७२३२ २४४३९५",
          ma: "यवतमाळ: ८३७९८९८७९८/०७२३२ २४४३९५",
        },
        {
          en: "Washim: 9096855798/07252 231494",
          hi: "वाशीम: ९०९६८५५७९८/०७२५२ २३१४९४",
          ma: "वाशीम: ९०९६८५५७९८/०७२५२ २३१४९४",
        },
        {
          en: "Nagpur: 9324288721/07122 531213",
          hi: "नागपूर: ९३२४२८८७२१/०७१२२ ५३१२१३",
          ma: "नागपूर: ९३२४२८८७२१/०७१२२ ५३१२१३",
        },
        {
          en: "Chandrapur: 9309731562/ 07172 252295",
          hi: "चंद्रपूर: ९३०९७३१५६२/०७१७२ २५२२९५",
          ma: "चंद्रपूर: ९३०९७३१५६२/०७१७२ २५२२९५",
        },
        {
          en: "Gondia: 9284323141/07182 299150",
          hi: "गोंदिया: ९२८४३२३१४१/०७१८२ २९९१५०",
          ma: "गोंदिया: ९२८४३२३१४१/०७१८२ २९९१५०",
        },
        {
          en: "Gadchiroli: 8788146734/07132 295368",
          hi: "गडचिरोली: ८७८८१४६७३४/०७१३२ २९५३६८",
          ma: "गडचिरोली: ८७८८१४६७३४/०७१३२ २९५३६८",
        },
        {
          en: "Bhandara: 7620297377/07184 252250",
          hi: "भंडारा: ७६२०२९७३७७/०७१८४ २५२२५०",
          ma: "भंडारा: ७६२०२९७३७७/०७१८४ २५२२५०",
        },
        {
          en: "Wardha: 7620961335/07152 242756",
          hi: "वर्धा: ७६२०९६१३३५/०७१५२ २४२७५६",
          ma: "वर्धा: ७६२०९६१३३५/०७१५२ २४२७५६",
        },
      ],
      ng: {
        en: "Navgurukul Foundation",
        hi: "नवगुरुकुल फाउंडेशन",
        ma: "नवगुरूकू ल फॉउंडेशन",
      },
      ngContact: {
        en: "Nitesh (Delhi): 889130030",
        hi: "नितेश (दिल्ली):८८९१३००३००",
        ma: "नितेश (दिल्ली):८८९१३००३००",
      },
    },

    examMethod: {
      en: "Entrance Exam Methods",
      hi: "प्रवेश परीक्षा के तरीके",
      ma: "प्रवेश परीक्षा पद्धती",
      secondaryText: {
        en: "(Online or Offline)",
        hi: "जिला कौशल विकास, रोजगार एवं प्रशिक्षण की अवधि: 18 महीने उद्यमिता मार्गदर्शन केंद्र",
        ma: "(ऑनलाईन व ऑफलाईन)",
      },
      steps: [
        {
          en: "Written Examination",
          hi: "लिखित परीक्षा",
          ma: "चाळणी परीक्षा",
        },
        {
          en: "English Proficiency Test",
          hi: "अंग्रेजी प्रवीणता परीक्षा",
          ma: "इंग्रजी प्रवीणता चाचणी",
        },
        {
          en: "General Math Test",
          hi: "सामान्य गणित परीक्षा",
          ma: "सामान्य गणित चाचणी",
        },
        {
          en: "Interview with Parents",
          hi: "माता-पिता के साथ साक्षात्कार",
          ma: "पालकांसोबत मुलाखत",
        },
      ],
    },
    videoSLiderText: {
      en: "Videos to Get You Started...",
      hi: "आपको आरंभ करने के लिए वीडियो...",
      ma: "तुम्हाला सुरुवात करण्यासाठी व्हिडिओ...",
    },
    CarouselText: {
      en: "Campus Tour",
      hi: "कॅम्पस टूर",
      ma: "कॅम्पस टूर",
    },
    firstName: {
      en: "First Name",
      hi: "प्रथम नाम",
      ma: "पहिले नाव",
      error: {
        en: "Enter First Name",
        hi: "प्रथम नाम दर्ज करें",
        ma: "प्रथम नाव प्रविष्ट करा",
      },
    },
    middleName: {
      en: "Middle Name",
      hi: "मध्यनाम",
      ma: "मधले नाव",
      error: {
        en: "Enter Middle Name",
        hi: "मध्यनाम नाम दर्ज करें",
        ma: "मधले नाव प्रविष्ट करा",
      },
    },
    lastName: {
      en: "Last Name",
      hi: "कुलनाम",
      ma: "आडनाव",
      error: {
        en: "Enter Last Name",
        hi: "कुलनाम नाम दर्ज करें",
        ma: "आडनाव प्रविष्ट करा",
      },
    },
    mobNoField: {
      en: "Your Mobile Number",
      hi: "आपका व्हाट्सएप नंबर",
      ma: "तुमचा Whatsapp नंबर",
      error: {
        en: "Enter Mobile Number",
        hi: "मोबाइल नंबर दर्ज करें",
        ma: "मोबाइल नंबर टाका",
        pattern: {
          en: "No. should be of 10 digits",
          hi: "नंबर 10 अंकों का होना चाहिए",
          ma: "क्रमांक 10 अंकांचा असावा",
        },
      },
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
        // setGoToTest(true);
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
          dispatch(
            setStudentData({ firstName, middleName, lastName, mobileNumber })
          );
          dispatch(setEnrollmentKey(res.data.key));
          localStorage.setItem("partnerSlug", encryptText(slug));
          dispatch(setPartner({ slug, id: state.partnerId }));
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

  // if (slug && testClosed.partners.includes(slug))
  //   return (
  //     <Container sx={{ display: "flex", justifyContent: "center" }}>
  //       <Typography color="error" variant="h4">
  //         {testClosed.message}
  //       </Typography>
  //     </Container>
  //   );

  const { mobileNumber, firstName, middleName, lastName, mobile } = state;

  const akanshaImageList = [
    { label: "akansha1", imageUrl: akansha1 },
    { label: "akansha2", imageUrl: akansha2 },
    { label: "akansha3", imageUrl: akansha3 },
    { label: "akansha4", imageUrl: akansha4 },
    { label: "akansha5", imageUrl: akansha5 },
  ];

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
        {/* {goToTest ? (
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate(-1)}
            size="large"
          >
            Go Back to Test
          </Button>
        ) : null} */}

        <Grid container sx={{ mt: "2rem" }} spacing={2} justifyContent="center">
          <Grid
            item
            xs={10}
            sx={{ display: "flex", justifyContent: "center", mb: "3rem" }}
          >
            <a
              href={amravatiSelectionList}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Button
                variant="outlined"
                color="primary"
                sx={{ borderWidth: 3, ":hover": { borderWidth: 3 } }}
              >
                {" "}
                <Typography variant="h5" color="primary" fontWeight={500}>
                  Results are now Available!! Click Here
                </Typography>
              </Button>
            </a>
          </Grid>
          <Grid
            item
            xs={10}
            sm={5}
            sx={{
              flexDirection: "column",
              // alignItems: "center",
              display: "flex",
              p: "0.4rem",
              // border: "1px solid black",
              pl: "2rem",
              overflowX: "hidden",
              // overflowY: "scroll",
              // height: {
              //   xs: "100%",
              //   sm: "calc(100vh - 14rem)",
              // },
            }}
            className="custom-scroll"
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                className={classes.paper}
                fontWeight="bold"
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                {lang.Heading[selectedLang]}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.2rem",
                }}
              >
                <img
                  alt="Maharashtra Govt. Logo"
                  src={mhGovtLogo}
                  className={classes.logo}
                />
                <img
                  alt="SDEED Logo."
                  src={sdeedLogo}
                  width="100"
                  className={classes.logo}
                />
                <img
                  alt="MSSDS Logo>"
                  src={MSSDSLogo}
                  width="100"
                  className={classes.logo}
                />
              </Box>
            </Box>
            <Typography>कौशल्यातून जीवनोन्नतीकडे</Typography>
            <Divider color="gray" sx={{ my: "2rem" }} />
            {lang.courseDetails.map((courseDetail) => (
              <Typography
                key={courseDetail.en}
                fontWeight={courseDetail.isBold ? "bold" : "normal"}
              >
                {courseDetail[selectedLang]}
              </Typography>
            ))}
            <Typography sx={{ my: "1.6rem" }}>
              <b>{lang.trainingVenue[selectedLang]}</b>
              {lang.trainingVenue.venue[selectedLang]}
            </Typography>

            <Box sx={{ display: "flex", gap: "0.8rem" }}>
              {lang.exam.map((ex) => (
                <Box
                  key={ex.en}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "primary.main",
                    px: "0.2rem",
                    py: "0.4rem",
                    width: "8rem",
                    borderRadius: "10%",
                  }}
                >
                  <Typography fontWeight="bold">{ex[selectedLang]}</Typography>
                  <Typography>{ex.date[selectedLang]}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: "1.2rem" }}>
              <Typography variant="h6" fontWeight={500}>
                {lang.eligibilityCriteria[selectedLang]}
              </Typography>
              <List sx={{ listStyleType: "disc", ml: "1.4rem", mt: 0 }}>
                {lang.eligibilityCriteria.criteria.map((el) => (
                  <ListItem
                    key={el.en}
                    sx={{
                      display: "list-item",
                      py: "0.1rem",
                      pl: "0.4rem",
                    }}
                  >
                    <Typography variant="body1">{el[selectedLang]}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: "1.2rem" }}>
              <Typography variant="h6" fontWeight={500}>
                {lang.trainingFeatures[selectedLang]}
              </Typography>
              <List sx={{ listStyleType: "disc", ml: "1.4rem", mt: 0 }}>
                {lang.trainingFeatures.features.map((el) => (
                  <ListItem
                    key={el.en}
                    sx={{
                      display: "list-item",
                      py: "0.1rem",
                      pl: "0.4rem",
                    }}
                  >
                    <Typography variant="body1">{el[selectedLang]}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box sx={{ mt: "1.2rem" }} className={classes.goForTestButton}>
              <a href="#online-form">
                <Button variant="contained" color="primary">
                  {lang.goForTest[selectedLang]}
                </Button>
              </a>
            </Box>
            <Box sx={{ mt: "1.2rem" }}>
              <Typography variant="h6" fontWeight={500}>
                {lang.contact[selectedLang]}
              </Typography>
              <Typography variant="body1">
                {lang.contact.center[selectedLang]}
              </Typography>
              <List sx={{ listStyleType: "disc", ml: "1.4rem", mt: 0 }}>
                {lang.contact.locations.map((el) => (
                  <ListItem
                    key={el.en}
                    sx={{
                      display: "list-item",
                      py: "0rem",
                      pl: "0.4rem",
                      // pl: "3.2rem",
                    }}
                  >
                    <Typography variant="body1">{el[selectedLang]}</Typography>
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1" fontWeight={500}>
                {lang.contact.ng[selectedLang]}
              </Typography>
              <Typography variant="body1">
                {lang.contact.ngContact[selectedLang]}
              </Typography>
            </Box>
            <Divider color="gray" sx={{ my: "2rem" }} />
            <Box sx={{ mt: "1.2rem" }}>
              <Typography variant="h6" fontWeight={500}>
                {lang.examMethod[selectedLang]}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {lang.examMethod.secondaryText[selectedLang]}
              </Typography>
              <List sx={{ listStyleType: "number" }}>
                {lang.examMethod.steps.map((el) => (
                  <ListItem
                    key={el.en}
                    sx={{
                      display: "list-item",
                      py: "0rem",
                      pl: "0.4rem",
                      ml: "1.4rem",
                      mt: 0,
                    }}
                  >
                    <Typography variant="body1">{el[selectedLang]}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={10} sm={5}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight={500}
                sx={{ pt: "1.2rem", mb: "0.4rem" }}
              >
                {lang.videoSLiderText[selectedLang]}
              </Typography>
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
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight={500}
                sx={{ pt: "1.2rem", mb: "0.4rem" }}
              >
                {lang.CarouselText[selectedLang]}
              </Typography>
              <Carousel lang={lang} images={akanshaImageList} />
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: "1.2rem" }}>
          {slug && !testClosed.partners.includes(slug) && (
            <Grid
              item
              xs={12}
              md={12}
              className={classes.loginContainer}
              component="section"
              id="online-form"
            >
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
                  label={lang.firstName[selectedLang]}
                  name="firstName"
                  value={firstName}
                  placeholder={`${lang.firstName[selectedLang]}...`}
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
                  label={`${lang.firstName[selectedLang]}`}
                  value={middleName}
                  placeholder={`${lang.middleName[selectedLang]}...`}
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
                  label={`${lang.lastName[selectedLang]}...`}
                  value={lastName}
                  placeholder={`${lang.lastName[selectedLang]}...`}
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
                  label={lang.mobNoField[selectedLang]}
                  value={mobileNumber}
                  placeholder={lang.mobNoField[selectedLang]}
                  onChange={onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </div>
              <div className={classes.root}>
                <Button variant="contained" onClick={giveTest} color="primary">
                  {lang.TestButton[selectedLang]}
                </Button>
              </div>
            </Grid>
          )}
          <Box style={{ height: theme.spacing(6) }} />
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              px={4}
              sx={{ textAlign: "center", mb: "0.8rem" }}
            >
              <Typography
                className={classes.typography}
                variant="h5"
                component="h3"
              >
                {lang.Status[selectedLang]}
              </Typography>
            </Box>
            <Box>
              <TextField
                id="filled-full-width"
                margin="normal"
                style={{ margin: 8 }}
                label={lang.mobNoField[selectedLang]}
                value={state.mobile}
                placeholder={lang.mobNoField[selectedLang]}
                onChange={onChangeEventStatus}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Box>
            <div className={classes.root} style={{ marginBottom: "1.2rem" }}>
              <Link
                to={{
                  pathname: `/status/${mobile}`,
                  state: { mobile },
                }}
              >
                <Button variant="contained" color="primary">
                  {lang.StatusButton[selectedLang]}
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
      {/* <Box style={{ height: theme.spacing(6) }} /> */}
    </div>
  );
};

export default CustomLandingPage;
