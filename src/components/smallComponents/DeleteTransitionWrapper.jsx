import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteTransitionWrapper = ({ rowMeta }) => {
  const { enqueueSnackbar } = useSnackbar();
  const path = window.location.pathname.split("/");
  const isCampus = path[1] === "campus";
  const transitionId = rowMeta.rowData[isCampus ? 14 : 12];

  const handleDelete = async () => {
    try {
      await axios.delete(`${baseUrl}transition/${transitionId}`);
      enqueueSnackbar("Transition deleted successfully!", { variant: "success" });

      // Refresh table — replace this with Redux-based refresh if needed
      window.location.reload();
    } catch (error) {
      enqueueSnackbar("Failed to delete transition", { variant: "error" });
    }
  };

  return (
    <IconButton onClick={handleDelete} color="error">
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteTransitionWrapper;
