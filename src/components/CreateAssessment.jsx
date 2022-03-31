import React, { Fragment } from "react";
import axios from "axios";
import AddBox from "@mui/icons-material/AddBox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Spinner from "react-spinner-material";

const baseUrl = import.meta.env.VITE_API_URL;

export const CreateAssessment = (props) => {
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    dialogOpen: false,
    inputValue: "",
    loading: false,
  });
  const createAssessment = async () => {
    const { partnerId } = props;
    const dataURL = `${baseUrl}partners/${partnerId}/assessments`;
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
      })
      .catch((e) => {
        snackbar.enqueueSnackbar(e, { variant: "error" });
      });
  };
  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const createAssessment2 = async () => {
    handleClose();
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    createAssessment();
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
    <>
      <Box>
        {loading ? null : (
          <IconButton onClick={handleOpen}>
            <AddBox />
          </IconButton>
        )}
        <Spinner size={35} color="#ed343d" width={5} visible={loading} />
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
    </>
  );
};

export default CreateAssessment;
