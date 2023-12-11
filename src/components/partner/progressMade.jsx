import React, { useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { deepOrange } from "@mui/material/colors";
import DashboardPage from "../dashboard/Dashboard";
import StudentService from "../../services/StudentService";
import GraphPage from "./GraphPage";
import { allStages } from "../../utils/constants";
import SelectUiByButtons from "../smallComponents/SelectUiByButtons";
import ProgressCard from "../smallComponents/progressCard";

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
  const [dataView, setDataView] = React.useState(3);
  const [partnerName, setPartnerName] = React.useState("");
  const [cardData, setCardData] = React.useState({});

  const whatsAppMessage = (data) => {
    Object.entries(data).forEach(([key, detailsData]) => {
      let text = `*${key}*\n\n`;
      Object.entries(detailsData).forEach(([key1, studentDetails]) => {
        if (studentDetails.length > 0) {
          text = `${text}\n_${allStages[key1]} (${studentDetails.length})_\n`;
          studentDetails.forEach((item) => {
            text = `${text}${item.name}: ${item.mobile}\n`;
          });
        }
      });
      text = `${text}\nFor more information visit\nhttp://admissions.navgurukul.org/partner/${partnerId}`;

      setCardData((prevData) => ({
        ...prevData,
        [key]: { detailsData, message: text },
      }));
    });
  };

  const isPartnerGroup =
    location.pathname.split("/")[2] === "group" ? "partnerGroup" : "partners";

  useEffect(() => {
    axios
      .get(
        `${baseURL}${isPartnerGroup}/${partnerId}${
          isPartnerGroup === "partnerGroup" ? "/name" : ""
        }`
      )
      .then((res) =>
        setPartnerName(res.data.data[0]?.name || res.data.data.name)
      );

    axios
      .get(`${baseURL}${isPartnerGroup}/progress_made/${partnerId}`)
      .then((res) => whatsAppMessage(res.data.data));
  }, []);

  const progressMade = () => setDataView(2);

  const studentData = () => setDataView(1);

  const graphData = () => setDataView(3);

  const getView = (viewNo) => {
    switch (viewNo) {
      case 1:
        return (
          <DashboardPage
            displayData={StudentService.columns.partnerData}
            url={`${isPartnerGroup}/${partnerId}/students`}
          />
        );
      case 2:
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
            {Object.entries(cardData).map(
              ([key, { detailsData, message }], index) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <ProgressCard
                    title={key}
                    detailsData={detailsData}
                    index={index}
                    message={message}
                  />
                </Grid>
              )
            )}
          </Grid>
        );
      case 3:
        return (
          <GraphPage
            url={`${isPartnerGroup}/graph/progress_made/${partnerId}`}
          />
        );
      default:
        return (
          <GraphPage
            url={`${isPartnerGroup}/graph/progress_made/${partnerId}`}
          />
        );
    }
  };

  return (
    <>
      <CssBaseline />
      <Container className={classes.container} maxWidth="xl">
        <Grid item xs={12} style={{ marginBottom: 12 }}>
          <Typography variant="h4"> Hello {partnerName}</Typography>
        </Grid>
        <div className="modified-select-ui">
          <SelectUiByButtons
            progressMade={{ label: "Progress Made", action: progressMade }}
            studentData={{ label: "Student Data", action: studentData }}
            showGraphData={{ label: "Graph Data", action: graphData }}
            selected={
              dataView === 1
                ? "studentData"
                : dataView === 2
                ? "progressMade"
                : "showGraphData"
            }
          />
        </div>
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
        {getView(dataView)}
      </Container>
    </>
  );
};

export default ProgressMadeForPartner;
