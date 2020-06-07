import 'date-fns';
import React from 'react';
// import { allStages} from '../config';
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Select from 'react-select';

import axios from 'axios';
import Box from '@material-ui/core/Box';
import makeAnimated from 'react-select/animated';

import { theme } from '../theme/theme';
import { changeFetching, setupUsers } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';
import StudentService from '../services/StudentService';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { allStages } from '../config';
import MainLayout from './MainLayout';

const animatedComponents = makeAnimated();
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;
const allStagesOptions = Object.keys(allStages).map(x => { return { value: x, label: allStages[x] } });
allStagesOptions.push({ value: 'default', label: 'Back To All Students Details' })

const styles = theme => ({
  clear: {
    clear: 'both'
  }
})



export class AdmissionsDash extends React.Component {

  constructor(props) {

    super(props);

    if (this.props.match.params.dataType) {
      this.dataType = this.props.match.params.dataType;
    } else {
      this.dataType = 'softwareCourse'
    }
    this.studentsURL = baseURL + 'students';
    this.usersURL = baseURL + 'users/getall';
    this.stage = null,
    this.value = null,
    this.loggedInUser = this.props.loggedInUser;

    this.state = {
      data: [],
      sData: undefined, //subsetData,
      fromDate: null
    }
  }

  stageChangeEvent = (iData) => {
    // const rowIds = this.state.data.map(x => x.id)
    // const rowIndex = rowIds.indexOf(iData.rowData.rowId);
    // this.setState(({data}) => ({
    //   data: [
    //     ...data.slice(0,rowIndex),
    //     {
    //       ...data[rowIndex],
    //       stage: iData.selectedValue.value,
    //       stageTitle: iData.selectedValue.label
    //     },
    //     ...data.slice(rowIndex+1)
    //   ]
    // }))
    let dataElem = this.state.data[iData.rowId];
    // dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;

    let newData = this.state.data;
    newData[iData.rowId] = dataElem;

    this.setState({ data: newData }, function () {
    });
  }

  changeDataType = option => {
    this.dataType = option.value;
    this.stage = null;
    this.value = null;
    this.fetchStudents();
  }

  changeStudentStage = option => {
    this.value = { value: option.value, label: allStages[option.value] }
    if (option.value === "default") {
      this.stage = null;
      this.dataType = 'softwareCourse';
      this.fetchStudents();
      this.value = "Student Detials"
    } else {
      this.stage = option.value;
      this.fetchStudents();
      this.dataType = 'softwareCourse';
    }
  }

  changeFromDate = async (date) => {
    await this.setState({
      fromDate: date
    })
    this.fetchStudents();
  }

  changeToDate = date => {
    this.toDate = date;
    this.fetchStudents();
  }

  dataSetup = (data) => {
    if (data.length > 0 ){
      for (let i = 0; i < data.length; i++) {
        data[i] = StudentService.dConvert(data[i])
      }
      const newData = data.map(v => ({ ...v, loggedInUser: this.props.loggedInUser.email.split('@')[0] }))
      this.setState({ 'data': newData, fromDate: newData.slice(-1)[0].createdAt }, function () {
        this.props.fetchingFinish()
      });
    }
  }

  render = () => {
    const { classes, fetchPendingInterviewDetails } = this.props;  
    const options = <Box>
      <Select
        className={"filterSelectGlobal"}
        value={this.dataType}
        onChange={this.changeDataType}
        options={[{ value: "requestCallback", label: "Request Callback" },
        { value: "softwareCourse", label: "Other Data" }]}
        placeholder={"Select Data Type"}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
      />
      <Select
        className={"filterSelectGlobal"}
        value={this.value}
        onChange={this.changeStudentStage}
        options={allStagesOptions}
        placeholder={"Get Student Details By Stage"}
        isClearable={false}
        components={animatedComponents}
        closeMenuOnSelect={true}
      />

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="dense"
          style={{ marginLeft: 16, maxWidth: '40%' }}
          value={this.state.fromDate}
          id="date-picker-dialog"
          label="From Date"
          format="MM/dd/yyyy"
          onChange={this.changeFromDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />

        <KeyboardDatePicker
          margin="dense"
          style={{ marginLeft: 16, maxWidth: '40%' }}
          value={this.toDate}
          id="date-picker-dialog"
          label="To Date"
          format="MM/dd/yyyy"
          onChange={this.changeToDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </Box>;
    
    if (fetchPendingInterviewDetails) {
      return  <MainLayout
      columns={StudentService.columns[this.dataType]}
      data={this.state.sData ? this.state.sData : this.state.data} />
    }
    
    if (!this.state.data.length) {
      return options;
    }
    
    return (<Box>
      <MuiThemeProvider theme={theme}>
        { this.props.fetchPendingInterviewDetails ? null : options}
        <div className={classes.clear}></div>
        <MainLayout
          columns={StudentService.columns[this.dataType]}
          data={this.state.sData ? this.state.sData : this.state.data} />
      </MuiThemeProvider>
    </Box>)
  }

  componentDidMount() {
    this.fetchStudents();
    this.fetchUsers();
  }


  async fetchUsers() {
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.usersURL, {});
      this.props.usersSetup(response.data.data);
      this.props.fetchingFinish()
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }

  async fetchStudents() {
    const { fetchPendingInterviewDetails, loggedInUser} = this.props; 
    try {
      this.props.fetchingStart()
      // response = ngFetch(this.studentsURL, 'GET', {
      //   params: {
      //     dataType: this.dataType,
      //     fromDate: this.fromDate,
      //     toDate: this.toDate
      //   }
      // }, true);
      let response;
      if (fetchPendingInterviewDetails) {
         response = await axios.get(`${baseURL}students/pending_interview`, {
           params: {
             user: loggedInUser.mailId
           }
         });
      } else {
        response = await axios.get(this.studentsURL, {
          params: {
            dataType: this.dataType,
            stage: this.stage,
            from: this.state.fromDate,
            to: this.toDate
          }
        });
      }
      this.dataSetup(response.data.data)
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users))
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AdmissionsDash)))
