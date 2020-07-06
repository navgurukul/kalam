import React, { PureComponent } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button,
} from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
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
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }} disableGutters>
        <Grid container xs={12}>
          <Grid item xs={8} style={{ align: 'left' }}><h1 style={{ textAlign: 'right', marginTop: 100 }}> Add Partner </h1></Grid>
          <Grid style={{ marginTop: 112, textAlign: 'center' }} item xs={4}><CancelPresentationIcon onClick={this.props.onClick} style={{ cursor: 'pointer' }}>Back</CancelPresentationIcon></Grid>
        </Grid>
        <FormBuilder list={FormData} onClick={this.onClick} />
      </Container>
    );
  }
}

export default AddPartner;
