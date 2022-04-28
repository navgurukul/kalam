import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { GoogleLogin } from "react-google-login";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import theme from "../../theme";
import { loginWithGoogle } from "../../store/slices/authSlice";

const baseUrl = import.meta.env.VITE_API_URL;

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
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [specialLogin, setSpecialLogin] = React.useState([]);
  const callSnack = (msg, variant) => {
    enqueueSnackbar(msg, { variant });
  };
  const handleLogin = (response) =>
    dispatch(loginWithGoogle({ specialLogin, response, callSnack }));
  //maintaing a state for special login
  // state = {
  //   specialLogin: [],
  // };
  useEffect(() => {
    axios.get(`${baseUrl}rolebaseaccess`).then((res) => {
      setSpecialLogin(res.data.specialLogin);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/students", { replace: true });
  }, [isAuthenticated]);

  // const responseGoogle = (response) => {
  //   if (
  //     response.profileObj.email.includes("@navgurukul.org") ||
  //     specialLogin.includes(response.profileObj.email)
  //   ) {
  //     axios
  //       .post(`${baseUrl}users/login/google`, {
  //         idToken: response.tokenObj.id_token,
  //       })
  //       .then((resp) => {
  //         const { userToken, user } = resp.data;
  //         axios.get(`${baseUrl}rolebaseaccess/email`).then((res) => {
  //           const { data } = res;
  //           const userRoles = data.find((role) => role.email === user.email);
  //           if (userRoles) {
  //             localStorage.setItem("roles", JSON.stringify(userRoles.roles));
  //             localStorage.setItem(
  //               "privileges",
  //               JSON.stringify(userRoles.privilege)
  //             );
  //           } else {
  //             localStorage.setItem("roles", JSON.stringify([]));
  //             localStorage.setItem("privileges", JSON.stringify([]));
  //           }
  //           localStorage.setItem("jwt", userToken);
  //           localStorage.setItem("user", JSON.stringify(user));
  //           if (user.mobile) {
  //             handleLogin();
  //             navigate("/students");
  //           } else {
  //             handleLogin();
  //             navigate("/user/mobile/number");
  //           }
  //         });
  //       });
  //   } else {
  //     snackbar.enqueueSnackbar("Only Accessible by Navgurukul user ID", {
  //       variant: "message",
  //       anchorOrigin: {
  //         vertical: "bottom",
  //         horizontal: "left",
  //       },
  //     });
  //   }
  // };

  const errr = () => {
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
      justifyContent="center"
      // width="0%"
      style={{ margin: "" }}
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
              onSuccess={handleLogin}
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
