import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { theme } from '../theme/theme';
import axios from 'axios';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { changeFetching } from '../store/actions/auth';
import { VideoSlider } from './VideoSlider';
import Grid from '@material-ui/core/Grid';


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
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: "balck",
    fontSize: '40px',
  },
  typography: {
    fontFamily: 'BlinkMacSystemFont',
  },
  HindiTypography: {
    fontFamily: 'BlinkMacSystemFont',
  },
  HindiTypography1: {
    fontFamily: 'BlinkMacSystemFont',
  },
  typography1: {
    fontFamily: 'BlinkMacSystemFont',
  },
});


export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataURL = baseUrl + 'helpline/register_exotel_call'

    this.state = {
      mobileNumber: '',
    }
  }

  onChangeEvent = (e) => {
    this.setState({
      mobileNumber: e.target.value,
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

  render = () => {
    const { classes } = this.props;
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <div className={classes.root}>
            <Grid container >
              <Grid item xs={12}>
                <Typography className={classes.paper}>Navgurukul Software Engineering Scholarship</Typography>
              </Grid>
            </Grid>
          </div>
          <Box style={{ height: theme.spacing(2) }} />
          <Grid container>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.typography} variant="h4" component="h3">Course Information</Typography>
                <Typography className={classes.HindiTypography} variant="h5" component="h4" >कोर्स के बारे में जाने </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography className={classes.typography1} variant="h4" component="h3" >Apply Test</Typography>
                <Typography className={classes.HindiTypography1} variant="h5" component="h4" >कोर्स में अप्लाई करे </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <VideoSlider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.loginContainer}>
                  <Box>
                    <Grid item xs={12}>
                      <Typography variant="h5" component="h4" >Start Admisssion Test</Typography>
                    </Grid>
                  </Box>
                  <Box style={{ height: theme.spacing(2) }} />
                  <Box>
                    <TextField
                      id="filled-full-width"
                      margin="normal"
                      style={{ margin: 8, width: 300 }}
                      label="Mobile Number/Test Link"
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
                    <Button variant="outlined" onClick={this.giveTest} color="primary">Give Test/परीक्षा दे।</Button>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </MuiThemeProvider>
        <Box className="footer-container-box" p={1} mt={2}>
          <Typography variant="body1" gutterBottom>
            For more queries, write at hi@navgurukul.org | अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org
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