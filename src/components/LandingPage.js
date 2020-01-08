import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { theme } from '../theme/theme';
import axios from 'axios';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
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
});

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataURL = baseUrl + 'helpline/register_exotel_call'

    this.state = {
      mobileNumber_TestLink: '',
    }
  }

  onChangeEvent = (e) => {
    this.setState({
      mobileNumber_TestLink: e.target.value,
    })
  }

  async generateTestLink() {
    try {
      const mobile = '0' + this.state.mobileNumber_TestLink;
      this.props.fetchingStart()
      const response = await axios.get(this.dataURL, {
        params: {
          ngCallType: 'getEnrolmentKey',
          From: mobile,
        }
      });
      return response;
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  async copyTestLink() {
    const response = await this.generateTestLink();
    this.setState({
      mobileNumber_TestLink: `${testUrl}${response.data.key}`
    })

    this.props.enqueueSnackbar('Successfully copied the test link', { variant: 'success' });
    navigator.clipboard.writeText(this.state.mobileNumber_TestLink)
    this.props.fetchingFinish()
  }

  async openTest() {
    const response = await this.generateTestLink();
    window.open(`${testUrl}${response.data.key}`, '_blank');
    this.props.fetchingFinish()
  }

  onSubmit = () => {
    this.copyTestLink();
  }

  giveTest = () => {
    this.openTest()
  }

  render = () => {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container spacing={3} style={{marginLeft: 0, marginRight: 0}}>
          <Grid item xs={12} sm={6}>
            <VideoSlider />
          </Grid>
          <Grid item xs={12} sm={6} style={{margin: 'auto'}}>
            <Paper className={classes.loginContainer}>
              <Box>
                <Typography variant="h5" component="h3" >
                  Join Navgurukul
              </Typography>
              </Box>
              <Box style={{ height: theme.spacing(2) }} />
              <Box>
                <TextField
                  id="filled-full-width"
                  margin="normal"
                  style={{ margin: 8, width: 300 }}
                  label="Mobile Number/Test Link"
                  value={this.state.mobileNumber_TestLink}
                  placeholder="Mobile Number..."
                  onChange={this.onChangeEvent}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined" />
              </Box>
              <Box style={{ height: theme.spacing(2) }} />
              <div className={classes.root}>
                <Button variant="outlined" onClick={this.giveTest} color="primary">Give Test</Button>
                <Button variant="outlined" onClick={this.onSubmit} color="primary">Get & Copy Test Link</Button>
              </div>
            </Paper>
          </Grid>

        </Grid>
        {/* <Box className={classes.container}> */}
        {/* </Box> */}
      </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withSnackbar(withStyles(styles)(connect(undefined, mapDispatchToProps)(LandingPage)));