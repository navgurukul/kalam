import React from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import { Dialog } from '@material-ui/core';
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import theme from "../theme";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((_theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: _theme.spacing(4),
  },
  btn: {
    marginTop: _theme.spacing(4),
  },
  userContact: {
    padding: _theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    "& > *": {
      margin: _theme.spacing(1),
    },
  },
}));

const UpdateMobileNumber = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.auth);
  const [mobileNumber, setMobileNumber] = React.useState("");

  const handleChange = (name) => (event) => {
    const valChange = {};
    valChange[name] = event.target.value;
    setMobileNumber(event.target.value);
  };

  const dashBoard = () => {
    const mobile = mobileNumber;
    try {
      axios
        .post(`${baseUrl}students/mobile/${loggedInUser.id}`, {
          mobile,
        })
        .then(() => {
          enqueueSnackbar("Mobile number is successfully changed!", {
            variant: "success",
          });
          navigate("/students");
        });
    } catch (e) {
      enqueueSnackbar("Please enter valide mobile number!", {
        variant: "error",
      });
    }
  };

  return (
    <>
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
    </>
  );
};

export default UpdateMobileNumber;
