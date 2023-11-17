import React, { useState } from "react";
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

function NotifyStudents() {
  const [open, setOpen] = useState(false);
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
              Algebra & English Interview Pending (2nd Round)
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
                <Switch {...label} defaultChecked />
                <EmailIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>Email</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Switch {...label} />
                <SmsOutlinedIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>SMS</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Switch {...label} />
                <WhatsAppIcon sx={{ mt: "6px" }} />
                <Typography sx={{ mt: "6px", ml: "6px" }}>WhatsApp</Typography>
              </Box>
            </Box>
            {/* </Typography> */}
            {/* <DialogTitle id="alert-dialog-title">
              Algebra & English Interview Pending (2nd Round)
            </DialogTitle> */}
            <DialogContent sx={{ background: "#ededed", mt: "20px" }}>
              <Typography sx={{ color: "#303030", fontSize: "20px" }}>
                Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are
                running.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{ mt: "20px", padding: "15px", borderRadius: "8px" }}
              >
                Sent Notification
              </Button>
              {/* <Button onClick={handleClose} autoFocus>
                Agree
              </Button> */}
            </DialogActions>
          </Box>
        </Dialog>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleOpen}>
            <NotificationsActiveIcon />
          </Button>
        </div>
      )}
    </>
  );
}

export default NotifyStudents;
