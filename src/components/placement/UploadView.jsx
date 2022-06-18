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
import { useDispatch, useSelector } from "react-redux";
import { changeFetching } from "../../store/slices/uiSlice";
import Loader from "../ui/Loader";

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

const UploadView = ({ label, type, docLink, studentId, change }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { isFetching } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));

  const [link, setLink] = React.useState(docLink || "");

  const [edit, setEdit] = React.useState(false);

  const [view, setView] = React.useState(false);

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
    fetchingStart();
    formData.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}/students/resume/documents`, formData)
      .then((res) => {
        if (res.status === 200) {
          setLink(res.data);

          enqueueSnackbar(
            "Link generated and pasted in the text box successfully, click on upload!",
            {
              variant: "success",
            }
          );
          fetchingFinish();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const convertDriveLink = (linkToConv) =>
    `https://drive.google.com/file/d/${
      linkToConv.match(/d\/([A-Za-z0-9-]+)/)[1]
    }/preview`;

  const addNew = () => {
    // if (label === "resume") {
    //   setLinks({
    //     ...links,
    //     resumeLink: "",
    //   });
    //   setEdits({
    //     ...edits,
    //     editResume: true,
    //   });
    // } else if (label === "photo_link") {
    //   setLinks({
    //     ...links,
    //     photoLink: "",
    //   });
    //   setEdits({
    //     ...edits,
    //     editPhoto: true,
    //   });
    // } else {
    //   setLinks({
    //     ...links,
    //     videoLink: "",
    //   });
    //   setEdits({
    //     ...edits,
    //     editVideo: true,
    //   });
    // }
    setLink("");
    setEdit(true);
  };

  const embeddedURL = (linkToEmbed) => {
    //if link is a youtube link then return the embeded link
    if (linkToEmbed.includes("youtube")) {
      return `https://www.youtube.com/embed/${link.split("v=")[1]}`;
    }
    if (linkToEmbed.includes("youtu"))
      return `https://www.youtube.com/embed/${link.split("/")[3]}`;
  };

  const uploadLink = (e) => {
    e.preventDefault();
    if (isFetching) return;
    fetchingStart();

    const linkResumePhoto = link.includes("drive.google.com")
      ? convertDriveLink(link)
      : link;
    const linkVideo = link.includes("drive.google.com")
      ? convertDriveLink(link)
      : link.includes("youtu")
      ? embeddedURL(link)
      : link;

    const linkDoc =
      label === "resume" || label === "photo_link"
        ? linkResumePhoto
        : linkVideo;

    //https://s3.ap-south-1.amazonaws.com/chanakya-dev/students_documents/e24753e8-49e2-45bb-bcd9-3750f6b96a07-Test_Doc.pdf

    axios
      .put(`${baseUrl}students/jobDetails`, {
        student_id: studentId,
        [label]: linkDoc,
      })
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar(`${type} uploaded successfully`, {
            variant: "success",
          });
          change({ [label]: docLink });

          // if (label === "resume") {
          //   setEdits({
          //     ...edits,
          //     editResume: false,
          //   });
          // } else if (label === "photo_link") {
          //   setEdits({
          //     ...edits,
          //     editPhoto: false,
          //   });
          // } else {
          //   setEdits({
          //     ...edits,
          //     editVideo: false,
          //   });
          // }
          setEdit(false);
          fetchingFinish();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    // if (label === "resume") {
    //   setViews({
    //     ...views,
    //     viewOpenResume: false,
    //   });
    // } else if (label === "photo_link") {
    //   setViews({
    //     ...views,
    //     viewOpenPhoto: false,
    //   });
    // } else {
    //   setViews({
    //     ...views,
    //     viewOpenVideo: false,
    //   });
    // }
    setView(false);
  };

  // const editCondition =
  //   label === "resume"
  //     ? edits.editResume
  //     : label === "photo_link"
  //     ? edits.editPhoto
  //     : edits.editVideo;

  const openView = () => {
    // if (label === "resume") {
    //   setViews({ ...views, viewOpenResume: true });
    // } else if (label === "photo_link") {
    //   setViews({ ...views, viewOpenPhoto: true });
    // } else {
    //   setViews({ ...views, viewOpenVideo: true });
    // }
    setView(true);
  };

  const viewButtonCondition = link?.length > 0;

  const changeTextField = (e) => {
    // if (label === "resume") {
    //   setLinks({
    //     ...links,
    //     resumeLink: e.target.value,
    //   });
    // } else if (label === "photo_link") {
    //   setLinks({
    //     ...links,
    //     photoLink: e.target.value,
    //   });
    // } else {
    //   setLinks({
    //     ...links,
    //     videoLink: e.target.value,
    //   });
    // }
    setLink(e.target.value);
  };

  return !edit ? (
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
        open={view}
        onClose={() => handleClose()}
        aria-labelledby="viewDoc"
        aria-describedby="modal to view"
      >
        <Box className={classes.viewModal}>
          {label === "resume" || label === "photo_link" ? (
            <embed
              src={link}
              alt="Resume"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <iframe
              id="ytplayer"
              title="Video Player"
              type="text/html"
              width="1280"
              height="720"
              src={`${link}?autoplay=1`}
              frameBorder="0"
            />
          )}
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
      {label !== "video_link" && (
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
      )}
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
        value={link}
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
        disabled={link === ""}
        onClick={(e) => uploadLink(e, studentId)}
      >
        {isFetching ? <Loader /> : "Upload"}
      </Button>
    </div>
  );
};

export default UploadView;
