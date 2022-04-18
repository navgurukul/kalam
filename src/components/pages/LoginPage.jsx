import React from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
// import Paper from '@mui/material/Paper';
// import Input from '@mui/material/Input';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
// import Grid from '@mui/material/Grid';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import Key from '@material-ui/icons/VpnKey';
// import Button from '@mui/material/Button';
import GoogleLogin from "react-google-login";
import { useSnackbar } from "notistack";
import { login } from "../../store/slices/authSlice";

const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const startLogin = (userid) => dispatch(login(userid));

  const onSuccess = () => {
    startLogin();
  };

  const onFailure = (error) => {
    enqueueSnackbar(`Login Failed! ${error.message}`, { variant: "error" });
  };
  return (
    <GoogleLogin
      clientId="34917283366-b806koktimo2pod1cjas8kn2lcpn7bse.apps.googleusercontent.com"
      onSuccess={onSuccess}
      render={(renderProps) => (
        <Box onClick={renderProps.onClick} disabled={renderProps.disabled}>
          Login Using Google
        </Box>
      )}
      onFailure={onFailure}
      scope="profile email"
    />
    //   <div className="login-page-class">
    //     <Paper className="loginPaper">
    //       <div className="loginheaderpart">
    //         <Typography variant="display3" gutterBottom className="loginpageheader">
    //           Login
    //         </Typography>
    //       </div>
    //       <Typography variant="headline" component="h3">
    //         Login to your account
    //       </Typography>
    //       <form>
    //         <div className="loginformgroup">
    //           <AccountCircle />
    //           <TextField id="input-username" label="Username" />
    //         </div>
    //         <div className="loginformgroup">
    //           <Key />
    //           <TextField type="password" id="input-password" label="Password" />
    //         </div>
    //       </form>
    //       <Button  variant="raised" color="primary" onClick={this.OnClickLogin}>
    //         <Typography variant="button" gutterBottom className="logintypography">
    //           Login
    //         </Typography>
    //       </Button>
    //     </Paper>
    // </div>
  );
};

export default LoginPage;
