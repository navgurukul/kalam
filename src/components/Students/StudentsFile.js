/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import PartnersPaginationPriority from '../Partners/PartnerPagination';
import TableData from './TableData';
import HeaderBar from '../HeaderBar';

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

  StudentData = ({ EachRowData }) => {
    console.log(EachRowData, 'each row data');
  }

  render() {
    const {
      ListOfPartners,
    } = this.state;
    return (
      <Grid xs={12}>
        <Grid item xs={12}><HeaderBar /></Grid>
        <Grid item xs={12} style={{ marginTop: 20 }}><PartnersPaginationPriority data={ListOfPartners} PageShowing={0} TableData={TableData} onClick={this.StudentData} NameLIst='Students' /></Grid>
      </Grid>
    );
  }
}


export default Partners;
