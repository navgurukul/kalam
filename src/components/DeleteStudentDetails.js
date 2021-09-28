import React, { Component } from "react";
import { connect } from "react-redux";
import { permissions } from "../config";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { withSnackbar } from "notistack";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  Typography,
  Grid,
} from "@material-ui/core";
import { getData } from "../store/actions/data";

const baseUrl = process.env.API_URL;

class DeleteStudentDetails extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
    };
  }
  deleteStudentDetails = async () => {
    const { studentId, handleClose, getStudentsData, data } = this.props;
    await axios
      .delete(`${baseUrl}/campus/student/${studentId}`)
      .then((response) => {
        const newData = data.filter(element => element.id !== studentId);
        getStudentsData(newData)
        this.props.enqueueSnackbar("Details successfully deleted!", {
          variant: "success",
        });
      });
    this.setState({ open: false });
    handleClose();
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { open } = this.state;
    const { pathname, studentName } = this.props;
    const user = JSON.parse(window.localStorage.user);
    if (
      permissions.updateStudentName.indexOf(user.mail_id) > -1 &&
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
              onClick={this.deleteTransition}
              style={{ color: "#f05f40", cursor: "pointer", fontSize: "30px" }}
              onClick={this.handleClickOpen}
            />
          </Grid>
          <Dialog
            open={open}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {" "}
              Do you want to delete {studentName}'s details ??
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                NO
              </Button>
              <Button onClick={this.deleteStudentDetails} color="primary">
                YES
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  data: state.data.getData,
});

const mapDispatchToProps = (dispatch) => ({
  getStudentsData: (data) => dispatch(getData(data)),
});

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(DeleteStudentDetails));
