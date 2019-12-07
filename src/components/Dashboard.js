import React from 'react';
import { connect } from 'react-redux';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import FilterSelect from './FilterSelect'

import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';

import { changeFetching } from '../store/actions/auth';

import {withRouter} from 'react-router-dom';

import StudentService from '../services/StudentService';
import GlobalService from '../services/GlobalService';

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

    this.state = {
      data: [],
      sData: undefined, //subsetData
    }
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
    const columnTransitions = StudentService.columnTransitions["partnerDashboard"];

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
              <Box className={classes.innerTable} my={2}>
                <MaterialTable
                  columns={columnTransitions}
                  data={rowData.transitions}
                  options={{
                    search: false,
                    paging: false,
                    toolbar: false,
                    showTitle: false,
                    headerStyle: {
                      color: theme.palette.primary.main
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
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.dataURL);
      this.dataSetup(response.data.data);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish()
    }
  };
};

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(DashboardPage)))