import React from 'react';
import { connect } from 'react-redux';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import FilterSelect from './FilterSelect'

import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';

import { changeFetching, setupUsers } from '../store/actions/auth';

import {withRouter} from 'react-router-dom';

import StudentService from '../services/StudentService';
import StageTransitions from './StageTransitions';
import GlobalService from '../services/GlobalService';
import { EventEmitter } from './events';

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseUrl = process.env.API_URL;

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '50%',
      marginTop: 5,
      marginBottom: 5
    },
  },
  clear: {
    clear: 'both'
  }
})

let columns
let filterFns = []

export class DashboardPage extends React.Component {

  constructor(props) {

    super(props);
    this.dataURL = baseUrl+'partners/'+this.props.match.params.partnerId+'/students';
    this.usersURL = baseUrl + 'users/getall'
    this.state = {
      data: [],
      sData: undefined, //subsetData
    }

    EventEmitter.subscribe('stageChange', this.stageChangeEvent);
  }

  stageChangeEvent = (iData) => {
    const rowIds = this.state.data.map(x=>x.id)
    const rowIndex = rowIds.indexOf(iData.rowData.id);
    
    let dataElem = this.state.data[rowIndex];
    dataElem.stageTitle = iData.selectedValue.label;
    dataElem.stage = iData.selectedValue.value;
    
    let newData = this.state.data;
    newData[rowIndex] = dataElem;

    this.setState({data:newData });
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
    columns = StudentService.setupPre(StudentService.columns["partnerDashboard"]);
 
    for (let i=0; i<data.length; i++) {
      data[i] = StudentService.dConvert(data[i])
      columns = StudentService.addOptions(columns, data[i]);
    }
        
    columns = StudentService.setupPost(columns);
    
    this.setState({'data': data}, function(){
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { classes } = this.props;

    if (!this.state.data.length) {
      return <Box></Box>
    }

    let filterSelectRows = []
    columns.map( (x) => {
      if ('selectFilter' in x)
        filterSelectRows.push(
          <FilterSelect
            filter={{
              name : x.sfTitle,
              field : x.field
            }}
            ifMulti={x.sfMulti}
            key={x.field}
            options={x.options}
            handleChange={this.handleChange}
          />      
        )
    })

    return <Box>
      <MuiThemeProvider theme={theme}>
        {filterSelectRows}
        <div className={classes.clear}></div>
        <MaterialTable
          columns={columns}
          data={this.state.sData ? this.state.sData : this.state.data}
          icons={GlobalService.tableIcons}
          detailPanel={rowData => {
            return (
              <StageTransitions
                dataType={'softwareCourse'}
                studentId={rowData.id}
              />
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
    this.fetchStudents()
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
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.dataURL);
      this.dataSetup(response.data.data);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish()
    }
  }
}

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users))
});

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(DashboardPage)))