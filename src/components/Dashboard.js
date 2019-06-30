import React from 'react';
import { forwardRef } from 'react';

import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles, withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios';
import Box from '@material-ui/core/Box';

import * as stages from '../data/stages.json'

import Moment from 'react-moment';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { theme } from '../theme/theme';

import AddBox from '@material-ui/icons/AddBox';
// import Assessment from '@material-ui/icons/Assessment';
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

// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  // Assessment: forwardRef((props, ref) => <Assessment {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
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
      width: '33%',
      marginTop: 5,
      marginBottom: 5
    },
  }
})

export class DashboardPage extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      isFetching: false,
      dataURL: 'http://join.navgurukul.org/api/partners/' + this.props.match.params.partnerid + '/students',
      data: [],
      sData: [], //subsetData
      selectedCity: null
    }
  }

  handleChange = selectedCity => {
    this.setState({ selectedCity });
    if (selectedCity) {
      this.state.sData = this.state.data.filter((x) => {
        return selectedCity.filter((m) => { return m.value == x.city }).length;
      })
    } else {
      this.state.sData = [];
    }
    this.forceUpdate();
  };

  render = () => {
    const { selectedCity } = this.state;
    const { classes } = this.props;

    function dConvert(x) {
      x['number'] = x['contacts'][0]['mobile'];
      x['gender'] = x['gender'] == 1 ? 'Female' : 'Male';
      x['stageTitle'] = x['stage'] in stages.data ? stages.data[x['stage']].title : x['stage'];
      x['stageDesc'] = x['stage'] in stages.data && 'description' in stages.data[x['stage']] ? stages.data[x['stage']].description : "No Description Added Yet.";
      return x;
    }

    this.state.data = this.state.data.map(dConvert)
    this.state.cities = [...new Set(this.state.data.map((x) => x.city))]
    this.state.cities = this.state.cities.map((x) => { return { label: x, value: x } })

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
      }
    ]

    const columnsTransitions = [
      { title: 'Stage', field: 'toStage' },
      {
        title: 'When?', field: 'createdAt', render: rowData => {
          return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
        }
      }
    ]

    // console.log('theme', theme.palette.primary.main);
    
    return <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          columns={columns}
          data={this.state.sData.length ? this.state.sData : this.state.data}
          icons={tableIcons}
          detailPanel={rowData => {
            return (
              <Box width={1 / 3} className={classes.innerTable} my={2}>
                <MaterialTable
                  columns={columnsTransitions}
                  data={rowData.transitions}
                  options={{
                    search: false,
                    paging: false,
                    toolbar: false,
                    showTitle: false
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
            Toolbar: props => (
              <div>
                <Select
                  className="filterSelect"
                  value={selectedCity}
                  isMulti
                  onChange={this.handleChange}
                  options={this.state.cities}
                  placeholder="Select City ..."
                  isClearable={true}
                  components={animatedComponents}
                  closeMenuOnSelect={true}
                />
                <MTableToolbar {...props} />
              </div>
            ),
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
      this.setState({ ...this.state, isFetching: true });
      const response = await axios.get(this.state.dataURL);
      this.setState({ data: response.data.data, isFetching: false });
    } catch (e) {
      console.log(e);
      this.setState({ ...this.state, isFetching: false });
    }
  };
};

// const DashboardPage = ({match}) => (
//   <div>
//     This is from my dashboard component {match.params.partnerid} OK
//   </div>
// );


// export class DashboardPage extends React.Component {
//   render() {
//     return (
//       <MaterialTable
//         title="Student Dashboard"
//         columns={[
//           // {
//           //   title: 'Avatar',
//           //   field: 'avatar',
//           //   render: rowData => (
//           //     <
//           //     // <img
//           //     //   style={{ height: 36, borderRadius: '50%' }}
//           //     //   src={rowData.avatar}
//           //     // />
//           //   ),
//           // },
//           // { title: 'Id', field: 'id' },
//           { title: 'First Name', field: 'name' },
//           { title: 'City', field: 'city' },
//         ]}
//         data={query =>
//           new Promise((resolve, reject) => {
//             let url = 'http://join.navgurukul.org/api/partners/'+this.props.match.params.partnerid+'/students';
//             url += 'per_page=' + query.pageSize;
//             url += '&page=' + (query.page + 1);
//             fetch(url)
//               .then(response => response.json())
//               .then(result => {
//                 resolve({
//                   data: result.data,
//                   page: 10, //result.page - 1,
//                   totalCount: 300,
//                 })
//               })
//           })
//         }
//       />
//     )
//   }
// }


export default withStyles(styles)(DashboardPage);