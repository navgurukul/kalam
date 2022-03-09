import React from "react";
import UploadIcon from "@material-ui/icons/CloudUpload";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { useDispatch } from "react-redux";
import { changeFetching } from "../store/actions/auth";

import axios from "axios";

const UploadFile = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const uploadInput = React.useRef();

  const triggerInputFile = () => {
    uploadInput.current?.click();
    handleUpload();
  };

  const handleUpload = async () => {
    try {
      fetchingStart();
      const dataURL =
        "https://admissions.navgurukul.org/api/general/upload_file/answerCSV";
      await axios.post(dataURL, {
        file: uploadInput.files[0],
      });
      fetchingFinish();
    } catch (e) {
      console.error(e);
      fetchingFinish();
    }
  };

  return (
    <form color="primary" align="right">
      <UploadIcon color="primary" />
      &nbsp;
      <input ref={uploadInput} type="file" style={{ display: "hidden" }} />
      <Button onClick={triggerInputFile}>
        <Typography variant="subtitle1" color="primary">
          Upload
        </Typography>
      </Button>
    </form>
  );
};

export default UploadFile;
