import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import axios from "axios";
import { Button } from "@material-ui/core";
import { withSnackbar } from "notistack";
import { changeFetching } from "../store/actions/auth";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { Dialog } from "@material-ui/core";
import { Box } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const baseUrl = process.env.API_URL;

const styles = (theme) => ({
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
});

export class StudentFeedback extends React.Component {
  async addFeedbck() {
    try {
      this.props.fetchingStart();
      const { change, rowMetaTable } = this.props;
      const { rowData, columnIndex } = rowMetaTable;
      var studentId;

      if (window.location.pathname.includes("/campus")) {
        studentId = rowData[7];
      } else {
        studentId = rowData[5];
      }
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const dataURL = `${baseUrl}students/feedback/${studentId}/${userId}`;
      await axios
        .post(dataURL, {
          student_stage: rowData[0],
          feedback: this.state.feedback,
        })
        .then((response) => {
          console.log(response.data);
          this.setState({
            dialogOpen: false,
          });
          this.props.enqueueSnackbar("Feedback is successfully added!", {
            variant: "success",
          });
          change(this.state.feedback, columnIndex);
        });

      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.enqueueSnackbar("Please select student Status", {
        variant: "error",
      });
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.setState({
      loading: true,
    });
    this.addFeedbck();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.state = {
      feedback: "",
      dialogOpen: false,
    };
  }

  handleChange = (name) => (event) => {
    let valChange = {};
    valChange[name] = event.target.value;

    this.setState(valChange);
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  handleOpen = () => {
    this.setState({
      dialogOpen: true,
    });
  };
  addFeedbackDetails = (user, feedback) => {
    const time = new Date();
    const month = time.getMonth() + 1;
    const feedbackTime = `Feedback date ${time.getDate()}/${month}/${time.getFullYear()}`;
    return feedback
      ? user + ": " + feedbackTime + "\n\n" + feedback
      : user + ": " + feedbackTime + "\n\n";
  };

  render = () => {
    const { classes, feedback, rowMetaTable } = this.props;
    const { rowData } = rowMetaTable;
    console.log(rowData, "I am rowData");
    console.log(rowData[6], "I am rowData[8]");
    var user;
    if (localStorage.getItem("user")) {
      user =
        "@" +
        JSON.parse(localStorage.getItem("user"))
          .user_name.toString()
          .split(" ")
          .join("")
          .toLowerCase();
    } else {
      user = "@" + "guest";
    }
    return (
      <Fragment>
        <Box onClick={this.handleOpen}>
          <EditIcon style={{ cursor: "pointer" }} />
        </Box>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
          <form className={classes.container}>
            <h1 style={{ color: "#f05f40", textAlign: "center" }}>
              Add Feedback
            </h1>
            <TextField
              id="outlined-multiline-static"
              label="Feedback"
              multiline
              rows="6"
              name="feedback"
              defaultValue={this.addFeedbackDetails(user, feedback)}
              onChange={this.handleChange("feedback")}
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.onSubmit}
              className={classes.btn}
            >
              Submit Feedback
            </Button>
          </form>
        </Dialog>
      </Fragment>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(
  withRouter(
    withStyles(styles)(connect(undefined, mapDispatchToProps)(StudentFeedback))
  )
);
