import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { theme } from "../theme/theme";
import axios from "axios";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { changeFetching } from "../store/actions/auth";
import VideoSlider from "./VideoSlider";
import Grid from "@material-ui/core/Grid";
import StudentStatus from "./StudentStatus";
import Header from "./Header";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import history from "../utils/history";


const baseUrl = process.env.API_URL;
const testUrl = "https://join.navgurukul.org/k/";

const styles = (theme) => ({
  loginContainer: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "auto",
    boxShadow: "none",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: theme.spacing(4),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    fontSize: 32,
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
    },
  },
  typography: {
    fontFamily: "BlinkMacSystemFont",
  },
  fixedFooter: {
    [theme.breakpoints.up("sm")]: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
});

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      mobile: "",
      selectedLang: "en",
      partnerId: "",
      enrolmentKey: ""
    };

    this.lang = {
      Heading: {
        en: "Software Engineering Scholarship",
        hi: "सॉफ्टवेयर Engineering शिष्यवृत्ती",
      },
      Course: {
        en: "Course Information",
        hi: "कोर्स के बारे में जाने",
      },
      Status: {
        en: "Check Status By Registered Number",
        hi: "रजिस्टर मोबाइल नंबर से अपना स्टेटस देखे",
      },
      AdmisssionTitle: {
        en: "Start Admisssion Test",
        hi: "परीक्षा सुरु करे ",
      },
      TestButton: {
        en: "GIVE TEST",
        hi: "परीक्षा दे।",
      },
      StatusButton: {
        en: "GET STATUS",
        hi: "स्तिथि देखे",
      },
      Footer: {
        en: "For more queries, write at hi@navgurukul.org",
        hi: "अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org",
      },
    };
  }

  onChangeEvent = (e) => {
    this.setState({
      mobileNumber: e.target.value,
    });
  };

  onChangeEventStatus = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  };
  async generateTestLink() {
    try {
      const partnerId = this.state.partnerId ? this.state.partnerId : null;
      const mobile = "0" + this.state.mobileNumber;
      this.props.fetchingStart();
      const dataURL = baseUrl + "helpline/register_exotel_call";
      const response = await axios.get(dataURL, {
        params: {
          ngCallType: "getEnrolmentKey",
          From: mobile,
          partner_id: partnerId,
        },
      });
      console.log("response.data.key",response.data.key)
      this.setState({enrolmentKey: response.data.key})

      
      return response;
    } catch (e) {
      this.props.enqueueSnackbar("Please enter valid mobile number!", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  async openTest() {
    // const { history } = this.props;
    const response = await this.generateTestLink();
    // console.log("dhfidjf", response.data.key)
    history.push({ pathname: "/test", enrolmentKey: response.data.key })
    // window.open(`${testUrl}${response.data.key}`, "_blank");
    this.setState({ mobileNumber: "" });
    this.props.fetchingFinish();
  }

  giveTest = () => {
    this.openTest();
    // console.log("state", this.state.enrolmentKey)
    // history.push({ pathname: "/test", enrolmentKey: this.state.enrolmentKey })
  };

  handleChange = (e) => {
    console.log("changing value to", e.target.value);
    this.setState({
      selectedLang: e.target.value,
    });
  };

  componentDidMount() {
    const slug = window.location.href.split("partnerLanding/")[1];
    if (slug) {
      this.partnerFetch(slug);
    }
  }

  async partnerFetch(slug) {
    const { history } = this.props;
    try {
      const response = await axios.get(`${baseUrl}partners/slug/${slug}`, {});
      this.setState({
        partnerId: response.data.data["id"],
      });
    } catch (e) {
      console.log(e);
      history.push("/notFound");
    }
  }

  render = () => {
    console.log("state consoling", this.state.enrolmentKey)
    const { classes } = this.props;
    let mobile = this.state.mobile;
    return (
      <div
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "calc(100vh - 48px)",
          display: "flex",
        }}
      >
        <Header onChange={this.handleChange} value={this.state.selectedLang} />
        <MuiThemeProvider theme={theme}>
          <Typography className={classes.paper}>
            {this.lang.Heading[this.state.selectedLang]}
          </Typography>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Grid item>
                <VideoSlider language={this.state.selectedLang} />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid item xs={12}>
                <Box style={{ height: theme.spacing(2) }} />
              </Grid>
              <Grid item>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h4">
                        {this.lang.AdmisssionTitle[this.state.selectedLang]}
                      </Typography>
                    </Grid>
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
                  <Box>
                    <TextField
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8, width: 300 }}
                      label="Mobile Number"
                      value={this.state.mobileNumber}
                      placeholder="Mobile Number..."
                      onChange={this.onChangeEvent}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </Box>
                  <div className={classes.root}>
                    {/* <Redirect to={{pathname: "/test", state: { enrolmentKey: this.state.enrolmentKey }}} > */}
                    {/* <Link to={{pathname: "/test", state: { enrolmentKey: this.state.enrolmentKey }}} > */}
                    <Button
                      variant="outlined"
                      onClick={this.giveTest}
                      color="primary"
                    >
                      {this.lang.TestButton[this.state.selectedLang]}
                    </Button>
                    {/* </Link> */}
                    {/* </Redirect> */}
                  </div>
                </Paper>
              </Grid>
              <Box style={{ height: theme.spacing(6) }} />
              <Grid item>
                <Box
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  px={4}
                  style={{ textAlign: "center" }}
                >
                  <Typography
                    className={classes.typography}
                    variant="h5"
                    component="h3"
                  >
                    {this.lang.Status[this.state.selectedLang]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <TextField
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8, width: 300 }}
                      label="Mobile Number"
                      value={this.state.mobile}
                      placeholder="Mobile Number..."
                      onChange={this.onChangeEventStatus}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </Box>
                  <div className={classes.root}>
                    <StudentStatus
                      mobile={mobile}
                      lang={this.lang.StatusButton[this.state.selectedLang]}
                    />
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </MuiThemeProvider>
        <Box style={{ height: theme.spacing(6) }}></Box>
        <Box>
          <Box
            className="footer-container-box"
            style={{ width: "100vw", paddingLeft: 0, paddingRight: 0 }}
            p={1}
            mt={2}
          >
            <Typography variant="body1">
              {this.lang.Footer[this.state.selectedLang]}
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(
  withStyles(styles)(connect(undefined, mapDispatchToProps)(LandingPage))
);
