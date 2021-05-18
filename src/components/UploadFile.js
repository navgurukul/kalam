import React from "react";
import UploadIcon from "@material-ui/icons/CloudUpload";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { connect } from "react-redux";
import { changeFetching } from "../store/actions/auth";

import axios from "axios";

export class UploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  triggerInputFile = () => {
    this.uploadInput.click();
    this.handleUpload();
  };

  async handleUpload() {
    try {
      this.props.fetchingStart();
      const dataURL =
        "https://admissions.navgurukul.org/api/general/upload_file/answerCSV";
      const response = await axios.post(dataURL, {
        file: this.uploadInput.files[0],
      });
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  render = () => {
    return (
      <form color="primary" align="right">
        <UploadIcon color="primary" />
        &nbsp;
        <input
          ref={(ref) => {
            this.uploadInput = ref;
          }}
          type="file"
          style={{ display: "hidden" }}
        />
        <button onClick={this.triggerInputFile}>
          <Typography variant="subtitle1" color="primary">
            Upload
          </Typography>
        </button>
      </form>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default connect(undefined, mapDispatchToProps)(UploadFile);
