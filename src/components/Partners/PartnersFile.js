/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import axios from 'axios';
import { Button, Grid } from '@material-ui/core';
import PartnersPaginationPriority from './PartnerPagination';
import AddPartner from './AddPartner';
import EditPartner from './EditPartner';
// import this.props.TableData from './this.props.TableData';
import HeaderBar from '../HeaderBar';
// import Uidata from '../Students/Uidata';
class Partners extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.Uidata[0].initialValues };
  }

  async componentDidMount() {
    // const { params } = this.props.match;
    // if (params.id) {
    //   const resp = await axios.get(`http://join.navgurukul.org/api/${this.props.Uidata[0].name}/${params.id}`);
    //   const EachRowData = resp.data.data;
    //   const query = this.useQuery();
    //   const page = query.get('page');
    //   this.EditPartnerHandler({ EachRowData, page });
    // }
    const response = await axios.get( this.props.Uidata[0].name === 'students' ? 'http://join.navgurukul.org/api/students?dataType=softwareCourse' : 'http://join.navgurukul.org/api/partners' );
    console.log(response.data.data.length, 'response');
    this.setState({
      ListOfData: response.data.data,
    });
  }

  // useQuery = () => {
  //   return new URLSearchParams(this.props.location.search);
  // }

  AddPartnerHandler = () => {
    this.props.history.push(`/${this.props.Uidata[0].name}/add`);
    this.setState({ isAddRow: !this.state.isAddRow }, () => {
      if (this.state.isAddRow) {
        this.setState({
          isEditRow: false,
          screenSize: window.screen.width,
        });
        this.props.history.push(`/${this.props.Uidata[0].name}/add`);
      } else {
        this.props.history.push(`/${this.props.Uidata[0].name}`);
      }
    });
  }

  EditPartnerHandler = ({ EachRowData, page, screenSize }) => {
    this.props.history.push(`/${this.props.Uidata[0].name}/${EachRowData.id}?page=${page}`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
      EditableTableRowValues: EachRowData,
      ShowingPage: page,
      screenSize,
    });
    localStorage.setItem('page', page);
  }

  EditPartnerHandlerFrom = (e) => {
    this.props.history.push(`/${this.props.Uidata[0].name}/${e.id}`);
    this.setState({ isEditRow: !this.state.isEditRow });
  };

  EditCloseByButton = () => {
    this.props.history.push(`/${this.props.Uidata[0].name}/`);
    this.setState({
      isEditRow: !this.state.isEditRow,
      StylingForRow: !this.state.StylingForRow,
    });
  }


  render() {
    console.log(this.props, 'props');
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
                <Grid item xs={12} style={{ marginTop: '20px' }}><AddPartner onClick={this.AddPartnerHandler} name={this.props.Uidata[0].name} /></Grid>
              </Fragment>
            )
              : (
                <Fragment>
                  <Grid container xs={9}>
                    <Grid item xs={12}><HeaderBar /></Grid>
                    <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddRow={isAddRow} TableData={this.props.TableData} NameLIst={this.props.Uidata[0].name} /></Grid>
                  </Grid>
                  <Grid item xs={3}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
                </Fragment>
              )
            ) : isEditRow
              ? (screenSize < 850 ? (
                <Fragment>
                  <HeaderBar />
                  <Grid item xs={12} style={{ marginTop: '20px' }}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
                </Fragment>
              )
                : (
                  <Fragment>
                    <Grid container xs={9}>
                      <Grid item xs={12}><HeaderBar /></Grid>
                      <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditableTableRowValues} isEditRow={isEditRow} TableData={this.props.TableData} NameLIst={this.props.Uidata[0].name} /></Grid>
                    </Grid>
                    <Grid item xs={3}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
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
                    onClick={this.AddPartnerHandler}
                  >
                    Add Partner
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

/* eslint-disable no-nested-ternary */
// import React, { Fragment } from 'react';
// import axios from 'axios';
// import { Button, Grid } from '@material-ui/core';
// import PartnersPaginationPriority from './PartnerPagination';
// import AddPartner from './AddPartner';
// import EditPartner from './EditPartner';
// import this.props.TableData from './this.props.TableData';
// import HeaderBar from '../HeaderBar';
// import Uidata from './Uidata';

// class Partners extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       ListOfData: [],
//       isAddRow: false,
//       isEditRow: false,
//       EditableTableRowValues: {},
//       ShowingPage: 0,
//       StylingForRow: false,
//       screenSize: null,
//     };
//   }

//   async componentDidMount() {
//     const { params } = this.props.match;
//     if (params.id) {
//       const resp = await axios.get(`http://join.navgurukul.org/api/partners/${params.id}`);
//       const EachRowData = resp.data.data;
//       const query = this.useQuery();
//       const page = query.get('page');
//       this.EditPartnerHandler({ EachRowData, page });
//     }
//     const response = await axios.get('http://join.navgurukul.org/api/partners');
//     this.setState({
//       ListOfData: response.data.data,
//     });
//   }

//   useQuery = () => {
//     return new URLSearchParams(this.props.location.search);
//   }

//   AddPartnerHandler = () => {
//     this.props.history.push('/partners/add');
//     this.setState({ isAddRow: !this.state.isAddRow }, () => {
//       if (this.state.isAddRow) {
//         this.setState({
//           isEditRow: false,
//           screenSize: window.screen.width,
//         });
//         this.props.history.push('/partners/add');
//       } else {
//         this.props.history.push('/partners');
//       }
//     });
//   }

//   EditPartnerHandler = ({ EachRowData, page, screenSize }) => {
//     this.props.history.push(`/partners/${EachRowData.id}?page=${page}`);
//     this.setState({
//       isEditRow: !this.state.isEditRow,
//       StylingForRow: !this.state.StylingForRow,
//       EditableTableRowValues: EachRowData,
//       ShowingPage: page,
//       screenSize,
//     });
//     localStorage.setItem('page', page);
//   }

//   EditPartnerHandlerFrom = (e) => {
//     this.props.history.push(`/partners/${e.id}`);
//     this.setState({ isEditRow: !this.state.isEditRow });
//   };

//   EditCloseByButton = () => {
//     this.props.history.push('/partners/');
//     this.setState({
//       isEditRow: !this.state.isEditRow,
//       StylingForRow: !this.state.StylingForRow,
//     });
//   }


//   render() {
//     console.log(Uidata, 'ui data');
//     const {
//       ListOfData, isAddRow, isEditRow, EditableTableRowValues, ShowingPage, StylingForRow, screenSize,
//     } = this.state;
//     return (
//       <Fragment>
//         <Grid container spacing={0}>
//           {isAddRow
//             ? (screenSize < 850 ? (
//               <Fragment>
//                 <HeaderBar />
//                 <Grid item xs={12} style={{ marginTop: '20px' }}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
//               </Fragment>
//             )
//               : (
//                 <Fragment>
//                   <Grid container xs={9}>
//                     <Grid item xs={12}><HeaderBar /></Grid>
//                     <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} isAddRow={isAddRow} this.props.TableData={this.props.TableData} NameLIst="Partners" /></Grid>
//                   </Grid>
//                   <Grid item xs={3}><AddPartner onClick={this.AddPartnerHandler} /></Grid>
//                 </Fragment>
//               )
//             ) : isEditRow
//               ? (screenSize < 850 ? (
//                 <Fragment>
//                   <HeaderBar />
//                   <Grid item xs={12} style={{ marginTop: '20px' }}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
//                 </Fragment>
//               )
//                 : (
//                   <Fragment>
//                     <Grid container xs={9}>
//                       <Grid item xs={12}><HeaderBar /></Grid>
//                       <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={ShowingPage} StylingForRow={StylingForRow} EditedData={EditableTableRowValues} isEditRow={isEditRow} this.props.TableData={this.props.TableData} NameLIst="Partners" /></Grid>
//                     </Grid>
//                     <Grid item xs={3}><EditPartner data={EditableTableRowValues} onClick={this.EditPartnerHandlerFrom} onClickCLose={this.EditCloseByButton} /></Grid>
//                   </Fragment>
//                 )
//               ) : (
//                 <Fragment>
//                   <HeaderBar />
//                   <Button
//                     style={{ margin: 10 }}
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     onClick={this.AddPartnerHandler}
//                   >
//                     Add Partner
//                   </Button>
//                   <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={this.EditPartnerHandler} PageShowing={0} this.props.TableData={this.props.TableData} NameLIst="Partners" /></Grid>
//                 </Fragment>
//               )
//       }
//         </Grid>
//       </Fragment>
//     );
//   }
// }


// export default Partners;
