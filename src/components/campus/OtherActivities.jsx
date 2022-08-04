import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button, Dialog, Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";

import EditIcon from "@mui/icons-material/Edit";
import { changeFetching } from "../../store/slices/uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
    padding: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 380,
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const OtherActivities = ({ change, studentId, value }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [otherActivities, setOtherActivities] = React.useState(value);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const addActivities = () => {
    fetchingStart();

    axios
      .put(`${baseUrl}students/updateDetails/${studentId}`, {
        other_activities: otherActivities,
      })
      .then(() => {
        setDialogOpen(false);
        enqueueSnackbar("Other Activities are successfully added!", {
          variant: "success",
        });

        fetchingFinish();
        change(otherActivities);
      })
      .catch((e) => {
        enqueueSnackbar(`An error occurred  ${e.message}`, {
          variant: "error",
        });
        fetchingFinish();
      });
  };

  // const validate = () => {};

  const handleChange = (event) => setOtherActivities(event.target.value);

  const toggleDialog = () => setDialogOpen((prev) => !prev);

  const addActitiviesDetails = (rawOtherActivities) => {
    const currentUser = `@${
      loggedInUser
        ? loggedInUser.user_name.toString().split(" ").join("").toLowerCase()
        : "guest"
    }`;

    return rawOtherActivities
      ? `${currentUser}: \n\n${rawOtherActivities}`
      : `${currentUser}: \n\n`;
  };

  return (
    <>
      <IconButton onClick={toggleDialog}>
        <EditIcon style={{ cursor: "pointer" }} />
      </IconButton>
      <Dialog open={dialogOpen} onClose={toggleDialog}>
        <Box sx={{ py: "0.6rem", px: "0.2rem" }} className={classes.container}>
          <Typography
            variant="h4"
            fontWeight="medium"
            color="primary"
            textAlign="center"
            sx={{
              my: "0.2rem",
            }}
          >
            Add Other Activities
          </Typography>
          <TextField
            focused
            label="Other Activities"
            multiline
            rows="6"
            name="otherActivities"
            defaultValue={addActitiviesDetails(otherActivities)}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addActivities}
            className={classes.btn}
          >
            Submit
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default OtherActivities;
