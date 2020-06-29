import React, { PureComponent } from 'react';
import axios from 'axios';
import { Container, Paper, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FormData from './PartnersData';
import FormBuilder from './PartnersFormBuilder';

class AddPartner extends PureComponent {

  onClick = async ({ values }) => {
    //   const { pathname } = this.props.location;
    // console.log('CHECKIMG', values);
    const response = await axios.post('http://join.navgurukul.org/api/partners', values);
    console.log(response, '[[[[[[[[[[[[[');
  }

  render() {
    return (
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center', marginTop: '20px' }}>
        <Grid container>
          <Grid item xs={11} style={{ align: 'left' }}><h1>Add Partner</h1></Grid>
          <Grid style={{ align: 'right', marginTop: 27 }} item xs={1}><CloseIcon onClick={this.props.onClick} style={{ cursor: 'pointer' }} /></Grid>
        </Grid>
        <FormBuilder list={FormData} onClick={this.onClick} />
      </Container>
    );
  }
}

export default AddPartner;
