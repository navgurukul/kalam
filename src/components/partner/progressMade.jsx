import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { Typography, CardContent, IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CancelIcon from "@mui/icons-material/Cancel";
import HelpIcon from "@mui/icons-material/Help";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { deepOrange } from "@mui/material/colors";
import { isMobile } from "react-device-detect";
import { useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import WhatsAppIcon from "../../assets/img/whatsapp.png";
import DashboardPage from "../dashboard/Dashboard";
import CollapseStudentData from "../student/collapseData";
import StudentService from "../../services/StudentService";
import GraphPage from "./GraphPage";
import { allStages } from "../../utils/constants";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";

const baseURL = import.meta.env.VITE_API_URL;

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

const ProgressMadeForPartner = () => {
  const { partnerId } = useParams();
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    data: {},
    partnerName: "",
    progress: false,
    tabular: false,
    graph: true,
    dataView: 2,
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

  const { partnerName, data } = state;

  const whatsAppMessage = () => {
    Object.entries(state.data).forEach(([key, detailsData]) => {
      let text = "";
      text = `${text}*${key}*\n\n`;
      Object.entries(detailsData).forEach(([key1, studentDetails]) => {
        if (studentDetails.length > 0) {
          text = `${text}\n_${allStages[key1]} (${studentDetails.length})_\n`;
          studentDetails.forEach((item) => {
            text = `${text}${item.name}: ${item.mobile}\n`;
          });
        }
      });
      text = `${text}\nFor more information visit\nhttp://admissions.navgurukul.org/partner/${partnerId}`;
      setState({
        ...state,
        [key]: text,
      });
    });
  };

  useEffect(() => {
    axios.get(`${baseURL}partners/${partnerId}`).then((res) => {
      setState((prevState) => ({
        ...prevState,
        partnerName: res.data.data.name,
      }));
    });

    axios.get(`${baseURL}partners/progress_made/${partnerId}`).then((res) => {
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

  const progressMade = () => {
    setState({
      ...state,
      tabular: false,
      progress: true,
      graph: false,
      dataView: 1,
    });
  };

  const tabularData = () => {
    setState({
      ...state,
      tabular: true,
      progress: false,
      graph: false,
      dataView: 0,
    });
  };

  const graphData = () => {
    setState({
      ...state,
      tabular: false,
      progress: false,
      graph: true,
      dataView: 2,
    });
  };

  const copyClipBoard = (key) => (
    <CopyToClipboard
      text={key}
      onCopy={() => {
        snackbar.enqueueSnackbar("Message copied!", {
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

  const getView = (viewNo) => {
    switch (viewNo) {
      case 0:
        return (
          <DashboardPage
            displayData={StudentService.columns.partnerData}
            url={`partners/${partnerId}/students`}
          />
        );
      case 1:
        return (
          <Grid
            maxWidth="xl"
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
                          <br />
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
                      <br />
                      <center>{icons[index].icon}</center>
                      <br />
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
        );
      case 2:
        return <GraphPage url={`partners/${partnerId}/students`} />;
      default:
        return <GraphPage url={`partners/${partnerId}/students`} />;
    }
  };

  return (
    <>
      <CssBaseline />
      <Container className={classes.container} maxWidth="xl">
        <Grid item xs={12} style={{ marginBottom: 12 }}>
          <Typography variant="h4"> Hello {partnerName}</Typography>
        </Grid>
        <SelectUiByButtons
          progressMade={{ label: "Progress Made", action: progressMade }}
          tabularData={{ label: "Tabular Data", action: tabularData }}
          showGraphData={{ label: "Graph Data", action: graphData }}
          selected={
            state.dataView === 0
              ? "tabularData"
              : state.dataView === 1
              ? "progressMade"
              : "showGraphData"
          }
        />
        {/* <Grid item xs={12}>
          <ButtonGroup
            size="large"
            color="primary"
            aria-label="large outlined primary button group"
          >
            <Button onClick={progressMade}></Button>
            <Button onClick={tabularData}></Button>
            <Button onClick={graphData}></Button>
          </ButtonGroup>
        </Grid> */}
        {/* <br /> */}
        {getView(state.dataView)}
      </Container>
    </>
  );
};

export default ProgressMadeForPartner;
