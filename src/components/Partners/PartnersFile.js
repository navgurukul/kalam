/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid, Container } from '@material-ui/core';
import PartnersPaginationPriority from './PartnerPagination';
import AddPartner from './AddPartner';
import EditPartner from './EditPartner';

class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListOfPartners: [],
      isAddPartner: false,
      isEditPartner: false,
      EditPartnerValues: {},
      ShowingPage: 0,
      StylingForRow: false,
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
    this.setState({ isAddPartner: !this.state.isAddPartner });
  }

  EditPartnerHandler = ({ e, page }) => {
    console.log(page, 'pageeee');
    this.setState({
      isEditPartner: !this.state.isEditPartner,
      StylingForRow: !this.state.StylingForRow,
      EditPartnerValues: e,
      ShowingPage: page,
    });
  }

  EditPartnerHandlerFrom = () => {
    this.setState({ isEditPartner: !this.state.isEditPartner });
  };

  EditCloseByButton = () => {
    this.setState({ 
      isEditPartner: !this.state.isEditPartner,
      StylingForRow: !this.state.StylingForRow, 
    });
  }


  render() {
    const {
      ListOfPartners, isAddPartner, isEditPartner, EditPartnerValues, ShowingPage, StylingForRow,
    } = this.state;
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
        <Grid container spacing={2}>
          {isAddPartner ? (
            <Fragment>
              <Grid item xs={9}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddPartner={isAddPartner} /></Container></Grid>
              <Grid item xs={3}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
            </Fragment>
          ) : isEditPartner
            ? (
              <Fragment>
                <Grid item xs={9}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditPartnerValues} isEditPartner={isEditPartner} /></Container></Grid>
                <Grid item xs={3}><EditPartner data={EditPartnerValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
              </Fragment>
            )
            : <Grid item xs={12}><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={0} /></Grid>

        }
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
