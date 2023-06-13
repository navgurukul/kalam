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

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      // width="0%"
      style={{ margin: "" }}
    >
      <Box className={classes.container}>
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
        <Paper className={classes.loginContainer}>
          <Box>
            <Typography variant="h5" component="h3">
              Admissions Admin Portal
            </Typography>
          </Box>
          <Box style={{ height: theme.spacing(5) }} />
          <Box>
            <GoogleLogin
              clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={handleLogin}
              onFailure={errr}
              scope="profile email"
            />
          </Box>
          <Box style={{ height: theme.spacing(7) }} />
          <Box className={classes.quoteContainer}>
            <Box className={classes.quoteText}>
              <Typography variant="body1">{quote}</Typography>
            </Box>
            <Box className={classes.quoteAuthor}>
              <Typography
                variant="body2"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                {`- ${author}`}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
};

export default LoginDesign;
