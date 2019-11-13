import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import { Button } from '@material-ui/core';

import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';

import { changeFetching } from '../store/actions/auth';
import {withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Dialog } from '@material-ui/core';
import Spinner from 'react-spinner-material';
import AddBox from '@material-ui/icons/AddBox';
import {Box} from '@material-ui/core';

const student_stage = [
    // related to the mcq test
    'enrolmentKeyGenerated',
    'basicDetailsEntered',
    'completedTest',
    'completedTestWithDetails',
    'testPassed',
    'testFailed',

    // related to incoming query calls
    'requestCallback',
    'pendingCallbackForQuery',
    'forReviewCallbackQueryResolved',
    'queryResolvedAfterCallback',

    // algebra interviews
    'pendingAlgebraInterview',
    'pendingAlgebraReInterview', // algebra re-interview
    'forReviewAlgebraInterviewDone',
    'algebraInterviewFail',
    'algebraInterviewWaitlisted',

    // english interviews
    'pendingEnglishInterview',
    'forReviewEnglishInterview',
    'englishInterviewFail',
    'englishInterviewWaitlisted',

    // culture fit interviews
    'pendingCultureFitInterview',
    'forReviewCultureFitInterviewDone',
    'cultureFitInterviewWaitlisted',
    'pendingCultureFitReinterview',
    'cultureFitInterviewFail',

    // parent conversations
    'pendingParentConversation',
    'parentConversationFail',

    // travel planning
    'pendingTravelPlanning',
    'finalisedTravelPlans',

    // probation etc. once when the student has joined navgurukul
    'probation',
    'finallyJoined',
    'droppedOut',
    'sentBackAfterProbation',

    // is not reachable
    'becameDisIntersested',
    'disqualifiedUnreachable',

    // diversity based decision
    'disqualifiedAfterDiversityFilter',
    'diversityBasedDecisionPending',

    // random stages for internal use
    'possibleDuplicate',
    'needAction',
    'demo',
    'caughtCheating',
    // liveStudentStages
    'pendingAlgebraInterview',
    'pendingAlgebraReInterview', // algebra re-interview
    'forReviewAlgebraInterviewDone',

    'pendingEnglishInterview',
    'forReviewEnglishInterview',

    'pendingCultureFitInterview',
    'forReviewCultureFitInterviewDone',

    'pendingParentConversation',

    'pendingTravelPlanning',
    'finalisedTravelPlans',
]
const feedback_type = [
    'rqcCallFeedback', 
    'tutionGroupFeedback', 
    'algIntCallFeedback', 
    'reAlgIntFeedback', 
    'cultFitCallRawInfo', 
    'englishIntCallFeedback', 
    'parentConversation', 
    'travelPlanning'
]
const status = ['pass', 'failed', 'pending', 'forReview']

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

export class StudentFeedback extends React.Component {

  async addFeedbck() {
    try {
      this.props.fetchingStart()
      console.log(this.state, "pralhad")
      const response = await axios.post(this.dataURL, {
        "student_stage": student_stage[this.state.student_stage],
        "feedback": this.state.feedback,
        "state": status[this.state.status],
        "feedback_type": feedback_type[this.state.feedback_type]
        }).then(response => {
            this.setState({
                loading:false
            })
            alert("Feedback submited", response);
        })
      this.props.fetchingFinish();
      this.props.history.push("/students");
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.setState({
        loading:true,
    })
    this.addFeedbck();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.dataURL = baseUrl+'students/feedback/'+this.props.studentId+'/1'; // once authentication is implement then insted of `1` pass userID.

    this.state = {
      "feedback_type": "",
      "student_stage": "",
      "status": "",
      "feedback": "",
      "dialogOpen": false,
      "loading": false,
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
  
  render = () => {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
        <Fragment>
            <Box onClick={this.handleOpen}>
                <AddBox/>
                <Spinner size={35} spinnerColor={"#ed343d"} spinnerWidth={5} visible={loading} />
            </Box>
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleClose}
            >
                <form className={classes.container}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-readonly-label">Feedback Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-readonly-label"
                          id="demo-simple-select-readonly"
                          name = "feedback_type"
                          value={this.state.feedback_type}
                          onChange={this.handleChange('feedback_type')}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {feedback_type.map((type, index)=> {
                                return <MenuItem key={index} value={index}>{type}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>Feedback ka type bataye.</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-readonly-label">Student Stage</InputLabel>
                        <Select
                          labelId="demo-simple-select-readonly-label"
                          id="demo-simple-select-readonly"
                          name = "student_stage"
                          value={this.state.student_stage}
                          onChange={this.handleChange('student_stage')}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {student_stage.map((stage, index)=> {
                                return <MenuItem key={index} value={index}>{stage}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>studentKi next stage fill kare.</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="demo-simple-select-readonly-label">Status</InputLabel>
                        <Select
                          labelId="demo-simple-select-readonly-label"
                          id="demo-simple-select-readonly"
                          name = "status"
                          value={this.state.status}
                          onChange={this.handleChange('status')}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {status.map((status, index)=> {
                                return <MenuItem key={index} value={index}>{status}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>Student ke Feedback ke hisab uska status bataye.</FormHelperText>
                    </FormControl>
                    <TextField
                      id="outlined-multiline-static"
                      label="Feedback"
                      multiline
                      rows="6"
                      name='feedback'
                      value={this.state.feedback}
                      onChange={this.handleChange('feedback')}
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                    />
                    <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.btn}>Submit Feedback</Button>
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

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(StudentFeedback)))