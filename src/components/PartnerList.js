import React from 'react';
import { forwardRef } from 'react';

import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import { Box, Link } from '@material-ui/core';

import { theme } from '../theme/theme';

import ViewAssessments from './ViewAssessments';
import PartnerLink from './PartnerLink';
import EditPartner from './EditPartner'
import CreateAssessment from './CreateAssessment';

import { changeFetching } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';
import MainLayout from './MainLayout';


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
  }
})

export class PartnerList extends React.Component {

  constructor(props) {

    super(props);
    this.columns = [

      {
        name: 'id',
        label: 'Name',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, rowMeta) => {
            let name = rowMeta.rowData[2];
            return <PartnerLink partnerId={value} name={name} />
          }
        }
      },
      {
        name: 'notes',
        label: 'View Assessments',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, rowMeta) => {
            return <ViewAssessments partnerId={rowMeta.rowData[0]} />
          }
        }
      },
      {
        name: 'name',
        label: 'Create Assessment',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (rowData, rowMeta, updateValue) => {
            return <CreateAssessment partnerId={rowMeta.rowData[0]} partnerName={rowData} />
          }
        }
      },
      {
        name: 'slug',
        label: 'Online Test For Partner',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, rowMeta ) => {
            if (value) {
              const url= `/partnerLanding/${value}`
              return (
                <div>
                  <a href={url} target='_blank' style={{ color: "#f05f40" }}>Go for test</a>
              </div>
              )
            } else {
              return <EditPartner partnerId={rowMeta.rowData[0]} name={rowMeta.rowData[2]} notes={rowMeta.rowData[1]} />
            }
          }
        }
      }
    ]

    this.state = {
      data: [],
    }
  }

  onRowClick = (event, rowData) => {
    this.props.history.push('/partner/' + rowData.id + '/students');
  }

  dataSetup = (data) => {
    this.setState({ 'data': data }, function () {
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { classes } = this.props;

    if (!this.state.data.length) {
      return <Box></Box>
    }
    return (<Box>
      <MuiThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <MainLayout columns={this.columns}
            data={this.state.data} />
        </div>
      </MuiThemeProvider>
    </Box>)
  }

  componentDidMount() {
    this.fetchPartners();
  }

  async fetchPartners() {
    try {
      this.props.fetchingStart()
      const dataURL = baseUrl + 'partners';
      const response = await axios.get(dataURL);
      this.dataSetup(response.data.data);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish()
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(PartnerList)))