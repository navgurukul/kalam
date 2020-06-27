import React, { PureComponent } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import FormData from './PartnersData';
import FormBuilder from './PartnersFormBuilder';

class AddPartner extends PureComponent {
  onClick = async (values) => {
    //   const { pathname } = this.props.location;
    // console.log('CHECKIMG', values);
    const response = await axios.post('http://join.navgurukul.org/api/partners', values);
    console.log(response, '[[[[[[[[[[[[[');
  }

  render() {
    return (
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center', marginTop: '20px' }}>
        <FormBuilder list={FormData} onClick={this.onClick} />
      </Container>
    );
  }
}

export default AddPartner;
