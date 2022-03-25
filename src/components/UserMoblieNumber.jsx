import React from "react";

import { makeStyles, ThemeProvider } from "@mui/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import theme from "../theme";
import { login } from "../store/actions/auth";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((_theme) => ({
  userContact: {
    padding: _theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: _theme.spacing(4),
  },
  root: {
    "& > *": {
      margin: _theme.spacing(1),
    },
  },
}));

const UserMobileNumber = (props) => {
  const classes = useStyles();
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogin = () => dispatch(login());
  const [mobileNumber, setMobileNumber] = React.useState("");

  const dashBoard = () => {
    const mobile = mobileNumber;
    axios
      .post(`${baseUrl}students/mobile/${loggedInUser.id}`, { mobile })
      .then((resp) => {
        const { user } = resp.data.data;
        if (user) {
          const { history } = props;
          localStorage.setItem("user", JSON.stringify(user));
          handleLogin();
          history.push("/students");
        }
      });
  };

  const handleChange = (name) => (event) => {
    const valChange = {};
    valChange[name] = event.target.value;
    setMobileNumber(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        <Paper className={classes.userContact}>
          <Box>
            <Typography variant="h5" component="h3">
              NavGurukul Admissions
            </Typography>
          </Box>
          <Box style={{ height: theme.spacing(5) }} />
          <Box>
            <FormControl>
              <InputLabel htmlFor="partnerName">Mobile Number</InputLabel>
              <Input
                id="partnerName"
                aria-describedby="my-helper-text"
                name="mobileNumber"
                value={mobileNumber}
                onChange={handleChange("mobileNumber")}
              />
              <FormHelperText id="my-helper-text">
                Apna Mobile Number Enter karein.
              </FormHelperText>
            </FormControl>
          </Box>
          <Box style={{ height: theme.spacing(2) }} />
          <div className={classes.root}>
            <Button variant="outlined" onClick={dashBoard} color="primary">
              Submit
            </Button>
          </div>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default UserMobileNumber;
