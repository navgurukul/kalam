import React, { Fragment } from "react";
import axios from "axios";
import AddBox from "@material-ui/icons/AddBox";
import { Box } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import Spinner from "react-spinner-material";

const baseUrl = process.env.API_URL;

export const CreateAssessment = (props) => {
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    dialogOpen: false,
    inputValue: "",
    loading: false,
  });

  const createAssessment2 = async () => {
    await handleClose();
    await setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    createAssessment();
  };

  const createAssessment = async () => {
    try {
      const dataURL = baseUrl + "partners/" + props.partnerId + "/assessments";
      await axios
        .post(dataURL, {
          name: state.inputValue,
        })
        .then(() => {
          setState({
            ...state,
            loading: false,
          });
          snackbar.enqueueSnackbar("Assessment successfully created!", {
            variant: "success",
          });
        });
    } catch (e) {
      snackbar.enqueueSnackbar(e, { variant: "error" });
    }
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

  const onChangeEvent = (e) => {
    setState({
      ...state,
      inputValue: e.target.value,
    });
  };
  const { loading } = state;
  return (
    <Fragment>
      <Box onClick={handleOpen}>
        <AddBox />
        <Spinner
          size={35}
          spinnerColor={"#ed343d"}
          spinnerWidth={5}
          visible={loading}
        />
      </Box>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Create New Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the paper set name
          </DialogContentText>
          <TextField
            label="Paper set name"
            value={state.inputValue}
            placeholder="Set A"
            onChange={onChangeEvent}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={createAssessment2}
          >
            CREATE
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CreateAssessment;
