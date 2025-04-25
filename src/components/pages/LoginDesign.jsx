import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { GoogleLogin } from "react-google-login";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import theme from "../../theme";
import { loginWithGoogle } from "../../store/slices/authSlice";
import { decryptText } from "../../utils";
import html2pdf from "html2pdf.js";

// const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles(() => ({
  loginContainer: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(4),
  },
}));

const LoginDesign = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const [specialLogin, setSpecialLogin] = React.useState([]);
  const [goToTest, setGoToTest] = React.useState();
  const handleLogin = (response) => dispatch(loginWithGoogle({ response }));
  //maintaing a state for special login
  // state = {
  //   specialLogin: [],
  // };

  const downloadPDF = () => {
    const element = document.getElementById("question-pdf-content");
    html2pdf()
      .set({
        margin: 10,
        filename: `question-${question.topic || "question"}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const getTestData = () => ({
    enrollmentKey: localStorage.getItem("enrollmentKey"),
    time: localStorage.getItem("time"),
    studentId: localStorage.getItem("studentId"),
  });

  const { enrollmentKey, time } = getTestData();
  useEffect(() => {
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/students", { replace: true });
    }
  }, [isAuthenticated]);

  const errr = () => {
    alert("There was some issue with Google Login. Contact the admin.");
  };

  const getQuote = React.useCallback(() => {
    const QUOTES = [
      {
        quote:
          "Anyone who has never made a mistake has never tried anything new",
        author: "Albert Einstein",
      },
      {
        quote:
          "The only person who is educated is the one who has learned how to learn …and change.",
        author: "Carl Rogers",
      },
      {
        quote: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi",
      },
      {
        quote:
          "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela",
      },
      {
        quote:
          "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
        author: "Rumi",
      },
    ];
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return quote;
  }, []);
  const { quote, author } = getQuote();

  const question = {
    id: 560,
    common_text: null,
    en_text:
      "<p>For the next three questions, think practically on how you can solve these questions. For example, if you can plant 100 trees in an hour, then how many can you plant in 4 hours? Answer will be 100 multiplied by 4. Since the amount of work you can do in one hour, four times of that you can do in four hours. By thinking on similar practical lines, answer following four questions.\n" +
      "\n" +
      "To prepare 200 glasses of lemonade (nimbu paani)\n" +
      "10 people take 20 mins in total.\n" +
      "Then in how much time 20 people\n" +
      "can prepare 200 glasses of lemonade?\n" +
      "\n" +
      "\n" +
      "</p>\n",
    hi_text:
      "<p>Agle teen questions ko karne ke liye, thoda sa practical life ke examples le kar sochiye ki kaise honge. Jaise agar aap maan lo ki aap ek ghante mei 100 paudhe laga sakte hai, toh aap 4 mei kitne laga paoge? 100 ko 4 se guna kar doge, utne. Kyuki jitna kaam aap ek ghante mei karoge, uska 4 guna kaam aap 4 ghante mei kar sakte ho. Issi tarah se sochte hue, yeh teen questions answer karo.\n" +
      "\n" +
      "Agar 200 glasses nimbu paani banane ke liye,    \n" +
      "10 log (people) 20 mins lete hai.            \n" +
      "Toh 20 log - kitne samay mei                \n" +
      "200 glasses nimbu paani bana sakte hai?\n" +
      "\n" +
      "\n" +
      "</p>\n",
    difficulty: 1,
    topic: "Unitary Method",
    type: 2,
    created_at: "2019-05-30 11:25:37.017",
    ma_text:
      "<p>पुढील ३ प्रश्न सोडवण्या साठी थोडा दैनंदिन जीवनातील उदाहरणांचा विचार\n" +
      "करावा लागेल. जसे कि समजा तुम्ही एका तासात १०० झाडे लावू शकता तर ४\n" +
      "तासात किती लावू शकाल ? १०० ला ४ने गुणा, तितके.\n" +
      "कारण जितके काम एका तासात करू शकाल त्याच्या ४ पट काम ४ तासात करू\n" +
      "शकता. अशा प्रकारे विचार करून हे तीन प्रश्न सोडवा.\n" +
      "\n" +
      "जर २०० ग्लास लिंबू पाणी बनवण्या साठी १० लोकांना २० मिनिटे लागतात, तर\n" +
      "२० लोक किती वेळात २०० ग्लास लिंबू पाणी बनवू शकतील ?</p>\n",
    schoolId: null,
    school_test: null,
    options: [Array],
  };

  return (
    // <Grid
    //   container
    //   spacing={0}
    //   alignItems="center"
    //   justifyContent="center"
    //   // width="0%"
    //   style={{ margin: "" }}
    // >
    //   <Box className={classes.container}>
    //     {goToTest ? (
    //       <Button
    //         variant="text"
    //         color="primary"
    //         onClick={() => navigate(-1)}
    //         size="large"
    //       >
    //         Go Back to Test
    //       </Button>
    //     ) : null}
    //     <Paper className={classes.loginContainer}>
    //       <Box>
    //         <Typography variant="h5" component="h3">
    //           Admissions Admin Portal
    //         </Typography>
    //       </Box>
    //       <Box style={{ height: theme.spacing(5) }} />
    //       <Box>
    //         <GoogleLogin
    //           clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
    //           buttonText="Login with Google"
    //           onSuccess={handleLogin}
    //           onFailure={errr}
    //           scope="profile email"
    //         />
    //       </Box>
    //       <Box style={{ height: theme.spacing(7) }} />
    //       <Box className={classes.quoteContainer}>
    //         <Box className={classes.quoteText}>
    //           <Typography variant="body1">{quote}</Typography>
    //         </Box>
    //         <Box className={classes.quoteAuthor}>
    //           <Typography
    //             variant="body2"
    //             style={{ textAlign: "right", fontWeight: "bold" }}
    //           >
    //             {`- ${author}`}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     </Paper>
    //   </Box>
    // </Grid>

    <div>
      {/* Hidden content or styled content to export */}
      <div
        id="question-pdf-content"
        style={{ padding: "1rem", background: "#fff" }}
      >
        <h2>Topic: {question.topic}</h2>
        <p>
          <strong>Difficulty:</strong> {question.difficulty}
        </p>

        <h3>English</h3>
        <div dangerouslySetInnerHTML={{ __html: question.en_text }} />

        <h3>हिंदी</h3>
        <div dangerouslySetInnerHTML={{ __html: question.hi_text }} />

        <h3>मराठी</h3>
        <div dangerouslySetInnerHTML={{ __html: question.ma_text }} />
      </div>

      <button onClick={downloadPDF} style={{ marginTop: "1rem" }}>
        Download PDF
      </button>
    </div>
  );
};

export default LoginDesign;
