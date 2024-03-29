import React, { useState } from "react";
import { Button, Box, Dialog, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Notification = ({
  index,
  notificationStatus,
  latestNotificationDate,
  convertDate,
  item,
}) => {
  return (
    <Box sx={{ mt: "20px" }} key={index}>
      <Typography
        variant="h6"
        sx={{
          mt: "20px",
          mb: "7px",
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
        {latestNotificationDate
          ? `Latest on ${latestNotificationDate}`
          : convertDate(item)}
      </Typography>
      <Typography sx={{ ml: "23px" }}>
        {notificationStatus !== undefined &&
        notificationStatus[notificationStatus.length - 1] === "true"
          ? "Notification sent successfully via Email"
          : "Notification failed"}
      </Typography>
    </Box>
  );
};

function NotificationHistory({ currectStage, rowMeta, allStages }) {
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

  const latestNotificationDate = convertDate(
    notifications !== undefined && notifications[notifications?.length - 1]
  );

  const allNotifications = notifications?.filter(
    (item, index) => index !== notifications.length - 1
  );

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
              Notification History
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mt: "40px", fontWeight: "bold" }}>
              {stage}
            </Typography>
            {latestNotificationDate && (
              <Notification
                index={notificationStatus.length - 1}
                notificationStatus={notificationStatus}
                latestNotificationDate={latestNotificationDate}
              />
            )}
            {allNotifications !== undefined &&
              allNotifications?.map((item, index) => {
                if (item !== "null") {
                  return (
                    <Notification
                      index={index}
                      notificationStatus={notificationStatus}
                      convertDate={convertDate}
                      item={item}
                    />
                  );
                }
              })}
          </Box>
        </Dialog>
      ) : (
        <>
          {notifications === undefined ||
          (notifications.length === 1 && notifications[0] === "null") ? (
            <Typography>There is no notification history yet</Typography>
          ) : (
            <>
              <Typography>Last sent on {latestNotificationDate}</Typography>
              <Button onClick={handleOpen}>View Details</Button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default NotificationHistory;
