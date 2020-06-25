import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Container, Paper } from '@material-ui/core';
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
          <h1>Edit Partner</h1>
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
