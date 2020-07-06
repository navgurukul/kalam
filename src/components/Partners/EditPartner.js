import React, { Component } from 'react';
import axios from 'axios';
import { Container, Paper, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import FormBuilder from './PartnersFormBuilder';
import FormData from './PartnersData';

class EditPartner extends Component {
    onClick = async ({ values, id }) => {
      const response = await axios.put(`http://join.navgurukul.org/api/partners/${id}`, values);
      console.log(this.props.onClick(),"komal");
    }
    render() {
      const {
        id, notes, slug, name,
      } = this.props.data;
      return (
        <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }} disableGutters>
          <Grid container xs={12}>
            <Grid item xs={8} style={{ align: 'left' }}><h1 style={{ textAlign: 'right', marginTop: 100 }}>Edit Partner</h1></Grid>
            <Grid style={{ marginTop: 112, textAlign: 'center' }} item xs={4}><CancelPresentationIcon onClick={this.props.onClickCLose} style={{ cursor: 'pointer' }} >Back</CancelPresentationIcon></Grid>
          </Grid>

          <FormBuilder
            list={FormData}
            onClick={this.onClick}
            id={id}
            notes={notes}
            slug={slug}
            name={name}
          />
        </Container>
      );
    }
}


export default EditPartner;
