/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
import PartnersPaginationPriority from './PartnerPagination';
import AddPartner from './AddPartner';
import EditPartner from './EditPartner';
import HeaderBar from '../HeaderBar';
import ShowStudentData from '../Students/ShowStudentDetails';

class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.Uidata[0].initialValues };
  }

  async componentDidMount() {
    const { params } = this.props.properties.match;
    if (params.id) {
      const resp = await axios.get(`http://join.navgurukul.org/api/${this.props.Uidata[0].name}/${params.id}`);
      const EachRowData = resp.data.data;
      const query = this.useQuery();
      const page = query.get('page');
      this.EditPartnerHandler({ EachRowData, page });
    }
    const response = await axios.get(this.props.Uidata[0].name === 'students' ? 'http://join.navgurukul.org/api/students?dataType=softwareCourse' : 'http://join.navgurukul.org/api/partners' );
    console.log(response.data.data.length, 'response');
    this.setState({
      ListOfData: response.data.data,
    });
  }

  useQuery = () => {
    return new URLSearchParams(this.props.properties.location.search);
  }

  AddPartnerHandler = () => {
    this.props.properties.history.push(`/${this.props.Uidata[0].name}/add`);
    this.setState({ isAddRow: !this.state.isAddRow }, () => {
      if (this.state.isAddRow) {
        this.setState({
          isEditRow: false,
          screenSize: window.screen.width,
        });
        this.props.properties.history.push(`/${this.props.Uidata[0].name}/add`);
      } else {
        this.props.properties.history.push(`/${this.props.Uidata[0].name}`);
      }
    });
  }

  EditPartnerHandler = ({ EachRowData, page, screenSize }) => {
    console.log(page, 'naya');
    this.props.properties.history.push(`/${this.props.Uidata[0].name}/${EachRowData.id}?page=${page}`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
      EditableTableRowValues: EachRowData,
      ShowingPage: page,
      isDialogOpen: !this.state.isDialogOpen,
      screenSize,
    });
    localStorage.setItem('page', page);
  }

  EditPartnerHandlerFrom = (e) => {
    this.props.properties.history.push(`/${this.props.Uidata[0].name}/${e.id}`);
    this.setState({ isEditRow: !this.state.isEditRow });
  };

  EditCloseByButton = () => {
    this.props.properties.history.push(`/${this.props.Uidata[0].name}/`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
    });
  }
  
  handleClose = () => {
    this.props.properties.history.push('/Students/');
    this.setState({
      isDialogOpen: !this.state.isDialogOpen,
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
    });
  }


  render() {
    console.log(this.props.properties, 'props');
    const {
      ListOfData, isAddRow, isEditRow, EditableTableRowValues, ShowingPage, StylingForRow, screenSize,
    } = this.state;
    return (
      <Fragment>
        <Grid container spacing={0}>
          {isAddRow
            ? (screenSize < 850 ? (
              <Fragment>
                <HeaderBar />
                <Grid item xs={12} style={{ marginTop: '20px' }}><AddPartner onClick={this.AddPartnerHandler} NameLIst={this.props.Uidata[0].name} /></Grid>
              </Fragment>
            )
              : (
                <Fragment>
                  <Grid container xs={9}>
                    <Grid item xs={12}><HeaderBar /></Grid>
                    <Grid item xs={12} style={{ padding: 10 }}>{ this.props.Uidata[0].name === 'students' ? <PartnersPaginationPriority data={ListOfData} PageShowing={0} TableData={this.props.TableData} onClick={this.StudentData} NameLIst="Students" /> : <PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddRow={isAddRow} TableData={this.props.TableData} NameLIst={this.props.Uidata[0].name} /> }</Grid>
                  </Grid>
                  <Grid item xs={3}>{ this.props.Uidata[0].name === 'students' && this.state.isDialogOpen ? <ShowStudentData onClick={this.StudentData} handleClose={this.handleClose} /> : <AddPartner onClick={this.AddPartnerHandler} NameLIst={this.props.Uidata[0].name} /> }</Grid>
                </Fragment>
              )
            ) : isEditRow
              ? (screenSize < 850 ? (
                <Fragment>
                  <HeaderBar />
                  <Grid item xs={12} style={{ marginTop: '20px' }}>{ this.props.Uidata[0].name === 'students' ? <ShowStudentData onClick={this.StudentData} handleClose={this.handleClose} /> : <EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} />}</Grid>
                </Fragment>
              )
                : (
                  <Fragment>
                    <Grid container xs={9}>
                      <Grid item xs={12}><HeaderBar /></Grid>
                      <Grid item xs={12} style={{ padding: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditableTableRowValues} isEditRow={isEditRow} TableData={this.props.TableData} NameLIst={this.props.Uidata[0].name} /></Grid>
                    </Grid>
                    <Grid item xs={3}>{this.props.Uidata[0].name === 'students' && this.state.isDialogOpen ? <ShowStudentData data={EditableTableRowValues} handleClose={this.handleClose} /> : <EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} />}</Grid>
                  </Fragment>
                )
              ) : (
                <Fragment>
                  <HeaderBar />
                  <Button
                    style={{ margin: 10 }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={this.props.Uidata[0].name === 'students' ? this.StudentData : this.AddPartnerHandler}
                  >
                    Add {this.props.Uidata[0].name}
                  </Button>
                  <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={0} TableData={this.props.TableData} NameLIst={this.props.Uidata[0].name} /></Grid>
                </Fragment>
              )
      }
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
