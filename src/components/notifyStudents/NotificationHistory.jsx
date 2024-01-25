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
// import axios from "axios";

// const baseURL = import.meta.env.VITE_API_URL;

function NotificationHistory({
  studentId,
  currectStage,
  rowMeta,
  allStages,
  value,
  updateValue,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const convertDate = (D) => {
    const date = new Date(D);
    const month =
      date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

    return `${date.getDate()}-${month}-${date.getFullYear()}`;
  };

  const stage = /\s/g.test(currectStage)
    ? currectStage
    : allStages[currectStage];

  const notificationStatus = rowMeta.rowData[6]?.split(", ");
  const notifications = rowMeta.rowData[7]?.split(", ");
  console.log("notifications", notifications);

  // const date = new Date(notifications[notifications.length - 1]);
  // const month =
  //   date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  // const latestNotificationDate = `${date.getDate()}-${month}-${date.getFullYear()}`;
  const latestNotificationDate = convertDate(
    notifications !== undefined && notifications[notifications?.length - 1]
  );
  console.log("notificationStatus", notificationStatus);

  // useEffect(() => {
  //   axios
  //     .get(`${baseURL}students/transitionsWithFeedback/${studentId}`)
  //     .then((res) => {
  //       const data = res.data.data;
  //       console.log("data", data);
  //       // setLastTransition(data[data.length - 1]);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // }, []);

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
              {/* {stage} */}
              Enrolment Key Generated
            </Typography>
            {notifications !== undefined &&
              notifications?.map((item, index) => (
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
                      sx={{
                        fontSize: "17px",
                        color:
                          notificationStatus !== undefined &&
                          notificationStatus[index] === "true"
                            ? "green"
                            : "red",
                        mr: "5px",
                      }}
                    />
                    Lates on {convertDate(item)}
                  </Typography>
                  <Typography>
                    {/* Notification sent successfully {notificationStatus[index] == 'true' ? 'successfully' : ''} via Email */}
                    {notificationStatus !== undefined &&
                    notificationStatus[index] === "true"
                      ? "Notification sent successfully via Email"
                      : "Notification failed"}
                    {/* , SMS, and WhatsApp */}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Dialog>
      ) : (
        <>
          <Typography>Last sent on {latestNotificationDate}</Typography>
          <Button onClick={handleOpen}>View Details</Button>
        </>
      )}
    </>
  );
}

export default NotificationHistory;
