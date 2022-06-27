/* eslint-disable prefer-destructuring */
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button, Dialog, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";

import EditIcon from "@mui/icons-material/Edit";
import { changeFetching } from "../../store/slices/uiSlice";
import { decryptText } from "../../utils";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const OtherActivities = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [state, setState] = React.useState({
    otherActivities: "",
    dialogOpen: false,
  });
  const addActivities = async () => {
    try {
      fetchingStart();
      const { change, rowMetaTable } = props;
      const { rowData, columnIndex } = rowMetaTable;
      let studentId;

      if (window.location.pathname.includes("/campus")) {
        studentId = rowData[0];
      } else {
        studentId = rowData[0];
      }
      const dataURL = `${baseUrl}students/updateDetails/${studentId}`;

      await axios
        .put(dataURL, {
          other_activities: state.otherActivities,
        })
        .then(() => {
          //console.log(response.data);
          setState({
            ...state,
            dialogOpen: false,
          });
          snackbar.enqueueSnackbar("Other Activities are successfully added!", {
            variant: "success",
          });
          change(state.otherActivities);
        });

      fetchingFinish();
    } catch (e) {
      snackbar.enqueueSnackbar("Please select student Status", {
        variant: "error",
      });
      fetchingFinish();
    }
  };

  const onSubmit = () => {
    setState({
      ...state,
      loading: true,
    });
    addActivities();
  };

  // const validate = () => {};

  const handleChange = (name) => (event) => {
    const valChange = {};
    valChange[name] = event.target.value;

    setState({ ...state, [name]: event.target.value });
  };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      dialogOpen: true,
    });
  };
  const addActitiviesDetails = (otherActivities) => {
    const currentUser = `@${
      loggedInUser
        ? loggedInUser.user_name.toString().split(" ").join("").toLowerCase()
        : "guest"
    }`;

    return otherActivities
      ? `${currentUser}: \n\n${otherActivities}`
      : `${currentUser}: \n\n`;
  };

  const { otherActivities } = props;

  return (
    <>
      <Box onClick={handleOpen}>
        <EditIcon style={{ cursor: "pointer" }} />
      </Box>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <form className={classes.container}>
          <h1 style={{ color: "#f05f40", textAlign: "center" }}>
            Add Other Activities
          </h1>
          <TextField
            id="outlined-multiline-static"
            label="Other Activities"
            multiline
            rows="6"
            name="otherActivities"
            defaultValue={addActitiviesDetails(otherActivities)}
            onChange={handleChange("otherActivities")}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit()}
            className={classes.btn}
          >
            Submit
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default OtherActivities;
