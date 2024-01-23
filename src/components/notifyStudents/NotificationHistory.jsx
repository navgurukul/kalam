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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

function NotificationHistory({ studentId, rowMeta, value, updateValue }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}students/transitionsWithFeedback/${studentId}`)
      .then((res) => {
        const data = res.data.data;
        console.log("data", data);
        // setLastTransition(data[data.length - 1]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  console.log("rowMeta", rowMeta);

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
              Notification History
            </Typography>
            <Typography variant="h6" sx={{ mt: "40px", fontWeight: "bold" }}>
              Algebra & English Interview Pending (2nd Round)
            </Typography>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mt: "20px",
                  mb: "15px",
                  fontWeight: "bold",
                }}
              >
                <FiberManualRecordIcon
                  sx={{ fontSize: "17px", color: "green", mr: "5px" }}
                />
                Lates on 15-05-2023
              </Typography>
              <Typography>
                Notification sent successfully via Email, SMS, and WhatsApp
              </Typography>
            </Box>
          </Box>
        </Dialog>
      ) : (
        <>
          <Typography>Last sent on 15-05-2023</Typography>
          <Button onClick={handleOpen}>View Details</Button>
        </>
      )}
    </>
  );
}

export default NotificationHistory;
