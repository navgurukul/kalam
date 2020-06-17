import React, { Component } from 'react';
import axios from 'axios';
import { Container, Paper } from '@material-ui/core';
import FormBuilder from './PartnersFormBuilder';
import FormData from './PartnersData';

class EditPartner extends Component {
    onClick = async (values) => {
      //   const { pathname } = this.props.location;
    //   console.log('CHECKIMG', values);
      const response = await axios.put(`http://join.navgurukul.org/api/partners/${this.props.location.state.id}`, values);
    //   console.log(response, '[[[[[[[[[[[[[');
    }

    render() {
    // console.log(this.props.location.state);
      const {
        id, notes, slug, name,
      } = this.props.location.state;
      return (
        <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }}>
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
