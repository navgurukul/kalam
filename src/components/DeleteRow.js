import React, { Component } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import axios from "axios";
import { withSnackbar } from "notistack";

const baseUrl = process.env.API_URL;

class DeleteRow extends Component {
  deleteTransition = () => {
    const { transitionId } = this.props;
    axios
      .delete(`${baseUrl}students/transition/${transitionId}`)
      .then((response) => {
        this.props.enqueueSnackbar(
          "Transition is successfully Added/Updated!",
          {
            variant: "success",
          }
        );
      });
  };
  render() {
    return (
      <Box textAlign="left" m={1}>
        <DeleteIcon
          onClick={this.deleteTransition}
          style={{ color: "#f05f40", cursor: "pointer" }}
        />
      </Box>
    );
  }
}

export default withSnackbar(DeleteRow);
