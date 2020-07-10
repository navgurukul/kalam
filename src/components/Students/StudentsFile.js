/* eslint-disable no-nested-ternary */
import React from 'react';
import axios from 'axios';
import {
  Grid, Button, Box, Typography,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import PartnersPaginationPriority from '../Partners/PartnerPagination';
import TableData from './TableData';
import HeaderBar from '../HeaderBar';

class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListOfPartners: [],
      isDialogOpen: false,
      RowData: null,
    };
  }

  async componentDidMount() {
    // const { params } = this.props.match;
    const response = await axios.get('http://join.navgurukul.org/api/students?dataType=softwareCourse');
    // console.log(response.data.data.length, 'response');
    this.setState({
      ListOfPartners: response.data.data,
    });
  }

  StudentData = ({ EachRowData }) => {
    this.props.history.push('/Students/details');
    this.setState({
      isDialogOpen: true,
      RowData: EachRowData,
    });
  }

  handleClose = () => {
    this.props.history.push('/Students/');
    this.setState({
      isDialogOpen: false,
    });
  }

  render() {
    console.log(this.state.RowData, 'hi');
    const {
      ListOfPartners, RowData,
    } = this.state;
    return (
      <Grid xs={12}>
        <Grid item xs={12}><HeaderBar /></Grid>
        <Grid item xs={12} style={{ marginTop: 20 }}><PartnersPaginationPriority data={ListOfPartners} PageShowing={0} TableData={TableData} onClick={this.StudentData} NameLIst="Students" /></Grid>
        {this.state.isDialogOpen ? (
          <Dialog open={this.state.isDialogOpen}>
            <Box my={2}>
              <Typography style={{ padding: 20, background: 'aliceblue' }}>
                Student Name :
                {' '}
                { RowData.name }
                {' '}
                (studentID
                {' '}
                {RowData.id}
                )
              </Typography>
            </Box>
            <Button style={{ background: 'silver' }} onClick={this.handleClose}>close</Button>
          </Dialog>
        ) : null}
      </Grid>
    );
  }
}


export default Partners;
