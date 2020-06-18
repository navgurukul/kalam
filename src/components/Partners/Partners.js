import React, { Fragment } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import PartnersPagination from './PartnersPagination';
import { history } from '../../providers/routing/app-history';

class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListOfPartners: [],
    };
  }

  async componentDidMount() {
    const response = await axios.get('http://join.navgurukul.org/api/partners');
    // console.log(response.data.data.length, 'response');
    this.setState({
      ListOfPartners: response.data.data,
    });
  }

  AddPartnerHandler = () => {
    history.push('/AddPartner');
  }

  EditPartnerHandler = () => {
    history.push('/EditPartner');
  }

  render() {
    const { ListOfPartners } = this.state;
    return (
      <Fragment>
        <Button
          style={{ marginTop: '10px', marginBottom: '10px' }}
          type="submit"
          variant="contained"
          color="primary"
          onClick={this.AddPartnerHandler}
        >
          Add Partner
        </Button>
        <PartnersPagination data={ListOfPartners} />
      </Fragment>
    );
  }
}


export default Partners;
