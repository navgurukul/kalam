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
    };
  }


  async componentDidMount() {
    const { params } = this.props.match;
    if (params.id) {
      const resp = await axios.get(`http://join.navgurukul.org/api/partners/${params.id}`);
      const EachRowData = resp.data.data;
      const query = this.useQuery();
      const page = query.get("page")
      this.EditPartnerHandler({ EachRowData, page });
    }
    const response = await axios.get('http://join.navgurukul.org/api/partners');
    this.setState({
      ListOfPartners: response.data.data,
    });
  }
  useQuery = () =>{
    return new URLSearchParams(this.props.location.search);  
  }
  AddPartnerHandler = () => {
    this.props.history.push('/partners/add');
    this.setState({ isAddRow: !this.state.isAddRow }, () => {
      if (this.state.isAddRow) {
        this.setState({
          isEditRow: false,
        });
        this.props.history.push('/partners/add');
      } else {
        this.props.history.push('/partners');
      }
    });
  }

  EditPartnerHandler = ({ EachRowData, page }) => {
    this.props.history.push(`/partners/${EachRowData.id}?page=${page}`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
      EditableTableRowValues: EachRowData,
      ShowingPage: page,
    });
    localStorage.setItem('page', page);
  }

  EditPartnerHandlerFrom = (e) => {
    history.push(`/partners/${e.id}`);
    this.setState({ isEditRow: !this.state.isEditRow });
  };

  EditCloseByButton = () => {
    this.props.history.push(`/partners/`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
    });
  }


  render() {
    const {
      ListOfPartners, isAddRow, isEditRow, EditableTableRowValues, ShowingPage, StylingForRow,
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
          {isAddRow ? (
            <Fragment>
              <Grid item xs={9}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddRow={isAddRow} TableData={TableData} NameLIst="Partners" /></Container></Grid>
              <Grid item xs={3}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
            </Fragment>
          ) : isEditRow
              ? (
                <Fragment>
                  <Grid item xs={9}><Container><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditableTableRowValues} isEditRow={isEditRow} TableData={TableData} NameLIst="Partners" /></Container></Grid>
                  <Grid item xs={3}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
                </Fragment>
              )
              : <Grid item xs={12}><PartnersPaginationPriority data={ListOfPartners} onClick={this.EditPartnerHandler} PageShowing={0} TableData={TableData} NameLIst="Partners" /></Grid>

          }
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
