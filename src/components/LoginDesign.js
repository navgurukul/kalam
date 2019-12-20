import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { GoogleLogin } from 'react-google-login';

import { login } from '../store/actions/auth';

import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import { theme } from '../theme/theme';
import axios from 'axios';

import { connect } from 'react-redux';

const baseUrl = process.env.API_URL;

const styles = theme => ({
  loginContainer: {
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
  }
});

export class LoginDesign extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     mobileNumber: '',
  //   }
  // }
  
  responseGoogle = (response) => {
    // const mobile = this.state.mobileNumber;
    axios.post(`${baseUrl}users/login/google`, { idToken: response.tokenObj.id_token })
      .then((resp) => {
        const { userToken, user } = resp.data;
        localStorage.setItem('jwt', userToken);
        localStorage.setItem('user', JSON.stringify(user));

        const { history } = this.props;
        this.props.login();
        history.push("/students");
      });
  }
  
  handleChange = name => (event) => {
    let valChange = {}
    valChange[name] = event.target.value;

    this.setState(
      valChange
    );
  };
  
  errr = (error) => {
    alert("There was some issue with Google Login. Contact the admin.");
  }

  getQuote = () => {
    const QUOTES = [
      {
        quote: 'Anyone who has never made a mistake has never tried anything new',
        author: 'Albert Einstein'
      },
      {
        quote: 'The only person who is educated is the one who has learned how to learn …and change.',
        author: 'Carl Rogers'
      },
      {
        quote: 'Be the change that you wish to see in the world.',
        author: 'Mahatma Gandhi'
      },
      {
        quote: 'Education is the most powerful weapon which you can use to change the world.',
        author: 'Nelson Mandela'
      },
      {
        quote: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
        author: 'Rumi'
      }
    ];
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return quote;
  }

  render = () => {
    const { classes } = this.props;
    const quote = this.getQuote();

    return (
      <MuiThemeProvider theme={theme}>
        <Box className={classes.container}>
          <Paper className={classes.loginContainer}>
            <Box>
              <Typography variant="h5" component="h3">
                NavGurukul Admissions
              </Typography>
            </Box>
            {/* <Box style={{height: theme.spacing(5)}} />
            <Box>
              <FormControl>
                <InputLabel htmlFor="partnerName">Mobile Number</InputLabel>
                <Input id="partnerName" aria-describedby="my-helper-text" name="mobileNumber" value={this.state.mobileNumber} onChange={this.handleChange('mobileNumber')}/>
                <FormHelperText id="my-helper-text">Apna Mobile Number Enter karein.</FormHelperText>
              </FormControl>
            </Box> */}
            <Box style={{height: theme.spacing(5)}} />
            <Box>
              <GoogleLogin
                clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.errr}
                scope="profile email"
              />
            </Box>
            <Box style={{height: theme.spacing(7)}} />
            <Box className={classes.quoteContainer}>
              <Box className={classes.quoteText}>
                <Typography variant="body1">{quote.quote}</Typography>
              </Box>
              <Box className={classes.quoteAuthor}>
                <Typography variant="body2" style={{ textAlign: 'right', fontWeight: 'bold' }}>{quote.author}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

      </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch)=>({
  login: () => dispatch(login()),
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoginDesign));