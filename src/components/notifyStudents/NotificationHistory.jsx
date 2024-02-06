import React, { useState } from "react";
import { Button, Box, Dialog, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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
            <Typography variant="h6" sx={{ mt: "40px", fontWeight: "bold" }}>
              {stage}
            </Typography>
            {notifications !== undefined &&
              notifications?.map((item, index) => {
                if (item !== "null") {
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
                        Lates on {convertDate(item)}
                      </Typography>
                      <Typography sx={{ ml: "23px" }}>
                        {notificationStatus !== undefined &&
                        notificationStatus[index] === "true"
                          ? "Notification sent successfully via Email"
                          : "Notification failed"}
                      </Typography>
                    </Box>
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
