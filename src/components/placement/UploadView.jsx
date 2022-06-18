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

const UploadView = ({
  label,
  type,
  resume,
  photo_Link,
  video_Link,
  studentId,
  change,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [links, setLinks] = React.useState({
    resumeLink: resume || "",
    photoLink: photo_Link || "",
    videoLink: video_Link || "",
  });

  const [edits, setEdits] = React.useState({
    editResume: false,
    editPhoto: false,
    editVideo: false,
  });

  const [views, setViews] = React.useState({
    viewOpenResume: false,
    viewOpenPhoto: false,
    viewOpenVideo: false,
  });

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

    console.log(label, "checking label");
    formData.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}/students/resume/documents`, formData)
      .then((res) => {
        if (res.status === 200) {
          if (label === "resume") {
            setLinks({
              ...links,
              resumeLink: res.data,
            });
          } else if (label === "photo_link") {
            setLinks({
              ...links,
              photoLink: res.data,
            });
          } else if (label === "video_link") {
            setLinks({
              ...links,
              videoLink: res.data,
            });
          }

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

  const addNew = () => {
    console.log(label, "label");
    if (label === "resume") {
      setLinks({
        ...links,
        resumeLink: "",
      });
      setEdits({
        ...edits,
        editResume: true,
      });
    } else if (label === "photo_link") {
      setLinks({
        ...links,
        photoLink: "",
      });
      setEdits({
        ...edits,
        editPhoto: true,
      });
    } else {
      setLinks({
        ...links,
        videoLink: "",
      });
      setEdits({
        ...edits,
        editVideo: true,
      });
    }
  };

  const uploadLink = (e) => {
    e.preventDefault();

    const linkResume = links.resumeLink.includes("drive.google.com")
      ? convertDriveLink(links.resumeLink)
      : links.resumeLink;
    const linkPhoto = links.photoLink.includes("drive.google.com")
      ? convertDriveLink(links.photoLink)
      : links.photoLink;
    const linkVideo = links.videoLink.includes("drive.google.com")
      ? convertDriveLink(links.videoLink)
      : links.videoLink;

    const link =
      label === "resume"
        ? linkResume
        : label === "photo_link"
        ? linkPhoto
        : linkVideo;

    //https://s3.ap-south-1.amazonaws.com/chanakya-dev/students_documents/e24753e8-49e2-45bb-bcd9-3750f6b96a07-Test_Doc.pdf

    axios
      .put(`${baseUrl}students/jobDetails`, {
        student_id: studentId,
        [label]: link,
      })
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(`${label} uploaded successfully`, {
            variant: "success",
          });
          change(
            label === "resume"
              ? {
                  resume: link,
                }
              : label === "photo_link"
              ? {
                  photo_Link: link,
                }
              : {
                  video_Link: link,
                }
          );

          if (label === "resume") {
            setEdits({
              ...edits,
              editResume: false,
            });
          } else if (label === "photo_link") {
            setEdits({
              ...edits,
              editPhoto: false,
            });
          } else {
            setEdits({
              ...edits,
              editVideo: false,
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    if (label === "resume") {
      setViews({
        ...views,
        viewOpenResume: false,
      });
    } else if (label === "photo_link") {
      setViews({
        ...views,
        viewOpenPhoto: false,
      });
    } else {
      setViews({
        ...views,
        viewOpenVideo: false,
      });
    }
  };

  const editCondition =
    label === "resume"
      ? edits.editResume
      : label === "photo_link"
      ? edits.editPhoto
      : edits.editVideo;

  const openView = () => {
    if (label === "resume") {
      setViews({ ...views, viewOpenResume: true });
    } else if (label === "photo_link") {
      setViews({ ...views, viewOpenPhoto: true });
    } else {
      setViews({ ...views, viewOpenVideo: true });
    }
  };

  const viewButtonCondition =
    label === "resume"
      ? links.resumeLink?.length > 0
      : label === "photo_link"
      ? links.photoLink?.length > 0
      : links.videoLink?.length > 0;

  const changeTextField = (e) => {
    if (label === "resume") {
      setLinks({
        ...links,
        resumeLink: e.target.value,
      });
    } else if (label === "photo_link") {
      setLinks({
        ...links,
        photoLink: e.target.value,
      });
    } else {
      setLinks({
        ...links,
        videoLink: e.target.value,
      });
    }
  };

  return !editCondition ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {viewButtonCondition ? (
        <Button
          variant="contained"
          endIcon={<VisibilityIcon />}
          onClick={() => openView()}
        >
          View
        </Button>
      ) : null}

      <Button
        variant="contained"
        style={{
          marginTop: "0.6rem",
          backgroundColor: "grey",
        }}
        onClick={(e) => {
          e.preventDefault();
          addNew();
        }}
      >
        Add
      </Button>

      <Modal
        open={
          label === "resume"
            ? views.viewOpenResume
            : label === "photo_link"
            ? views.viewOpenPhoto
            : views.viewOpenVideo
        }
        onClose={() => handleClose()}
        aria-labelledby="viewDoc"
        aria-describedby="modal to view"
      >
        <Box className={classes.viewModal}>
          <embed
            src={
              label === "resume"
                ? links.resumeLink
                : label === "photo_link"
                ? links.photoLink
                : links.videoLink
            }
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
          variant="contained"
          component="span"
          style={{
            width: "100%",
            textAlign: "center",
            backgroundColor: "grey",
            //corner radius
            // borderRadius: "20px",
          }}
        >
          Generate Link
        </Button>
      </label>
      <Input
        inputProps={{ type: "file", accept: "image/*,.pdf" }}
        id="resume-input"
        name="resume-input"
        type="file"
        style={{
          display: "none",
        }}
        onChange={(e) => generateLink(e)}
      />
      {/* <input
        onChange={(e) => generateLink(e)}
        id="reume-input"
        type="file"
        name="ResumeIP"
        style={{ display: "none" }}
        required
        // disabled={inputDisabled && formData.ProfileImage !== null}
        accept="image/*,.pdf"
      /> */}
      <TextField
        type="text"
        size="small"
        value={
          label === "resume"
            ? links.resumeLink
            : label === "photo_link"
            ? links.photoLink
            : links.videoLink
        }
        variant="outlined"
        style={{
          margin: "0.6rem 0",
        }}
        placeholder="Paste link here"
        onChange={(e) => changeTextField(e)}
      />
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        style={{
          marginTop: "0.2rem",
        }}
        disabled={
          label === "resume"
            ? links.resumeLink === ""
            : label === "photo_link"
            ? links.photoLink === ""
            : links.videoLink === ""
        }
        onClick={(e) => uploadLink(e, studentId)}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadView;
