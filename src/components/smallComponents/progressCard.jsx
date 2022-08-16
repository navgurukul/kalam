import React from "react";
import Card from "@mui/material/Card";
import { CardContent, Grid, IconButton, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { isMobile } from "react-device-detect";
import Tooltip from "@mui/material/Tooltip";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { deepOrange } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";
import { makeStyles } from "@mui/styles";
import HelpIcon from "@mui/icons-material/Help";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CollapseStudentData from "../student/collapseData";
import WhatsAppIcon from "../../assets/img/whatsapp.png";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginLeft: 10,
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(0deg)",
    transition: "all .5s ease",
    webkitTransition: "all .5s ease",
    mozTransition: "all .5s ease",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 2,
  },
}));

const ProgressCard = ({ title, detailsData, index, message }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const icons = React.useMemo(
    () => [
      {
        icon: <AccountBalanceIcon className={classes.image} />,
      },
      {
        icon: <AnnouncementIcon className={classes.image} />,
      },
      {
        icon: <HelpIcon className={classes.image} />,
      },
      {
        icon: <CancelIcon className={classes.image} />,
      },
    ],
    []
  );
  const copyClipBoard = (copyMessage) => (
    <CopyToClipboard
      text={copyMessage}
      onCopy={() => {
        enqueueSnackbar("Message copied!", {
          variant: "success",
        });
      }}
    >
      <Tooltip
        title="Copy Details"
        style={{ background: "#f05f40" }}
        className={classes.large}
      >
        <IconButton>
          <FileCopyIcon sx={{ color: "white" }} />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  );
  return (
    <Card className={classes.root}>
      <CardContent>
        <div style={{ marginBottom: 50 }}>
          {isMobile ? (
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              {copyClipBoard(message)}
              <br />
              <Tooltip title="Share Details on WhatsApp">
                <a
                  href={`https://api.whatsapp.com/send?text=${message}`}
                  data-action="share/whatsapp/share"
                >
                  <Avatar
                    className={classes.large}
                    alt="Remy Sharp"
                    src={WhatsAppIcon}
                  >
                    {" "}
                  </Avatar>
                </a>
              </Tooltip>
            </Grid>
          ) : (
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              {copyClipBoard(message)}
            </Grid>
          )}
          <br />
          <center>{icons[index].icon}</center>
          <br />
          <center>
            <Typography variant="h5">{title}</Typography>
          </center>
        </div>
        {Object.entries(detailsData).map(([stage, studentDetails]) => (
          <div key={`${stage}${Math.random()}`}>
            <CollapseStudentData
              classes={classes}
              details={studentDetails}
              stage={stage}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
