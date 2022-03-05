import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { login } from "../store/actions/auth";

import Paper from "@material-ui/core/Paper";
import { makeStyles, MuiThemeProvider } from "@material-ui/styles";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { Button } from "@material-ui/core";
import { theme } from "../theme/theme";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
  userContact: {
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
  root: {
    "& > *": {
      margin: theme.spacing(1),
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
      .post(`${baseUrl}students/mobile/${loggedInUser.id}`, { mobile: mobile })
      .then((resp) => {
        const user = resp.data.data.user;
        if (user) {
          const { history } = props;
          localStorage.setItem("user", JSON.stringify(user));
          handleLogin();
          history.push("/students");
        }
      });
  };

  const handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;
    setMobileNumber(event.target.value);
  };

  return (
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  );
};

// const mapStateToProps = (state) => ({
//     loggedInUser: state.auth.loggedInUser,
// });

// const mapDispatchToProps = (dispatch) => ({
//     login: () => dispatch(login()),
// });

// export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserMobileNumber)))
export default UserMobileNumber;
