import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Typography,
  Grid,
  Container,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import StudentService from "../services/StudentService";
import DashboardPage from "./Dashboard";
import StudentsProgressCards from "./StudentsProgressCards";

const baseUrl = process.env.API_URL;

const styles = (theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 10,
  },
});

class StudentsProgressInCampus extends Component {
  constructor() {
    super();
    this.state = {
      partnerName: null,
      isShow: false,
    };
  }
  componentDidMount() {
    const partnerId = this.props.match.params.partnerId;
    axios
      .get(`${baseUrl}partners/${this.props.match.params.partnerId}`)
      .then((res) => {
        this.setState({
          partnerName: res.data.data["name"],
        });
      });
  }

  progressMade = () => {
    this.setState({ isShow: false });
  };
  tabularData = () => {
    this.setState({ isShow: true });
  };
  render() {
    const { classes } = this.props;
    const { partnerName, isShow } = this.state;
    return (
      <div>
        <Container className={classes.container}>
          <Grid item xs={12} style={{ marginBottom: 40 }}>
            <Typography variant="h4">
              {" "}
              Hello, {partnerName} Foundation
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup
              size="large"
              color="primary"
              aria-label="large outlined primary button group"
            >
              <Button onClick={this.progressMade}>Progress Made</Button>
              <Button onClick={this.tabularData}>Tabular Data</Button>
            </ButtonGroup>
          </Grid>
        </Container>
        {isShow ? (
          <DashboardPage
            displayData={StudentService["CampusData"]}
            url={`partners/joined_progress_made/${this.props.match.params.partnerId}`}
          />
        ) : (
          <StudentsProgressCards
            url={this.props.match.params.partnerId}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(StudentsProgressInCampus);
