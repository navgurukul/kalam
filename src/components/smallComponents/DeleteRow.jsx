import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteRow = (props) => {
  const snackbar = useSnackbar();
  const deleteTransition = () => {
    const { transitionId } = props;
    axios.delete(`${baseUrl}students/transition/${transitionId}`).then(() => {
      snackbar.enqueueSnackbar("Transition is successfully Deleted!", {
        variant: "success",
      });
    });
  };
  return (
    <Box textAlign="left" m={1}>
      <DeleteIcon
        onClick={deleteTransition}
        style={{ color: "#f05f40", cursor: "pointer" }}
      />
    </Box>
  );
};

export default DeleteRow;
