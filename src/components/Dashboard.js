import React from 'react';
import { forwardRef } from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
import Box from '@material-ui/core/Box';

import Moment from 'react-moment';


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

export class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      dataURL : 'http://join.navgurukul.org/api/partners/'+this.props.match.params.partnerid+'/students',
      data: []
    }
  }

  render = () => {
    function dConvert(x) {
      x['number'] = x['contacts'][0]['mobile'];
      return x;
    }
  
    this.state.data = this.state.data.map(dConvert)
   
    const columns=[
      {title: 'Name', field: 'name'},
      {title: 'City', field: 'city' },
      {title: 'Number', field: 'number', 
        render: rowData => {
          return '+91 ' + rowData.number;
        }
      },
      {title: 'Gender', field: 'gender', 
        render: rowData => {
          return rowData.gender==1 ? 'Female' : 'Male';
        }
      },
      {title: 'Stage', field: 'stage'},
      {title: 'Added At', field: 'createdAt', render: rowData=> {
        return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
      }}
    ]

    const columnsTransitions = [
      {title: 'Stage', field: 'toStage'},
      {title: 'When?', field: 'createdAt', render: rowData=> {
        return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
      }}
    ]

    return <MaterialTable
      columns={columns}
      data={this.state.data}
      icons={tableIcons}
      detailPanel={rowData => {
        return (
          <Box width={1/3} mx="auto" my={2}>
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
        exportButton: true,
        pageSize: 20,
        showTitle: false
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
      // components={{
      //   Action: props => (
      //     <Assessment
      //       onClick={(event) => props.action.onClick(event, props.data)}
      //     >
      //     </Assessment>
      //   ),
      // }}
    />
  }

  componentDidMount() {
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
        this.setState({...this.state, isFetching: true});
        const response = await axios.get(this.state.dataURL);
        this.setState({data: response.data.data, isFetching: false});
    } catch (e) {
        console.log(e);
        this.setState({...this.state, isFetching: false});
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


export default DashboardPage;