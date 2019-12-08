// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import FilterSelect from './FilterSelect'
import Select from 'react-select';

import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';

import { changeFetching, setupUsers } from '../store/actions/auth';

import { withRouter } from 'react-router-dom';

import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { EventEmitter } from './events';

import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '80%',
      marginTop: 5,
      marginBottom: 5
    },
  },
  clear: {
    clear: 'both'
  }
})

let columns;
let filterFns = []

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

    this.loggedInUser = this.props.loggedInUser;

    this.state = {
      data: [],
      sData: undefined, //subsetData
    }

    EventEmitter.subscribe('stageChange', this.stageChangeEvent);
    EventEmitter.subscribe('transitionsChange', this.transitionsChangeEvent);
  }

  stageChangeEvent = (iData) => {
    const rowIds = this.state.data.map(x=>x.id)
    const rowIndex = rowIds.indexOf(iData.rowData.id);
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

    let dataElem = this.state.data[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;
    
    let newData = this.state.data;
    newData[rowIndex] = dataElem;

    this.setState({data:newData });
  }

  transitionsChangeEvent = async (data) => {
    // do api call for new transitions data
    const studentId = data.rowData['studentId'];
    const response = await axios.get(`${baseURL}students/transitions/${studentId}`)
    const rowIds = this.state.data.map(x=>x.id)
    const rowIndex = rowIds.indexOf(studentId);
    let dataElem = this.state.data[rowIndex];
    dataElem.transitions = response.data.data;

    let newData = this.state.data;
    newData[rowIndex] = dataElem;

    this.setState({ data:newData });
    // set new data 
    // call setData
    // fire this event on updating the owner, status or the feedback of the user
    // this.setData({data: newData})
  }

  changeDataType = option => {
    this.dataType = option.value;
    this.fetchStudents();
  }

  changeFromDate = date => {
    this.fromDate = date;
    this.fetchStudents();
  }

  changeToDate = date => {
    this.toDate = date;
    this.fetchStudents();
  }

  handleChange = (field, filterFn) => {

    filterFns[field] = filterFn
    const fieldKeys = Object.keys(filterFns)

    let sData = this.state.data.filter((x) => {
      let result = true
      for (var key in filterFns) {
        result = result && filterFns[key](x)
      }
      return result
    })

    // sData [] and undefined are different
    // sData [] = when no results are returned
    // sData undefined = when all results are returned
    this.setState({
      sData: sData
    })

  }

  dataSetup = (data) => {
    columns = StudentService.setupPre(StudentService.columns[this.dataType]);
    for (let i = 0; i < data.length; i++) {
      data[i] = StudentService.dConvert(data[i])
      columns = StudentService.addOptions(columns, data[i]);
    }

    columns = StudentService.setupPost(columns);

    this.setState({ 'data': data }, function () {
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { classes } = this.props;
    
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

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="dense"
          style={{ marginLeft: 16 }}
          value={this.fromDate}
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
          style={{ marginLeft: 16 }}
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

    if (!this.state.data.length) {
      return options;
    }

    let filterSelectRows = []
    columns.map((x) => {
      if ('selectFilter' in x)
        filterSelectRows.push(
          <FilterSelect
            filter={{
              name: x.sfTitle,
              field: x.field
            }}
            ifMulti={x.sfMulti}
            key={x.field}
            options={x.options}
            handleChange={this.handleChange}
          />
        )
    })

    console.log("column transitions", StudentService.columnTransitions[this.dataType])

    return <Box>
      <MuiThemeProvider theme={theme}>
        {options}
        {filterSelectRows}
        <div className={classes.clear}></div>
        <MaterialTable
          columns={columns}
          data={this.state.sData ? this.state.sData : this.state.data}
          icons={GlobalService.tableIcons}
          detailPanel={rowData => {
            let newData = rowData.transitions.map(v => ({...v, loggedInUser: this.loggedInUser}))
            return (
              <Box className={classes.innerTable} my={2}>
                <MaterialTable
                  columns={StudentService.columnTransitions[this.dataType]}
                  data={newData}
                  icons={GlobalService.tableIcons}
                  options={{
                    search: false,
                    paging: false,
                    toolbar: false,
                    showTitle: false,
                    headerStyle: {
                      color: theme.palette.primary.main,
                      zIndex: 0
                    },
                  }}
                />
              </Box>
            )
          }}
          options={{
            headerStyle: {
              color: theme.palette.primary.main
            },
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            toolbar: false,
          }}
        />
      </MuiThemeProvider>
    </Box>
  }

  componentDidMount() {
    this.fetchStudents();
    this.fetchUsers();
  }

  componentWillUnmount() {
    EventEmitter.unsubscribe('stageChange');
    EventEmitter.unsubscribe('transitionsChange');
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
    try {
      this.props.fetchingStart()
      // response = ngFetch(this.studentsURL, 'GET', {
      //   params: {
      //     dataType: this.dataType,
      //     fromDate: this.fromDate,
      //     toDate: this.toDate
      //   }
      // }, true);

      const response = await axios.get(this.studentsURL, {
        params: {
          dataType: this.dataType,
          fromDate: this.fromDate,
          toDate: this.toDate
        }
      });
      this.dataSetup(response.data.data)
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  };
};

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
