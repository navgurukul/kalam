import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { theme } from '../theme/theme';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { changeFetching } from '../store/actions/auth';
import { VideoSlider } from './VideoSlider';
import Grid from '@material-ui/core/Grid';
import StudentStatus from './StudentStatus';

const baseUrl = process.env.API_URL;
const testUrl = 'http://join.navgurukul.org/k/'

const styles = theme => ({
  loginContainer: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: theme.spacing(4),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    fontSize: 32,
    [theme.breakpoints.down('md')]: {
      fontSize: 24
    }
  },
  typography: {
    fontFamily: 'BlinkMacSystemFont',
  },
});


export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataURL = baseUrl + 'helpline/register_exotel_call'

    this.state = {
      mobileNumber: '',
      mobile: '',
      selectedLang: 'en',
    }

    this.lang = {
      Heading: {
        en: 'Navgurukul Software Engineering Scholarship',
        hi: 'नवगुरुकुल सॉफ्टवेयर अभियान्त्रिक शिष्यवृत्ती'
      },
      Course: {
        en: 'Course Information',
        hi: 'कोर्स के बारे में जाने'
      },
      Test: {
        en: 'Apply Test',
        hi: 'कोर्स में अप्लाई करे',
      },
      Status: {
        en: 'Check Status By Registered Number',
        hi: 'रजिस्टर मोबाइल नंबर से अपना स्टेटस देखे'
      },
      AdmisssionTitle: {
        en: 'Start Admisssion Test',
        hi: 'परीक्षा सुरु करे ',
      },
      StudentStatus: {
        en: 'Student Status',
        hi: 'स्टूडेंट की स्तिथि'
      },
      TestButton: {
        en: 'GIVE TEST',
        hi: 'परीक्षा दे।'
      },
      StatusButton: {
        en: 'GET STATUS',
        hi: 'स्तिथि देखे'
      },
      Footer: {
        en: 'For more queries, write at hi@navgurukul.org',
        hi: 'अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org'
      }
    }
  }

  onChangeEvent = (e) => {
    this.setState({
      mobileNumber: e.target.value,
    })
  }
  
  onChangeEventStatus = (e) => {
    this.setState({
      mobile: e.target.value,
    })
  }
  async generateTestLink() {
    try {
      const mobile = '0' + this.state.mobileNumber;
      this.props.fetchingStart()
      const response = await axios.get(this.dataURL, {
        params: {
          ngCallType: 'getEnrolmentKey',
          From: mobile,
        }
      });
      return response;
    } catch (e) {
      this.props.enqueueSnackbar('Please enter valid mobile number!', {
        variant: 'error', anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }
      });
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  async openTest() {
    const response = await this.generateTestLink();
    window.open(`${testUrl}${response.data.key}`, '_blank');
    this.setState({ mobileNumber: '' })
    this.props.fetchingFinish()
  }

  giveTest = () => {
    this.openTest()
  }

  handleChange = e => {
    this.setState({
      selectedLang: e.target.value
    })
  }
  
  render = () => {
    const { classes } = this.props;
    let mobile = this.state.mobile;
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <div className={classes.root} style={{marginTop: -48}}>
            <Select native
              onChange={this.handleChange} 
              value={""}
              inputProps={{
                id: 'filled-age-native-simple'
               }}
            >
              <option value="language">Select Language</option>
              <option value="en"> English </option>
              <option value="hi"> हिंदी </option>
            </Select>
            <Typography className={classes.paper}>{this.lang.Heading[this.state.selectedLang]}</Typography>
          </div>
          <Box style={{ height: theme.spacing(2) }} />
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Grid item>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Typography className={classes.typography} variant="h5" component="h3">{this.lang.Course[this.state.selectedLang]}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box style={{ height: theme.spacing(2) }} />
              </Grid>
              <Grid item>
                <VideoSlider language={this.state.selectedLang}/>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid item>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Typography className={classes.typography} variant="h5" component="h3" >{this.lang.Test[this.state.selectedLang]}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box style={{ height: theme.spacing(2) }} />
              </Grid>
              <Grid item>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h4" >{this.lang.AdmisssionTitle[this.state.selectedLang]}</Typography>
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
                      variant="outlined" />
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
                  <div className={classes.root}>
                    <Button variant="outlined" onClick={this.giveTest} color="primary">{this.lang.TestButton[this.state.selectedLang]}</Button>
                  </div>
                </Paper>
              </Grid>
              <Box style={{ height: theme.spacing(2) }} />
              <Grid item>
                <Box display="flex" alignItems="center" flexDirection="column">
                  <Typography className={classes.typography} variant="h5" component="h3" >{this.lang.Status[this.state.selectedLang]}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box style={{ height: theme.spacing(2) }} />
              </Grid>
              <Grid item>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h4" >{this.lang.StudentStatus[this.state.selectedLang]}</Typography>
                    </Grid>
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
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
                      variant="outlined" />
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
                  <div className={classes.root}>
                    {
                      mobile.length == 10 ? 
                      <StudentStatus 
                        mobile={mobile}
                        lang={this.lang.StatusButton[this.state.selectedLang]}
                      />: 
                      null
                    }
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </MuiThemeProvider>
        <Box className="footer-container-box" p={1} mt={2}>
          <Typography variant="body1" gutterBottom>
          {this.lang.Footer[this.state.selectedLang]}
        </Typography>
        </Box>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(withStyles(styles)(connect(undefined, mapDispatchToProps)(LandingPage)));