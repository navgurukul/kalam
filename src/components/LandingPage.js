import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { GoogleLogin } from 'react-google-login';

import Paper from '@material-ui/core/Paper';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../theme/theme';
import axios from 'axios';

import { login } from '../store/actions/auth';
import { connect } from 'react-redux';

import ngFetch from '../utils/ngFetch';

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

export class LandingPage extends React.Component {
  
  
  responseGoogle = (response) => {
    console.log(response);
    axios.post(`${baseUrl}users/login/google`, { idToken: response.tokenObj.id_token })
      .then((resp) => {
        const { userToken, user } = resp.data;
        this.props.login(user, userToken);
        localStorage.setItem('jwt', userToken);
        this.props.history.push('/students', user);
        console.log(ngFetch);
      });
  }

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
    console.log(ngFetch);

    return (
      <MuiThemeProvider theme={theme}>
        <Box className={classes.container}>
          <Paper className={classes.loginContainer}>
            <Box>
              <Typography variant="h5" component="h3">
                NavGurukul Admissions
              </Typography>
            </Box>
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, jwt) => dispatch(login(user, jwt)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LandingPage));
