import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import DOMPurify from "dompurify";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;

function NotifyStudents({ studentId, currectStage, allStages, rowMeta }) {
  const { enqueueSnackbar } = useSnackbar();
  const [emailContent, setEmailContent] = useState(false);
  const [platformList, setPlatformList] = useState(["email"]);
  const [lastTransition, setLastTransition] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  const stage = /\s/g.test(currectStage)
    ? currectStage
    : allStages[currectStage];

  useEffect(() => {
    axios
      .get(`${baseURL}students/notificationContent/${studentId}`)
      .then((res) => {
        const emailData = res.data.data.replace(/\n\n/g, "<br>");
        setEmailContent(DOMPurify.sanitize(emailData));
      })
      .catch((err) => {
        console.log("err", err);
      });

    axios
      .get(`${baseURL}students/transitionsWithFeedback/${studentId}`)
      .then((res) => {
        const data = res.data.data;
        setLastTransition(data[data.length - 1]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [rowMeta.rowData[3]]);

  const platformConfirmation = (platform) => {
    if (platform === "email") {
      if (platformList.includes("email")) {
        setPlatformList(platformList.filter((item) => item !== "email"));
      } else {
        setPlatformList([...platformList, "email"]);
      }
    }
  };

  const submitNotification = () => {
    if (platformList.includes("email")) {
      axios
        .post(
          `${baseURL}students/stageNotification/${lastTransition?.feedback_id}`,
          { platform: platformList }
        )
        .then((res) => {
          enqueueSnackbar("Email is successfully sent!", {
            variant: "success",
          });
          setOpen(false);
        })
        .catch((err) => {
          enqueueSnackbar(
            `Please fill feedback and status columns first and try again!${err.message}`,
            { variant: "error" }
          );
          setOpen(false);
        });
    }
  };

  return (
    <>
      {open ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <Box sx={{ padding: "30px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Notifications
            </Typography>
            <Typography variant="h6" sx={{ mt: "40px", fontWeight: "bold" }}>
              {stage}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "10px",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Switch
                  {...label}
                  defaultChecked
                  onChange={(e) => {
                    platformConfirmation("email");
                  }}
                />
                <EmailIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>Email</Typography>
              </Box>
            </Box>
            <DialogContent sx={{ background: "#ededed", mt: "20px" }}>
              <Typography
                sx={{ color: "#303030", fontSize: "18px" }}
                dangerouslySetInnerHTML={{ __html: emailContent }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={submitNotification}
                variant="contained"
                sx={{ mt: "20px", padding: "15px", borderRadius: "8px" }}
              >
                Sent Notification
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleOpen}
            disabled={rowMeta.rowData[12] !== lastTransition?.id}
          >
            <NotificationsActiveIcon />
          </Button>
        </div>
      )}
    </>
  );
}

export default NotifyStudents;
