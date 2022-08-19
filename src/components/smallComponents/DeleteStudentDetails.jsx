/* eslint-disable no-shadow */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { setStudentData } from "../../store/slices/studentSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteStudentDetails = ({
  pathname,
  studentName,
  studentId,
  closeModal,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const data = useSelector((state) => state.students.studentData);
  const { privileges } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const setStudents = (data) => dispatch(setStudentData(data));
  const [open, setOpen] = React.useState(false);

  const deleteStudentDetails = async () => {
    await axios.delete(`${baseUrl}/campus/student/${studentId}`);
    const newData = data.filter((element) => element.id !== studentId);
    setStudents(newData);
    enqueueSnackbar("Details successfully deleted!", {
      variant: "success",
    });
    setOpen(false);
    closeModal();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (
    privileges.some((priv) => priv.privilege === "DeleteStudent") &&
    pathname.indexOf("campus") > -1
  ) {
    return (
      <>
        <Tooltip title="Delete Student Details">
          <IconButton color="primary" size="small" onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-student-dialog"
          aria-describedby="dialog to delete student"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Do you want to delete {studentName}&apos;s details ??
          </DialogTitle>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              NO
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={deleteStudentDetails}
            >
              YES
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  return null;
};

export default DeleteStudentDetails;
