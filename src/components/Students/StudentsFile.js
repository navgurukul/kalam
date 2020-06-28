/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import PartnersPaginationPriority from '../Partners/PartnerPagination';
import TableData from './TableData';

class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListOfPartners: [],
    };
  }

  async componentDidMount() {
    const response = await axios.get('http://join.navgurukul.org/api/students?dataType=softwareCourse');
    // console.log(response.data.data.length, 'response');
    this.setState({
      ListOfPartners: response.data.data,
    });
  }

  render() {
    const {
      ListOfPartners,
    } = this.state;
    return (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}><PartnersPaginationPriority data={ListOfPartners} PageShowing={0} TableData={TableData} NameLIst='Students' /></Grid>
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
