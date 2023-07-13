import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import { HalfCircleSpinner } from "react-epic-spinners";

const baseUrl = import.meta.env.VITE_API_URL;

const subtitle =
  "Please upload a picture with clear face preferably against a light backgournd";

const PhotoUploadModal = ({
  dialogOpen,
  handleClose,
  src,
  updatedPicTable,
  enrollmentKey,
  name,
  setUpdatePicTable,
}) => {
  const [updatedPhoto, setUpdatedPhoto] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const openFilePrompt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProfilePhoto = (e) => {
    const file = e.target.files[0];
    //check if file size is greater than 1mb
    if (file.size > 1000000) {
      enqueueSnackbar("File size should not exceed 1MB", { variant: "error" });
      return;
    }
    setUpdatedPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const savePhoto = async () => {
    try {
      if (!enrollmentKey[0]?.key) {
        enqueueSnackbar("Enrollment key no available", {
          variant: "error",
        });
        return;
      }
      setLoading(true);
      const tempFormdata = new FormData();

      tempFormdata.append("file", updatedPhoto);

      const dataURL = `${baseUrl}on_assessment/details/photo/${enrollmentKey[0]?.key}`;

      const response = await axios.post(dataURL, tempFormdata);
      setLoading(false);
      setUpdatedPhoto("");
      handleClose();
      if (updatedPhoto) {
        setUpdatePicTable(URL.createObjectURL(updatedPhoto));
      }
      enqueueSnackbar("Image Uploaded Successfully", {
        variant: "success",
      });
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Could not upload image", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          width: "480px",
          height: "434px",
          borderRadius: "8px",
          padding: "32px",
        },
      }}
      open={dialogOpen}
      onClose={handleClose}
    >
      <DialogActions>
        <CloseIcon
          sx={{
            color: "#6D6D6D",
            cursor: "pointer",
          }}
          onClick={handleClose}
        />
      </DialogActions>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "32px",
        }}
      >
        <Avatar
          src={updatedPhoto ? previewPhoto : src}
          style={{
            width: "120px",
            height: "120px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        />
        <input
          onChange={(e) => updateProfilePhoto(e)}
          id="ProfileImage"
          type="file"
          name="ProfileImage"
          ref={fileInputRef}
          style={{ display: "none" }}
          required
          accept=".png,.jpg,.jpeg"
        />
        <Typography
          style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}
        >
          {name}
        </Typography>
        <Typography
          style={{
            fontSize: "18px",
            fontWeight: 400,
            color: "#6D6D6D",
            textAlign: "center",
          }}
        >
          {subtitle}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "100%", height: "48px", borderRadius: "8px" }}
          onClick={updatedPhoto ? savePhoto : openFilePrompt}
        >
          {loading ? (
            <HalfCircleSpinner size={25} />
          ) : updatedPhoto ? (
            "Save Photo"
          ) : (
            "Update Photo"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoUploadModal;
