import React from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import MaterialTable from "material-table";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import {Box} from '@material-ui/core';

import { theme } from '../theme/theme';
import Link from 'react-router-dom';

import ViewAssessments from './ViewAssessments';
import PartnerLink from './PartnerLink';
import CreateAssessment from './CreateAssessment';

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

const filterFns = []

export class PartnerList extends React.Component {

  constructor(props) {

    super(props);
    this.dataURL = baseUrl + 'partners';
    this.columns = [
      {
        title: 'ID',
        field: 'id',
        render: rowData => {
          return <PartnerLink partnerId={rowData.id}/>
        }

      },
      {
        title: 'Name',
        field: 'name',
        filtering: true,
      },
      {
        title: 'View Assessments',
        field: 'name',
        filtering: false,
        render: rowData => {
          return <ViewAssessments partnerId={rowData.id}/>
        }
      },
      {
        title: 'Create Assessment',
        field: 'name',
        filtering: false,
        render: rowData => {
          return <CreateAssessment partnerId={rowData.id} partnerName={rowData.name}/>
        }
      }
    ]
          
    this.state = {
      data: [],
    }
  }

  onRowClick = (event, rowData) => {
    this.props.history.push('/partner/'+rowData.id+'/students');
  }

  dataSetup = (data) => {
    this.setState({'data': data}, function(){
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { classes } = this.props;

    if (!this.state.data.length) {
      return <Box></Box>
    }

    return <Box>
      <MuiThemeProvider theme={theme}>
        <div className={classes.clear}></div>
        <MaterialTable
          columns={this.columns}
          data={this.state.data}
          icons={tableIcons}
          options={{
            headerStyle: {
              color: theme.palette.primary.main
            },
            filtering: true,
            exportButton: true,
            pageSize: 10,
            showTitle: false,
            toolbar: false,
          }}
          // onRowClick={this.onRowClick}
          style={{maxWidth: 700, margin: '0 auto', marginTop: 25}}
        />
      </MuiThemeProvider>
    </Box>
  }

  componentDidMount() {
    this.fetchPartners();
  }

  async fetchPartners() {
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

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(PartnerList)))