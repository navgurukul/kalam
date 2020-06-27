import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Container, Paper, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FormBuilder from './PartnersFormBuilder';
import FormData from './PartnersData';

class EditPartner extends Component {
    onClick = async ({ values, id }) => {
      const response = await axios.put(`http://join.navgurukul.org/api/partners/${id}`, values);
      console.log(response, '[[[[[[[[[[[[[');
      this.props.onClick();
    }

    render() {
      // console.log(this.props.data, 'dataaaa');
      const {
        id, notes, slug, name,
      } = this.props.data;
      return (
        <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }}>
          <Grid container>
            <Grid item xs={11} style={{ align: 'left' }}><h1>Edit Partner</h1></Grid>
            <Grid style={{ align: 'right', marginTop: 27 }} item xs={1}><CloseIcon onClick={this.props.onClickCLose} style={{ cursor: 'pointer' }} /></Grid>
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
