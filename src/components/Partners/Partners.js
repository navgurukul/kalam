import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
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
        { ListOfPartners
          ? ListOfPartners.map((partner) => (
            <div key={partner.id} style={{ marginTop: '20px' }}>
              <Grid container>
                <Grid item xs={4}>{partner.name}</Grid>
                <Grid item xs={4}>{partner.id}</Grid>
                <Grid item xs={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      history.push('/EditPartnerDetails', partner);
                    }}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </div>
          ))
          : ''
      }
      </Fragment>
    );
  }
}


export default Partners;
