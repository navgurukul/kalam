import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { GoogleLogin } from "react-google-login";
import { login } from "../store/actions/auth";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import { theme } from "../theme/theme";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
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

const LoginDesign = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const handleLogin = () => dispatch(login());
  const [specialLogin, setSpecialLogin] = React.useState([]);
  //maintaing a state for special login
  // state = {
  //   specialLogin: [],
  // };
  useEffect(() => {
    axios.get(`${baseUrl}rolebaseaccess`).then((res) => {
      setSpecialLogin(res.data.specialLogin);
    });
  }, []);

  const responseGoogle = (response) => {
    if (
      response.profileObj.email.includes("@navgurukul.org") ||
      specialLogin.includes(response.profileObj.email)
    ) {
      axios
        .post(`${baseUrl}users/login/google`, {
          idToken: response.tokenObj.id_token,
        })
        .then((resp) => {
          const { userToken, user } = resp.data;
          localStorage.setItem("jwt", userToken);
          localStorage.setItem("user", JSON.stringify(user));
          if (user.mobile) {
            const { history } = props;
            console.log(history, "hi");
            handleLogin();
            history.push("/students");
          } else {
            const { history } = props;
            handleLogin();
            history.push("/user/mobile/number");
          }
        });
    } else {
      snackbar.enqueueSnackbar("Only Accessible by Navgurukul user ID", {
        variant: "message",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
      });
    }
  };

  const errr = (error) => {
    console.error(error);
    alert("There was some issue with Google Login. Contact the admin.");
  };

  const getQuote = () => {
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
  };
  // console.log(classes);
  const quote = getQuote();

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      width="0%"
      style={{ minHeight: "83vh" }}
    >
      <Box className={classes.container}>
        <Paper className={classes.loginContainer}>
          <Box>
            <Typography variant="h5" component="h3">
              NavGurukul Admissions
            </Typography>
          </Box>
          <Box style={{ height: theme.spacing(5) }} />
          <Box>
            <GoogleLogin
              clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={errr}
              scope="profile email"
            />
          </Box>
          <Box style={{ height: theme.spacing(7) }} />
          <Box className={classes.quoteContainer}>
            <Box className={classes.quoteText}>
              <Typography variant="body1">{quote.quote}</Typography>
            </Box>
            <Box className={classes.quoteAuthor}>
              <Typography
                variant="body2"
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                {quote.author}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
};

export default LoginDesign;
