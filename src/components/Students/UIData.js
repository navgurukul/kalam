/* eslint-disable no-nested-ternary */
import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
import MainUiFile from '../ReUsableComponents/MainUiFile';
import PartnersPaginationPriority from '../ReUsableComponents/PartnerPagination';
import TableData from './TableData';
import AddStudent from './AddStudent';
import HeaderBar from '../HeaderBar';
import EditStudent from './EditStudent';

export class UIData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ListOfData: [],
      isAddRow: false,
      isEditRow: false,
      EditableTableRowValues: {},
      ShowingPage: 0,
      StylingForRow: false,
      screenSize: null,
      name: 'Students',
    };
  }

  async componentDidMount() {
    const { params } = this.props.match;
    if (params.id) {
      const resp = await axios.get(`http://join.navgurukul.org/api/partners/${params.id}`);
      const EachRowData = resp.data.data;
      const query = this.useQuery();
      const page = query.get('page');
      this.EditRowHandler({ EachRowData, page });
    }
    const response = await axios.get('http://join.navgurukul.org/api/students?dataType=softwareCourse');
    // console.log(response.data.data.length, 'response');
    this.setState({
      ListOfData: response.data.data,
    });
  }

  useQuery = () => {
    return new URLSearchParams(this.props.location.search);
  }

    AddRowHandler = () => {
      this.props.history.push('/Students/add');
      console.log(this.state.isAddRow, 'isAdd row befor setState');
      this.setState({ isAddRow: true }, () => {
        if (this.state.isAddRow) {
          console.log(this.state.isAddRow, 'inside if row befor setState');
          this.setState({
            isEditRow: false,
            screenSize: window.screen.width,
          });
          // this.props.history.push('partners/add');
        } else {
          this.props.history.push('Students');
        }
      });
      console.log(this.state.isAddRow, 'isAdd row after setState');
    }

  EditRowHandler = ({ EachRowData, page, screenSize }) => {
    console.log(EachRowData, 'naya');
    this.props.history.push(`/Students/${EachRowData.id}?page=${page}`);
    this.setState({
      isEditRow: true,
      StylingForRow: true,
      EditableTableRowValues: EachRowData,
      ShowingPage: page,
      // isDialogOpen: !this.state.isDialogOpen,
      screenSize,
    });
    localStorage.setItem('page', page);
  }

  LeftPlane = ({ ListOfData, isEditRow, isAddRow }) => {
    console.log(ListOfData, 'left');
    return (
      <Fragment>
        <Grid item xs={12}><HeaderBar /></Grid>
        <Grid item xs={12} style={{ padding: 10 }}>
          {isEditRow
            ? <PartnersPaginationPriority data={ListOfData} onClick={this.EditRowHandler} PageShowing={this.state.ShowingPage} StylingForRow={this.state.StylingForRow} EditedData={this.state.EditableTableRowValues} isEditRow={this.state.isEditRow} TableData={TableData} NameLIst={this.state.name} />
            : <PartnersPaginationPriority data={ListOfData} onClick={this.AddRowHandler} PageShowing={this.state.ShowingPage} StylingForRow={this.state.StylingForRow} isAddRow={this.state.isAddRow} TableData={TableData} NameLIst={this.state.name} />
          }
        </Grid>
      </Fragment>
    );
  }

  RightPlane = ({ isEditRow, isAddRow }) => {
    // console.log(onClick, 'right');
    return (
      <Fragment>
        <Grid item xs={12}>
          {this.state.isAddRow
            ? <AddStudent handleClose={this.addHandleClose} />
            : this.state.isEditRow ? <EditStudent data={this.state.EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} />
              : null
        }
        </Grid>
      </Fragment>
    );
  }

  addHandleClose = () => {
    this.props.history.push('/Students');
    this.setState({
      // isDialogOpen: false,
      isAddRow: false,
    });
  }

  // EditPartnerHandlerFrom = (e) => {
  //   this.props.history.push(`/${this.props.Uidata[0].name}/${e.id}`);
  //   this.setState({ isEditRow: true });
  // };


  EditCloseByButton = () => {
    this.props.history.push('/Students');
    this.setState({
      isEditRow: false,
      StylingForRow: false,
    });
  }

  render() {
    console.log(this.props, 'history');
    return (
      <MainUiFile AddRowHandler={this.AddRowHandler} EditRowHandler={this.EditRowHandler} addHandleClose={this.addHandleClose} ListOfData={this.state.ListOfData} TableData={TableData} LeftPlane={this.LeftPlane} RightPlane={this.RightPlane} isAddRow={this.state.isAddRow} isEditRow={this.state.isEditRow} screenSize={this.state.screenSize} StylingForRow={this.state.StylingForRow} EditableTableRowValues={this.state.EditableTableRowValues} ShowingPage={this.state.ShowingPage} />
    );
  }
}

export default UIData;
