import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, Card, CardContent, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Dropout from "../assets/img/Dropout.jpg";
import GotJob from "../assets/img/GotJob.jpg";
import Interview from "../assets/img/Interview.jpg";
import JS from "../assets/img/JS.png";
import NodeJs from "../assets/img/NodeJs.png";
import onLeave from "../assets/img/onLeave.jpg";
import Payitforward from "../assets/img/Payitforward.jpg";
import Python from "../assets/img/Python.png";
import ReactJS from "../assets/img/ReactJs.png";
import { allStages } from "../config";
import CollapseStudentData from "./collapseData";
import Loader from "./Loader";

const baseURL = process.env.API_URL;
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    height: 80,
    marginTop: 10,
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
}));
const StudentsProgressCards = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    data: null,
    Python: "",
    JS: "",
    "Node JS": "",
    "React JS": "",
    "Interview preperation": "",
    "Pay forwad": "",
    "Got job": "",
    onLeave: "",
    "Drop out": "",
  });
  const icons = [
    {
      icon: <img alt="python" src={Python} className={classes.image} />,
    },
    {
      icon: <img alt="js" src={JS} className={classes.image} />,
    },
    {
      icon: <img alt="nodejs" src={NodeJs} className={classes.image} />,
    },
    {
      icon: <img alt="reactjs" src={ReactJS} className={classes.image} />,
    },
    {
      icon: <img alt="interview" src={Interview} className={classes.image} />,
    },
    {
      icon: (
        <img alt="payitforward" src={Payitforward} className={classes.image} />
      ),
    },
    {
      icon: <img alt="gotjob" src={GotJob} className={classes.image} />,
    },
    {
      icon: <img alt="onleave" src={onLeave} className={classes.image} />,
    },
    {
      icon: <img alt="dropout" src={Dropout} className={classes.image} />,
    },
  ];

  const { url } = props;

  const whatsAppMessage = () => {
    Object.entries(state.data).forEach(([key, detailsData]) => {
      let text = "";
      text = `${text}*${key}*\n\n`;
      Object.entries(detailsData).forEach(([key1, studentDetails]) => {
        if (studentDetails.length > 0) {
          text = `${text}\n_${allStages[key1]} (${studentDetails.length})_\n`;
          studentDetails.forEach((item) => {
            text = `${text}${item.name}: ${item.contacts[0].mobile}\n`;
          });
        }
      });
      text = `${text}\nFor more information visit\nhttp://admissions.navgurukul.org/partner/${url}`;
      setState({
        ...state,
        [key]: text,
      });
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}${url}/students/progress_made_card`)
      .then((response) => {
        setState({
          ...state,
          data: response.data.data,
        });
        whatsAppMessage();
      });
  }, []);

  const copyClipBoard = (key) => (
    <Tooltip title="Copy Details">
      <CopyToClipboard
        text={key}
        onCopy={() => {
          snackbar.enqueueSnackbar("Message copied!", {
            variant: "success",
          });
        }}
      >
        <FileCopyIcon
          style={{ cursor: "pointer", color: "#f05f40", fontSize: "30px" }}
        />
      </CopyToClipboard>
    </Tooltip>
  );
  const { data } = state;
  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      style={{ marginTop: 10, justifyContent: "center", width: "100% " }}
    >
      {data ? (
        Object.entries(data).map(([key, detailsData], index) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card className={classes.root}>
              <CardContent>
                <div style={{ marginBottom: 50 }}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                    {copyClipBoard(state[key])}
                  </Grid>
                  <br />
                  <center>{icons[index].icon}</center>
                  <br />
                  <center>
                    <Typography variant="h5">{key}</Typography>
                  </center>
                </div>
                {Object.entries(detailsData).map(([stage, studentDetails]) => (
                  <div key={stage}>
                    <div>
                      <CollapseStudentData
                        classes={classes}
                        details={studentDetails}
                        stage={stage}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Loader />
      )}
    </Grid>
  );
};

export default StudentsProgressCards;
