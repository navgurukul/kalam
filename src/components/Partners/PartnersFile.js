/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
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
    if (window.location.search) {
      this.setState({ isEditPartner: true });
      let localStorage = window.localStorage;
      let e = JSON.parse(localStorage.data);
      let page = localStorage.page;
      this.EditPartnerHandler({e, page});
    }
    const response = await axios.get('http://join.navgurukul.org/api/partners');
    this.setState({
      ListOfPartners: response.data.data,
    });

  }

  AddPartnerHandler = () => {
    this.props.history.push(`/partners?add=name`)
    this.setState({ isAddPartner: !this.state.isAddPartner },()=>{
      if(this.state.isAddPartner){
        this.setState({
          isEditPartner:false
        })
        this.props.history.push(`/partners?add=name`)
      }
      else{
        this.props.history.push(`/partners`)
      }
    });

  }

  EditPartnerHandler = ({ e, page }) => {
    this.props.history.push(`/partners?id=${e.id}`)
    this.setState({
      isEditPartner: !this.state.isEditPartner,
      StylingForRow: !this.state.StylingForRow,
      EditPartnerValues: e,
      ShowingPage: page,
    });
    localStorage.setItem("data", JSON.stringify(e));
    localStorage.setItem("page", page)

  }

  EditPartnerHandlerFrom = (e) => {
    history.push("/partners? name=19")
    this.setState({ isEditPartner: !this.state.isEditPartner });
  };



  render() {
    const { history } = this.props;
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
              <Grid item xs={3}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
              <Grid item xs={9}><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} /></Grid>
            </Fragment>
          ) : isEditPartner
              ? (
                <Fragment>
                  <Grid item xs={3}><EditPartner data={EditPartnerValues} onClick={this.EditPartnerHandlerFrom} /></Grid>
                  <Grid item xs={9}><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditPartnerValues} isEditPartner={isEditPartner} /></Grid>
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
