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
import { Modal } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { allStages } from "../config";
import { Link } from "react-router-dom";

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
  modal: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
});

function getModalStyle() {
  const top = 50; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "80vh",
    width: "60%",
  };
}

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      selectedLang: "en",
      partnerId: "",
      modalOpen: false,
      data: [],
      pendingInterviewStage: "checking",
    };

    this.lang = {
      Heading: {
        en: "Software Engineering Scholarship",
        hi: "Software Engineering Scholarship",
      },
      Course: {
        en: "Course Information",
        hi: "कोर्स के बारे में जाने",
      },
      Status: {
        en: "Check your test result by entering the number you gave test from",
        hi: "आपने जिस नंबर से परीक्षा दी है, उसे एंटर करके अपना परीक्षा रिजल्ट देखें",
      },
      AdmisssionTitle: {
        en: "Start Admisssion Test",
        hi: "परीक्षा शुरू करें",
      },
      TestButton: {
        en: "GIVE TEST",
        hi: "परीक्षा दे।",
      },
      StatusButton: {
        en: "Check Result",
        hi: "रिजल्ट देखे",
      },
      Footer: {
        en: "For more queries, write at hi@navgurukul.org",
        hi: "अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org",
      },
      mandatoryField: {
        en: "To attempt the test, it is compulsory to enter your First Name, Last Name and Mobile Number. Middle Name is optional, you can choose not to enter.",
        hi: "टेस्ट देने के लिए अपना फर्स्ट नेम, लास्ट नेम और मोबाइल नंबर डालना आवश्यक  है। मध्य नाम वैकल्पिक है, आप प्रवेश नहीं करना चुन सकते हैं।",
      },
      mobileNumber: {
        en: "Please give 10 digits of the mobile number.",
        hi: "कृपया मोबाइल नंबर के 10 अंक दें।",
      },
    };
  }

  onChangeEvent = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onChangeEventStatus = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  };

  isDuplicate = () => {
    const { mobileNumber, firstName, middleName, lastName } = this.state;
    const first_name = firstName.replace(
      firstName[0],
      firstName[0].toUpperCase()
    );
    const middle_name =
      middleName &&
      middleName.replace(middleName[0], middleName[0].toUpperCase());
    const last_name = lastName.replace(lastName[0], lastName[0].toUpperCase());
    axios
      .get(baseUrl + "/check_duplicate", {
        params: {
          Name: firstName.concat(" ", middleName, lastName),
          Number: mobileNumber,
        },
      })
      .then(async (data) => {
        const response = data.data.data;
        console.log("response", response);
        if (response.alreadyGivenTest) {
          this.props.history.push({
            pathname: `/check_duplicate/Name=${first_name}${middle_name}${last_name}&Number=${mobileNumber}&Stage=${response.pendingInterviewStage}`,
            state: {
              state: this.state,
              data: response.data,
            },
          });
        } else {
          const response = await this.generateTestLink();
          const params = {
            firstName: first_name,
            middleName: middle_name,
            lastName: last_name,
            mobileNumber: mobileNumber,
          };
          const queryString = Object.keys(params)
            .map((filter) => {
              if (params[filter]) {
                return `${filter}=${params[filter]}`;
              }
              return null;
            })
            .filter((item) => item)
            .join("&");
          const url = `${testUrl}${response.data.key}?${queryString}`;
          window.open(url, "_blank");
          this.setState({
            mobileNumber: "",
            firstName: "",
            middleName: "",
            lastName: "",
          });
          this.props.fetchingFinish();
        }
      });
  };

  giveTest = async () => {
    const { mobileNumber, firstName, middleName, lastName, selectedLang } =
      this.state;
    if (!mobileNumber || !firstName || !lastName) {
      this.props.enqueueSnackbar(
        <strong>{this.lang.mandatoryField[selectedLang]}</strong>,
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }
      );
      return;
    }
    if (mobileNumber.toString().length !== 10) {
      this.props.enqueueSnackbar(
        <strong>{this.lang.mobileNumber[selectedLang]}</strong>,
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }
      );
      return;
    }
    await this.isDuplicate();
  };

  async generateTestLink(studentId) {
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
          student_id: studentId,
        },
      });
      return response;
    } catch (e) {
      this.props.enqueueSnackbar("Something went wrong", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      this.props.fetchingFinish();
    }
  }

  handleChange = (e) => {
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
      history.push("/notFound");
    }
  }

  render = () => {
    const { classes } = this.props;
    const {
      mobileNumber,
      firstName,
      middleName,
      lastName,
      mobile,
      selectedLang,
    } = this.state;
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
        <Header onChange={this.handleChange} value={selectedLang} />
        <MuiThemeProvider>
          <Typography className={classes.paper}>
            {this.lang.Heading[selectedLang]}
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
                <VideoSlider language={selectedLang} />
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
                        {this.lang.AdmisssionTitle[selectedLang]}
                      </Typography>
                    </Grid>
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      required
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8 }}
                      label="First Name"
                      name="firstName"
                      value={firstName}
                      placeholder="First Name..."
                      onChange={this.onChangeEvent}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />

                    <TextField
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8 }}
                      name="middleName"
                      label="Middle Name"
                      value={middleName}
                      placeholder="Middle Name..."
                      onChange={this.onChangeEvent}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      required
                      id="filled-full-width"
                      margin="normal"
                      name="lastName"
                      style={{ margin: 8 }}
                      label="Last Name"
                      value={lastName}
                      placeholder="Last Name..."
                      onChange={this.onChangeEvent}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />

                    <TextField
                      required
                      id="filled-full-width"
                      margin="normal"
                      style={{
                        margin: 8,
                      }}
                      type="number"
                      name="mobileNumber"
                      label="Mobile Number"
                      value={mobileNumber}
                      placeholder="Mobile Number..."
                      onChange={this.onChangeEvent}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  </div>
                  <div className={classes.root}>
                    <Button
                      variant="outlined"
                      onClick={this.giveTest}
                      color="primary"
                    >
                      {this.lang.TestButton[selectedLang]}
                    </Button>
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
                    {this.lang.Status[selectedLang]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <TextField
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8 }}
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
                    <Link
                      to={{
                        pathname: `/status/${mobile}`,
                        state: { mobile: mobile },
                      }}
                    >
                      <Button variant="outlined" color="primary">
                        {this.lang.StatusButton[selectedLang]}
                      </Button>
                    </Link>
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
              {this.lang.Footer[selectedLang]}
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
