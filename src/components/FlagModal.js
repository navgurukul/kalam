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

import FlagIcon from "@material-ui/icons/Flag";

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

export class RedFlag extends React.Component {
  async addFlagComment() {
    try {
      this.props.fetchingStart();
      const { change, rowMetaTable } = this.props;
      const { columnIndex } = rowMetaTable;
      const { studentId } = this.props;

      await axios
        .put(`${baseUrl}students/redflag/${studentId}`, {
          flag: this.state.flagComment,
        })
        .then((response) => {
          //console.log(response);
          this.setState({
            dialogOpen: false,
            flagColorToggle: this.state.flagComment,
          });
          if (this.state.flagComment === "") {
            this.props.enqueueSnackbar("Cleared Flag!", {
              variant: "success",
            });
          } else {
            this.props.enqueueSnackbar("Flag Raised successfully!", {
              variant: "success",
            });
          }

          change(this.state.redflag, columnIndex);
        });
      this.props.fetchingFinish();
    } catch (e) {
      //console.log(e);
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
    this.addFlagComment();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    const { comment } = this.props;
    this.state = {
      redflag: "",
      dialogOpen: false,
      flagComment: comment,
      flagColorToggle: comment,
    };
  }

  handleChange = () => (event) => {
    if (event.target.value.length === 0) {
      this.setState({ flagComment: "" });
    } else {
      this.setState({ flagComment: event.target.value });
    }
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

  render = () => {
    const { classes } = this.props;

    return (
      <Fragment>
        <Box onClick={this.handleOpen}>
          {this.state.flagColorToggle ? (
            <FlagIcon
              style={{
                cursor: "pointer",
                color: "red",
              }}
            />
          ) : (
            <FlagIcon
              style={{
                cursor: "pointer",
                color: "green",
              }}
            />
          )}
        </Box>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
          <form className={classes.container}>
            <h1
              style={{
                color: "#f05f40",
                textAlign: "center",
                marginTop: "0px",
                position: "relative",
                bottom: "20px",
              }}
            >
              Raised Flag
            </h1>
            <TextField
              style={{
                position: "relative",
                bottom: "20px",
              }}
              id="outlined-multiline-static"
              label="raised flag"
              placeholder="no red flag raised"
              multiline
              readOnly="true"
              rows="4"
              name="redFlag"
              defaultValue={
                this.state.flagComment === null
                  ? "no red flag raised"
                  : this.state.flagComment
              }
              onChange={this.handleChange()}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              inputProps={{ readOnly: true }}
            />
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
    withStyles(styles)(connect(undefined, mapDispatchToProps)(RedFlag))
  )
);
