import React from "react";
import UploadIcon from "@mui/icons-material/CloudUpload";

import { Typography, Button } from "@mui/material";
import axios from "axios";

import { useDispatch } from "react-redux";
import { changeFetching } from "../store/slices/authSlice";

const UploadFile = () => {
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const uploadInput = React.useRef();

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
      fetchingFinish();
    }
  };

  const triggerInputFile = () => {
    uploadInput.current?.click();
    handleUpload();
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
