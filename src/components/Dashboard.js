import React from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import MaterialTable, { MTableToolbar } from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios';
import Box from '@material-ui/core/Box';

import * as Stages from '../data/stages.json'

import Moment from 'react-moment';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
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

// const cities = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

const animatedComponents = makeAnimated();

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

const columns = [
  { title: 'Set', field: 'setName', filtering: false },
  { title: 'Name', field: 'name', filtering: false },
  { title: 'City', field: 'city' },
  { title: 'State', field: 'state' },
  {
    title: 'Number', field: 'number',
    render: rowData => {
      return '+91 ' + rowData.number;
    },
    filtering: false
  },
  {
    title: 'Gender', field: 'gender',
    // render: rowData => {
    //   return rowData.gender == 1 ? 'Female' : 'Male';
    // },
    filtering: false
  },
  { 
    title: 'Stage',
    // field: 'stageTitle',
    render: rowData => {
      return  <Tooltip title={rowData.stageDesc}>
                <Box data-id={rowData.stage}>
                  {rowData.stageTitle}
                </Box>
              </Tooltip>
    }
  },
  {
    title: 'Added At', field: 'createdAt', render: rowData => {
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

export class DashboardPage extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      dataURL: 'http://join.navgurukul.org/api/partners/' + this.props.match.params.partnerid + '/students',
      data: [],
      sData: undefined, //subsetData
      selectedCity: [],
      selectedStages: []
    }
  }

  handleChange = () => {
    const { selectedCity, selectedStages } = this.state

    //change code to handle - constraint addition & deletion differently
    // Addition
    // When an option is added where already an option was there
    // When an option is removed such that zero options are left now

    // Deletion
    // When an option is added where there was no option
    // When an option is removed such that there were more options already

    // Create a more generic way of doing this so that it can be scaled up

    if (selectedCity || selectedStages ) {
      //or of all the cities & and of all the stages

      let sData = this.state.data.filter((x) => {

        const ifCityFilter = !selectedCity || !selectedCity.length || selectedCity.filter((m) => { 
            if (x.city) {
              return m.value.toLowerCase() == x.city.toLowerCase()
            } else {
              return false
            }
          }).length
        
        const ifStagesFilter = !selectedStages || !selectedStages.length || selectedStages.filter((m) => {
            if (x.stageTitle) {
              return m.value == x.stageTitle 
            } else {
              return false
            }
          }).length

        return ifCityFilter && ifStagesFilter
      })

      this.setState({
        sData: sData
      })

    } else {
      this.setState({
        sData: undefined
      })
    }
  }

  handleCityChange = selectedCity => {
    this.state.selectedCity = selectedCity
    this.handleChange()
  }

  handleStageChange = selectedStages => {
    this.state.selectedStages = selectedStages
    this.handleChange()
  }

  dConvert = (x) => {
    x['number'] = x['contacts'][0]['mobile'];
    x['gender'] = x['gender'] == 1 ? 'Female' : 'Male';
    x['stageTitle'] = x['stage'] in Stages.data ? Stages.data[x['stage']].title : x['stage'];
    x['stageDesc'] = x['stage'] in Stages.data && 'description' in Stages.data[x['stage']] ? Stages.data[x['stage']].description : "No Description Added Yet."
    // x['lastUpdated'] = getLastUpdated(x.transitions)

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
    // getLastUpdated = (transitions) => {
    //   let latestTS = transitions[0].createdAt
    
    //   if (transitions.length>1) {
    //     for (let i=1; i<transitions.length; i++) {
    //       latestTS = transitions[i]['createdAt'] > latestTS ? transitions[i]['createdAt'] : latestTS
    //     }
    //   }
    
    //   return latestTS
    // }    

    let cities = []
    let stages = []

    for (let i=0; i<data.length; i++) {
      let row = this.dConvert(data[i])

      if (cities.indexOf(row.city)==-1) {
        cities.push(row.city)
      }

      if (stages.indexOf(row.stageTitle)==-1) {
        stages.push(row.stageTitle)
      }

      data[i] = row
    }

    this.state.cities = cities.map((x)=> {return {label: x, value: x}})
    this.state.stages = stages.map((x)=> {return {label: x, value: x}})

    this.setState({'data': data}, function(){
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { selectedCity, selectedStages } = this.state;
    const { classes } = this.props;

    return <Box>
      <MuiThemeProvider theme={theme}>
        <Select
          className="citySelect"
          value={selectedCity}
          isMulti
          onChange={this.handleCityChange}
          options={this.state.cities}
          placeholder="Select City ..."
          isClearable={true}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
        <Select
          className="stagesSelect"
          value={selectedStages}
          isMulti
          onChange={this.handleStageChange}
          options={this.state.stages}
          placeholder="Select Stage ..."
          isClearable={true}
          components={animatedComponents}
          closeMenuOnSelect={true}
        />
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
      const response = await axios.get(this.state.dataURL);
      this.dataSetup(response.data.data);
      // this.setState({ 
      //                 data: this.dataSetup(response.data.data),
      //                 isFetching: false
      //               }, function() {
      //                 // dataSetup();
      //             });
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