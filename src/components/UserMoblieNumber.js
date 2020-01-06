import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { withRouter } from 'react-router-dom';

import { login } from '../store/actions/auth';

import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { theme } from '../theme/theme';
import axios from 'axios';

import { connect } from 'react-redux';

const baseUrl = process.env.API_URL;

const styles = theme => ({
  userContact: {
    padding: theme.spacing(3, 2),
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(4),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

export class UserMobileNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
    }
  }
  
  dashBoard = () => {
    const mobile = this.state.mobileNumber;
    axios.post(`${baseUrl}students/mobile/${this.props.loggedInUser.id}`, { mobile: mobile })
      .then((resp) => {
        const user = resp.data.data.user;
        if (user) {
          const { history } = this.props;
          localStorage.setItem('user', JSON.stringify(user));
          this.props.login();
          history.push("/students");
        }
      });
  }

  handleChange = name => (event) => {
    let valChange = {}
    valChange[name] = event.target.value;

    this.setState(
      valChange
    );
  };

  render = () => {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Box className={classes.container}>
          <Paper className={classes.userContact}>
            <Box>
              <Typography variant="h5" component="h3">
                NavGurukul Admissions
              </Typography>
            </Box>
            <Box style={{height: theme.spacing(5)}} />
            <Box>
              <FormControl>
                <InputLabel htmlFor="partnerName">Mobile Number</InputLabel>
                <Input id="partnerName" aria-describedby="my-helper-text" name="mobileNumber" value={this.state.mobileNumber} onChange={this.handleChange('mobileNumber')}/>
                <FormHelperText id="my-helper-text">Apna Mobile Number Enter karein.</FormHelperText>
              </FormControl>
            </Box>
            <Box style={{height: theme.spacing(2)}} />
            <div className={classes.root}>
              <Button variant="outlined" onClick={this.dashBoard} color="primary">Submit</Button>
            </div>
          </Paper>
        </Box>
      </MuiThemeProvider>
    );
  }
}
const mapStateToProps = (state) => ({
    loggedInUser: state.auth.loggedInUser,
});

const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(login()),
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserMobileNumber)))