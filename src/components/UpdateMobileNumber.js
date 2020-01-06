import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Button } from '@material-ui/core';
import { changeFetching } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';

import { Dialog } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import {Box} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import { theme } from '../theme/theme';
import axios from 'axios';

const baseUrl = process.env.API_URL;

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(4),
      },
   btn: {
       marginTop: theme.spacing(4)
   },
   userContact: {
       padding: theme.spacing(3, 2),
       maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
   },
   root: {
       '& > *': {
       margin: theme.spacing(1),
    },
  },
})

export class UpdateMobileNumber extends React.Component {

  constructor(props) {
    super(props);
    this.student_stage= this.props.student_stage;
    this.state = {
        mobileNumber: "",
        "dialogOpen": false,
    }
  }

  handleChange = name => (event) => {
    let valChange = {}
    valChange[name] = event.target.value;

    this.setState(
      valChange
    );
  };
  
  dashBoard = () => {
    const mobile = this.state.mobileNumber;
    try {
      axios.post(`${baseUrl}students/mobile/${this.props.loggedInUser.id}`, { mobile: mobile })
      .then(() => {
        this.props.enqueueSnackbar('Mobile number is successfully changed!',{ variant: 'success' });
      });
    } catch (e) {
      this.props.enqueueSnackbar('Please enter valide mobile number!',{ variant: 'error' });
    }
    
    this.handleClose();
  }
  
  handleClose = () => {
    this.setState({
      dialogOpen: false
    })
  };


  handleOpen = () => {
    this.setState({
      dialogOpen: true
    })
  }
  
  render = () => {
    const { classes } = this.props;
    return (
        <Fragment>
            <Box >
                <Button variant="outlined" onClick={this.handleOpen} color="primary">Update Mobile Number</Button>
            </Box>
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleClose}
            >    
        <Box className={classes.container}>
            <Paper className={classes.userContact}>
                <Box>
                    <Typography variant="h5" component="h3">
                        Update Mobile Number
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
            </Dialog>  
        </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
    loggedInUser: state.auth.loggedInUser,
});

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withSnackbar(withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UpdateMobileNumber))))