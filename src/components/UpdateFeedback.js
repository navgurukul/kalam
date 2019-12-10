import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import axios from 'axios';
import { Button } from '@material-ui/core';
import { changeFetching } from '../store/actions/auth';
import {withRouter} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import { Dialog } from '@material-ui/core';

import { withSnackbar } from 'notistack';
import {Box} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { EventEmitter } from './events';

const baseUrl = process.env.API_URL;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: 400,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  btn: {
    marginTop: theme.spacing(4)
  }
})

export class UpdateFeedback extends React.Component {

  async updateFeedback() {
    try {
      this.props.fetchingStart()
      const { rowData } = this.props;
      const response = await axios.put(this.dataURL, {
        "student_stage": this.student_stage,
        "feedback": this.state.feedback,
        }).then(response => {
            this.setState({
                dialogOpen: false,
            })
            this.props.enqueueSnackbar('Feedback updated successfully!',{ variant: 'success' });
            EventEmitter.dispatch("transitionsChange"+this.props.studentId, {rowData:rowData});
        })
      this.props.fetchingFinish();
    } catch (e) {
      this.props.enqueueSnackbar('Please select student Status',{ variant: 'error' });
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.setState({
        loading:true,
    })
    this.updateFeedback();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.dataURL = baseUrl+'students/feedback/'+this.props.studentId;
    this.student_stage= this.props.student_stage;
    this.state = {
      "feedback": "",
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
  
  getFeedbackEditable = (feedbackDetails) => {
    console.log(feedbackDetails.user)
    return feedbackDetails.user + ": \n\n"+ feedbackDetails.feedback;
  }

  render = () => {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
        <Fragment>
            <Box onClick={this.handleOpen}>
                <EditIcon/>
            </Box>
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleClose}
            >
                <form className={classes.container}>
                    <h1 style={{color: '#f05f40',textAlign: 'center'}}>Update Feedback</h1>
                    <TextField
                      id="outlined-multiline-static"
                      label="Feedback"
                      multiline
                      rows="6"
                      name='feedback'
                      defaultValue={this.getFeedbackEditable(this.props)}
                      onChange={this.handleChange('feedback')}
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                    />
                    <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.btn}>Update Feedback</Button>
                </form>
            </Dialog>  
        </Fragment>
    );
  }
};

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withSnackbar(withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(UpdateFeedback))))