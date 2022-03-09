import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseUrl = process.env.API_URL;

const DeleteRow = (props) => {
  const snackbar = useSnackbar();
  const deleteTransition = () => {
    const { transitionId } = props;
    axios.delete(`${baseUrl}students/transition/${transitionId}`).then(() => {
      snackbar.enqueueSnackbar("Transition is successfully Added/Updated!", {
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
