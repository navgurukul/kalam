import React from "react";

import axios, { post } from "axios";
import Spinner from "react-spinner-material";
import { useSnackbar } from "notistack";

const baseUrl = process.env.API_URL;

const AudiofileUpload = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    file: "",
    loading: false,
    audioUrl: "",
  });

  // this.onFormSubmit = this.onFormSubmit.bind(this);
  // this.onChange = this.onChange.bind(this);
  // this.fileUpload = this.fileUpload.bind(this);

  const addAudioUrl = async (fileUrl) => {
    const { studentId, userId, student_stage, change, columnIndex } = props;
    try {
      if (fileUrl) {
        const url =
          baseUrl + "students/" + "audioRecording/" + studentId + "/" + userId;
        const response = await axios.post(url, {
          audio_url: fileUrl,
          student_stage: student_stage,
        });
        if (response.data.sucess) {
          setState({
            ...state,
            loading: false,
          });
          enqueueSnackbar("successfully uploaded audio file!", {
            variant: "success",
          });
          change(fileUrl, columnIndex);
        } else {
          setState({
            ...state,
            loading: false,
          });
          enqueueSnackbar("Something is went wrong!", {
            variant: "error",
          });
        }
      }
    } catch (e) {
      enqueueSnackbar("Internal Server Error", { variant: "error" });
      console.error(e);
    }
  };

  const onFormSubmit = async (e) => {
    e.preventDefault(); // Stop form submit

    fileUpload(state.file).then((response) => {
      try {
        if (response.data.errors == undefined) {
          addAudioUrl(response.data.fileUrl);
        } else {
          alert("It is enternal server error please refresh the page.");
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  const onChange = async (e) => {
    await setState({ ...state, file: e.target.files[0], loading: true });
    await onFormSubmit(e);
  };

  const fileUpload = async (file) => {
    const url = baseUrl + "general/upload_file/audioRecording";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return await post(url, formData, config);
  };

  const { loading } = state;
  return (
    <div>
      <form style={{ padding: "10px", width: 300, marginTop: -35 }}>
        <h3>Upload audio file</h3>
        <input
          type="file"
          accept=".mp3,.aac,audio/*"
          onChange={onChange}
          style={{ color: "green" }}
        />
        <Spinner
          size={35}
          spinnerColor={"#ed343d"}
          spinnerWidth={5}
          visible={loading}
          style={{ padding: "10px" }}
        />
      </form>
    </div>
  );
};

export default AudiofileUpload;
