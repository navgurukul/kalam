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
  Typography,
  Grid,
} from "@mui/material";
// eslint-disable-next-line import/no-cycle
import { setStudentData } from "../../store/slices/studentSlice";
import { permissions } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteStudentDetails = (props) => {
  const snackbar = useSnackbar();
  const data = useSelector((state) => state.students.studentData);
  const { loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const getStudentsData = (data) => dispatch(setStudentData(data));
  const [open, setOpen] = React.useState(false);

  const deleteStudentDetails = async () => {
    const { studentId, handleClose } = props;
    await axios.delete(`${baseUrl}/campus/student/${studentId}`).then(() => {
      const newData = data.filter((element) => element.id !== studentId);
      getStudentsData(newData);
      snackbar.enqueueSnackbar("Details successfully deleted!", {
        variant: "success",
      });
    });
    setOpen(false);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { pathname, studentName } = props;
  if (
    permissions.updateStudentName.indexOf(loggedInUser.mail_id) > -1 &&
    pathname.indexOf("campus") > -1
  ) {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Typography
            variant="h6"
            id="modal-title"
            pl={9}
            style={{ paddingRight: "12px" }}
          >
            Delete Student Details
          </Typography>
          <DeleteIcon
            style={{ color: "#f05f40", cursor: "pointer", fontSize: "30px" }}
            onClick={handleClickOpen}
          />
        </Grid>
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {" "}
            Do you want to delete {studentName}&apos;s details ??
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              NO
            </Button>
            <Button onClick={deleteStudentDetails} color="primary">
              YES
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return null;
};

export default DeleteStudentDetails;
