/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid, Container } from '@material-ui/core';
import PartnersPaginationPriority from './PartnerPagination';
import AddPartner from './AddPartner';
import EditPartner from './EditPartner';
import TableData from './TableData';


class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListOfPartners: [],
      isAddRow: false,
      isEditRow: false,
      EditableTableRowValues: {},
      ShowingPage: 0,
      StylingForRow: false,
      screenSize: null,
    };
  }


  async componentDidMount() {
    if (window.location.search) {
      this.setState({ isEditRow: true });
      const { localStorage } = window;
      const EachRowData = JSON.parse(localStorage.data);
      const { page } = localStorage;
      this.EditPartnerHandler({ EachRowData, page });
    }
    const response = await axios.get('http://join.navgurukul.org/api/partners');
    this.setState({
      ListOfPartners: response.data.data,
    });
  }

  AddPartnerHandler = () => {
    this.setState({ isAddRow: !this.state.isAddRow }, () => {
      this.setState({
        isEditRow: false,
        screenSize: window.screen.width,
      });
    });
  }

  EditPartnerHandler = ({ EachRowData, page, screenSize }) => {
    console.log(EachRowData, 'event');
    console.log(page, 'page');
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
      EditableTableRowValues: EachRowData,
      ShowingPage: page,
      screenSize,
    });
  }

  EditPartnerHandlerFrom = (e) => {
    this.setState({ isEditRow: !this.state.isEditRow });
  };

  EditCloseByButton = () => {
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
    });
  }


  render() {
    console.log(this.props, 'props');
    const {
      ListOfPartners, isAddRow, isEditRow, EditableTableRowValues, ShowingPage, StylingForRow, screenSize,
    } = this.state;
    return (
      <Fragment>
        <Grid container spacing={2}>
          {isAddRow
            ? (screenSize < 850 ? <Grid item xs={12} style={{ marginTop: '20px' }}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
              : (
                <Fragment>
                  <Grid item xs={9} style={{ marginTop: '20px' }}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddRow={isAddRow} TableData={TableData} NameLIst="Partners" /></Container></Grid>
                  <Grid item xs={3} style={{ marginTop: '20px' }}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
                </Fragment>
              )
            ) : isEditRow
              ? (screenSize < 850 ? (
                <Grid item xs={12} style={{ marginTop: '20px' }}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
              )
                : (
                  <Fragment>
                    <Grid item xs={9} style={{ marginTop: '20px' }}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditableTableRowValues} isEditRow={isEditRow} TableData={TableData} NameLIst="Partners" /></Container></Grid>
                    <Grid item xs={3} style={{ marginTop: '20px' }}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
                  </Fragment>
                )
              ) : (
                <Fragment>
                  <Button
                    style={{ marginTop: '20px', marginBottom: '10px' }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={this.AddPartnerHandler}
                  >
                    Add Partner
                  </Button>
                  <Grid item xs={12}><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={0} TableData={TableData} NameLIst="Partners" /></Grid>
                </Fragment>
              )
      }
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
