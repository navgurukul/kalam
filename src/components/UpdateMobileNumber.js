import React, { Fragment } from "react";
import { useSelector } from "react-redux";

import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

// import { Dialog } from '@material-ui/core';
import { useSnackbar } from "notistack";
import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/styles";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { theme } from "../theme/theme";
import axios from "axios";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(4),
  },
  btn: {
    marginTop: theme.spacing(4),
  },
  userContact: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const UpdateMobileNumber = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { loggedInUser } = useSelector((state) => state.auth);
  const [mobileNumber, setMobileNumber] = React.useState("");

  const handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;

    setMobileNumber(event.target.value);
  };

  const dashBoard = () => {
    const mobile = mobileNumber;
    try {
      axios
        .post(`${baseUrl}students/mobile/${loggedInUser.id}`, {
          mobile: mobile,
        })
        .then(() => {
          enqueueSnackbar("Mobile number is successfully changed!", {
            variant: "success",
          });
          history.push("/students");
        });
    } catch (e) {
      enqueueSnackbar("Please enter valide mobile number!", {
        variant: "error",
      });
    }
  };

  return (
    <Fragment>
      <Box className={classes.container}>
        <Paper className={classes.userContact}>
          <Box>
            <Typography variant="h5" component="h3">
              Update Mobile Number
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
      {/* </Dialog>   */}
    </Fragment>
  );
};

export default UpdateMobileNumber;
