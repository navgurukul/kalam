import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Switch,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
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
  let email = "";

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  console.log("studentId", studentId);

  const stage = /\s/g.test(currectStage)
    ? currectStage
    : allStages[currectStage];

  const newEmail =
    "Dear Hemangi Sunil Bhadane\r\n\nYour admission progress -\r\n\n\r\n\nSchool: School Of Programming\r\n\nStage: pendingAlgebraInterview\r\n\nCurrent status: passed\r\n\n\r\n\nThank you";

  // const feedbackId = rowMeta.tableData[rowMeta.tableData.length - 1];
  // console.log("feedbackId", feedbackId);

  useEffect(() => {
    axios
      .get(`${baseURL}students/notificationContent/${studentId}`)
      .then((res) => {
        console.log("res", res.data);
        const sanitized = DOMPurify.sanitize(res.data.data);
        email = sanitized;
        setEmailContent(DOMPurify.sanitize(res.data.data));

        // setAllSchools(res.data);
        // console.log("res", res.data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });

    axios
      .get(`${baseURL}students/transitionsWithFeedback/${studentId}`)
      .then((res) => {
        console.log("response", res.data.data);
        const data = res.data.data;
        console.log("data", data[data.length - 1]);
        setLastTransition(data[data.length - 1]);
        // const sanitized = DOMPurify.sanitize(res.data.data);
        // email = sanitized;
        // setEmailContent(DOMPurify.sanitize(res.data.data));

        // setAllSchools(res.data);
        // console.log("res", res.data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [email]);

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

  // console.log("emailContent", emailContent);
  // console.log("emaillll", email);
  // console.log("newEmail", newEmail);

  // console.log("platformList", platformList);

  return (
    <>
      {open ? (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ padding: "30px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Notifications
            </Typography>
            {/* <DialogTitle id="alert-dialog-title" variant="h4">
              Notifications
            </DialogTitle> */}
            <Typography variant="h6" sx={{ mt: "40px", fontWeight: "bold" }}>
              {/* Algebra & English Interview Pending (2nd Round) */}
              {stage}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: "10px",
                // background: "#ededed",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Switch
                  {...label}
                  defaultChecked
                  checked={platformList.includes("email")}
                  onChange={(e) => {
                    platformConfirmation("email");
                  }}
                  // onChange={(e) => {
                  //   console.log("platform in onChange", platform);
                  //   console.log("email", e);
                  //   setPlatform([...platform, "email"]);
                  // }}
                />
                <EmailIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>Email</Typography>
              </Box>
              {/* <Box sx={{ display: "flex" }}>
                <Switch {...label} />
                <SmsOutlinedIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>SMS</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Switch {...label} />
                <WhatsAppIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>WhatsApp</Typography>
              </Box> */}
            </Box>
            {/* </Typography> */}
            {/* <DialogTitle id="alert-dialog-title">
              Algebra & English Interview Pending (2nd Round)
            </DialogTitle> */}
            <DialogContent sx={{ background: "#ededed", mt: "20px" }}>
              {/* <Typography sx={{ color: "#303030", fontSize: "20px" }}>
                Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are
                running. Let Google help apps determine location. This means
                sending anonymous location data to Google, even when no apps are
                running.
              </Typography> */}
              <Typography variant="subtitle1">
                <div dangerouslySetInnerHTML={{ __html: emailContent }} />
              </Typography>
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
