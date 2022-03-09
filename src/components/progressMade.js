import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { Button, Typography, CardContent } from "@material-ui/core";
import { allStages } from "../config";

import Card from "@material-ui/core/Card";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import CancelIcon from "@material-ui/icons/Cancel";
import HelpIcon from "@material-ui/icons/Help";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange } from "@material-ui/core/colors";
import { isMobile } from "react-device-detect";
import { useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import WhatsAppIcon from "../assets/img/whatsapp.png";
import DashboardPage from "./Dashboard";
import CollapseStudentData from "./collapseData";
import Tooltip from "@material-ui/core/Tooltip";
import StudentService from "../services/StudentService";
import GraphPage from "./GraphPage";

const baseURL = process.env.API_URL;

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
    marginTop: 10,
  },
}));

const ProgressMadeForPartner = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    data: {},
    partnerName: "",
    progress: false,
    tabular: false,
    graph: true,
    "Selected for Navgurukul One-year Fellowship": "",
    "Need Action": "",
    "Need Your Help": "",
    "Failed Students": "",
  });
  const icons = [
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
  ];

  useEffect(() => {
    axios
      .get(`${baseURL}partners/${props.match.params.partnerId}`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          partnerName: res.data.data["name"],
        }));
      });

    axios
      .get(`${baseURL}partners/progress_made/${props.match.params.partnerId}`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data.data,
          progress: false,
          tabular: false,
          graph: true,
        }));
        whatsAppMessage();
      });
  }, []);

  const whatsAppMessage = () => {
    Object.entries(state.data).map(([key, detailsData]) => {
      let text = "";
      text = `${text}*${key}*\n\n`;
      Object.entries(detailsData).map(([key1, studentDetails]) => {
        if (studentDetails.length > 0) {
          text = `${text}\n_${allStages[key1]} (${studentDetails.length})_\n`;
          studentDetails.map((item) => {
            text = `${text}${item.name}: ${item.mobile}\n`;
          });
        }
      });
      text = `${text}\nFor more information visit\nhttp://admissions.navgurukul.org/partner/${props.match.params.partnerId}`;
      setState({
        ...state,
        [key]: text,
      });
    });
  };

  const progressMade = () => {
    setState({
      ...state,
      tabular: false,
      progress: true,
      graph: false,
    });
  };

  const tabularData = () => {
    setState({
      ...state,
      tabular: true,
      progress: false,
      graph: false,
    });
  };

  const graphData = () => {
    setState({
      ...state,
      tabular: false,
      progress: false,
      graph: true,
    });
  };

  const copyClipBoard = (key) => {
    return (
      <Tooltip title="Copy Details" className={classes.large}>
        <CopyToClipboard
          text={key}
          onCopy={() => {
            snackbar.enqueueSnackbar("Message copied!", {
              variant: "success",
            });
          }}
        >
          <Avatar alt="Remy Sharp">
            <FileCopyIcon style={{ cursor: "pointer" }} />
          </Avatar>
        </CopyToClipboard>
      </Tooltip>
    );
  };
  const { partnerName, progress, data, tabular } = state;
  return (
    <div>
      <CssBaseline />
      <Container className={classes.container}>
        <Grid item xs={12} style={{ marginBottom: 40 }}>
          <Typography variant="h4"> Hello {partnerName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            size="large"
            color="primary"
            aria-label="large outlined primary button group"
          >
            <Button onClick={progressMade}>Progress Made</Button>
            <Button onClick={tabularData}>Tabular Data</Button>
            <Button onClick={graphData}>Graph Data</Button>
          </ButtonGroup>
        </Grid>
        {progress && (
          <div>
            <Grid
              container
              spacing={3}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              style={{ marginTop: 10, justifyContent: "center" }}
            >
              {Object.entries(data).map(([key, detailsData], index) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
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
                            {copyClipBoard(state[key])}
                            <br></br>
                            <Tooltip title="Share Details on WhatsApp">
                              <a
                                href={`https://api.whatsapp.com/send?text=${state[key]}`}
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
                            {copyClipBoard(state[key])}
                          </Grid>
                        )}
                        <br></br>
                        <center>{icons[index].icon}</center>
                        <br></br>
                        <center>
                          <Typography variant="h5">{key}</Typography>
                        </center>
                      </div>
                      {Object.entries(detailsData).map(
                        ([stage, studentDetails]) => (
                          <div key={stage}>
                            <CollapseStudentData
                              classes={classes}
                              details={studentDetails}
                              stage={stage}
                            />
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <br></br>
      </Container>
      {tabular && (
        <DashboardPage
          displayData={StudentService.columns["partnerData"]}
          url={`partners/${props.match.params.partnerId}/students`}
        />
      )}
      {state.graph && (
        <GraphPage url={`partners/${props.match.params.partnerId}/students`} />
      )}
    </div>
  );
};

export default ProgressMadeForPartner;
