import React from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import FilterSelect from './FilterSelect'

import axios from 'axios';
import Box from '@material-ui/core/Box';

import * as Stages from '../data/stages.json'

import Moment from 'react-moment';

import { theme } from '../theme/theme';

import AddBox from '@material-ui/icons/AddBox';

import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { changeFetching } from '../store/actions/auth';

import {withRouter} from 'react-router-dom';

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseUrl = process.env.API_URL;
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight color="primary" {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

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

let columns = [
  {
    title: 'Set',
    field: 'setName',
    filtering: false,
    selectFilter: true,
    sfMulti: true,
    sfTitle: 'set',
  },
  { title: 'Name', field: 'name', filtering: false },
  {
    title: 'City',
    field: 'city',
    selectFilter: true,
    sfMulti: true,
    sfTitle: 'cities'
  },
  {
    title: 'State',
    field: 'state'
  },
  {
    title: 'Number', field: 'number',
    render: rowData => {
      return '+91 ' + rowData.number;
    },
    filtering: false
  },
  {
    title: 'Marks',
    render: rowData => {
      return rowData.marks;
    },
    filtering: false
  },
  {
    title: 'Gender',
    field: 'gender',
    selectFilter: true,
    sfMulti: false,
    sfTitle: 'gender',
    // render: rowData => {
    //   return rowData.gender == 1 ? 'Female' : 'Male';
    // },
    filtering: false
  },
  { 
    title: 'Stage',
    field: 'stageTitle',
    selectFilter: true,
    sfMulti: true,
    sfTitle: 'stages',
    render: rowData => {
      return  <Tooltip title={rowData.stageDesc}>
                <Box data-id={rowData.stage}>
                  {rowData.stageTitle}
                </Box>
              </Tooltip>
    }
  },
  {
    title: 'Added At',
    field: 'createdAt',
    render: rowData => {
      return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
    },
    filtering: false
  },
  {
    title: 'Last Updated',
    field: 'lastUpdated',
    render: rowData => {
      return <Moment format="D MMM YYYY" withTitle>{rowData.lastUpdated}</Moment>
    },
    filtering: false
  }
]

const columnsTransitions = [
  { 
    title: 'Stage',
    field: 'toStage',
    render: rowData => {
      return rowData['toStage'] in Stages.data ? Stages.data[rowData['toStage']].title : rowData['toStage'];;
    }
  },
  {
    title: 'When?',
    field: 'createdAt',
    render: rowData => {
      return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
    },
    defaultSort: 'desc'
  },
  {
    title: 'Description',
    render: rowData => {
      return rowData['toStage'] in Stages.data && 'description' in Stages.data[rowData['toStage']] ? Stages.data[rowData['toStage']].description : "No Description Added Yet.";
    }
  }
]

const filterFns = []

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

  dConvert = (x) => {
    x['number'] = x['contacts'][0]['mobile'];
    x['gender'] = x['gender'] == 1 ? 'Female' : 'Male';
    x['stageTitle'] = x['stage'] in Stages.data ? Stages.data[x['stage']].title : x['stage'];
    x['stageDesc'] = x['stage'] in Stages.data && 'description' in Stages.data[x['stage']] ? Stages.data[x['stage']].description : "No Description Added Yet."
    x['marks'] = x.enrolmentKey[0].totalMarks;

    let transitions = x['transitions'];
    let latestTS = transitions[0].createdAt
  
    if (transitions.length>1) {
      for (let i=1; i<transitions.length; i++) {
        latestTS = transitions[i]['createdAt'] > latestTS ? transitions[i]['createdAt'] : latestTS
      }
    }

    x['lastUpdated'] = latestTS;

    return x
  }

  dataSetup = (data) => {

    columns = columns.map( (x) => {
      if ('selectFilter' in x)
        x.options = []
      return x
    })
    
    for (let i=0; i<data.length; i++) {

      let row = this.dConvert(data[i])

      columns = columns.map( (x) => {
        if ('selectFilter' in x) {
          if (x.options.indexOf(row[x.field])==-1) {
            x.options.push(row[x.field])
          }
        }
        return x
      })

      data[i] = row
    }
    
    columns = columns.map( (x) => {
      if ('selectFilter' in x)
        x.options = x.options.map((x)=> {
          return {label: x, value: x}
        })
      return x
    })
    
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
          icons={tableIcons}
          detailPanel={rowData => {
            return (
              <Box className={classes.innerTable} my={2}>
                <MaterialTable
                  columns={columnsTransitions}
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
            // filtering: true
          }}
          // actions={[
          //   {
          //     icon: 'Assessment',
          //     tooltip: 'Details',
          //     onClick: (event, rowData) => {
          //       alert("POP UP COMING SOON");
          //     }
          //   }
          // ]}
          components={{
            // Toolbar: props => (
            //   <div>
            //     <MTableToolbar {...props} />
            //   </div>
            // ),
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