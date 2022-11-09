import React from "react";

import axios, { post } from "axios";
import Spinner from "react-spinner-material";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

const AudiofileUpload = ({
  studentId,
  userId,
  studentStage,
  change,
  columnIndex,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(true);

  const addAudioUrl = async (fileUrl) => {
    try {
      if (fileUrl) {
        const url = `${baseUrl}students/audioRecording/${studentId}/${userId}`;
        const response = await axios.post(url, {
          audio_url: fileUrl,
          student_stage: studentStage,
        });
        if (response.data.sucess) {
          setLoading(false);
          enqueueSnackbar("successfully uploaded audio file!", {
            variant: "success",
          });
          change(fileUrl, columnIndex);
        } else {
          enqueueSnackbar("Something is went wrong!", {
            variant: "error",
          });
        }
        setLoading(false);
      }
    } catch (e) {
      enqueueSnackbar("Internal Server Error", { variant: "error" });
    }
  };

  const fileUpload = async (file) => {
    const url = `${baseUrl}general/upload_file/audioRecording`;
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return post(url, formData, config);
  };

  const onFormSubmit = async (file) => {
    // e.preventDefault(); // Stop form submit

    fileUpload(file).then((response) => {
      try {
        if (response.data.errors === undefined) {
          addAudioUrl(response.data.fileUrl);
        } else {
          enqueueSnackbar(
            "Internal Server Error occured. Please refresh the page.",
            { variant: "error" }
          );
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const onChange = async (e) => {
    setLoading(true);
    await onFormSubmit(e.target.files[0]);
  };

  return (
    <div style={{ padding: "10px", width: 300, marginTop: -35 }}>
      <h3>Upload audio file</h3>
      <input
        type="file"
        accept=".mp3,.aac,audio/*"
        onChange={onChange}
        style={{ color: "green" }}
      />
      <Spinner
        size={35}
        spinnerColor="#ed343d"
        spinnerWidth={5}
        visible={loading}
        style={{ padding: "10px" }}
      />
    </div>
  );
};

export default AudiofileUpload;
