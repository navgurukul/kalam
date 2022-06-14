/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Modal from "@mui/material/Modal";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles(() => ({
  viewModal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,

    justifyContent: "center",
    display: "flex",
    justifyItems: "center",
    alignItems: "center",
  },
}));

const UploadResume = ({ resume, studentId, change }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [resumeLink, setResumeLink] = React.useState(resume || "");
  const [editResume, setEditResume] = React.useState(
    resume === null || resume === undefined || resume === ""
  );
  const [viewOpenResume, setViewOpenResume] = React.useState(false);

  const limitFileSize = (file) => file.size <= 1000000;
  const generateLink = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const file = e.target.files[0];

    if (!limitFileSize(file)) {
      enqueueSnackbar("File size should not exceed 1MB", {
        variant: "error",
      });
      return;
    }
    formData.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}/students/resume/documents`, formData)
      .then((res) => {
        if (res.status === 200) {
          setResumeLink(res.data);

          enqueueSnackbar(
            "Link generated and pasted in the text box successfully, click on upload!",
            {
              variant: "success",
            }
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const convertDriveLink = (link) =>
    `https://drive.google.com/file/d/${
      link.match(/d\/([A-Za-z0-9-]+)/)[1]
    }/preview`;

  const addNewResume = () => {
    setResumeLink("");
    setEditResume(true);
  };

  const uploadResume = (e) => {
    e.preventDefault();

    const link = resumeLink.includes("drive.google.com")
      ? convertDriveLink(resumeLink)
      : resumeLink;

    //https://s3.ap-south-1.amazonaws.com/chanakya-dev/students_documents/e24753e8-49e2-45bb-bcd9-3750f6b96a07-Test_Doc.pdf

    axios
      .put(`${baseUrl}students/jobDetails`, {
        student_id: studentId,
        resume: link,
      })
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar("Resume uploaded successfully", {
            variant: "success",
          });
          change({ resume: link });
          setEditResume(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return !editResume ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        variant="contained"
        endIcon={<VisibilityIcon />}
        onClick={() => setViewOpenResume(true)}
      >
        View Resume
      </Button>

      <Button
        variant="contained"
        style={{
          marginTop: "0.6rem",
          backgroundColor: "grey",
        }}
        onClick={(e) => {
          e.preventDefault();
          addNewResume();
        }}
      >
        Add New
      </Button>

      <Modal
        open={viewOpenResume}
        onClose={() => setViewOpenResume(false)}
        aria-labelledby="viewResume"
        aria-describedby="modal to view Resume"
      >
        <Box className={classes.viewModal}>
          <embed
            src={resumeLink}
            alt="Resume"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Modal>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label htmlFor="resume-input">
        <Button
          size="small"
          variant="contained"
          style={{
            backgroundColor: "grey",
          }}
        >
          Generate Link
        </Button>
      </label>
      <Input
        inputProps={{ type: "file", accept: "image/*,.pdf" }}
        id="resume-input"
        type="file"
        style={{
          display: "none",
        }}
        onChange={(e) => generateLink(e)}
      />
      <TextField
        type="text"
        size="small"
        value={resumeLink}
        variant="outlined"
        style={{
          margin: "0.6rem 0",
        }}
        placeholder="Paste link here"
        onChange={(e) => setResumeLink(e.target.value)}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        style={{
          marginTop: "0.2rem",
        }}
        disabled={resumeLink === ""}
        onClick={(e) => uploadResume(e, studentId)}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadResume;
