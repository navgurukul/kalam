/* eslint-disable no-nested-ternary */
import React, { Fragment, PureComponent } from 'react';
import { Button, Grid } from '@material-ui/core';
import PartnersPaginationPriority from './PartnerPagination';
import HeaderBar from '../HeaderBar';


class Partners extends PureComponent {
  render() {
    console.log(this.props, 'abhi');
    const {
      isAddRow, screenSize, isEditRow, ListOfData, AddRowHandler, LeftPlane, RightPlane, EditRowHandler, NameLIst,value
    } = this.props;
    console.log(value,"value");
    return (
      <Fragment>
        <Grid container spacing={0}>
          {isAddRow
            ? (screenSize < 850 ? (
              <Fragment>
                <HeaderBar />
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  {RightPlane(isAddRow)}
                </Grid>
              </Fragment>
            )
              : (
                <Fragment>
                  <Grid container xs={9}>
                    {LeftPlane({ ListOfData, isAddRow })}
                  </Grid>
                  <Grid item xs={3}>{RightPlane(isAddRow)}</Grid>
                </Fragment>
              )
            ) : isEditRow
              ? (screenSize < 850 ? (
                <Fragment>
                  <HeaderBar />
                  <Grid item xs={12} style={{ marginTop: '20px' }}>
                    {RightPlane(isEditRow)}
                  </Grid>
                </Fragment>
              )
                : (
                  <Fragment>
                    <Grid container xs={9}>
                      {LeftPlane({ ListOfData, isEditRow })}
                    </Grid>
                    <Grid item xs={3}>{RightPlane(isEditRow)}</Grid>
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
                    onClick={AddRowHandler}
                  >
                    Add
                    {' '}
                    {NameLIst}
                  </Button>
                  <Grid item xs={12} style={{ margin: 10 }}><PartnersPaginationPriority data={ListOfData} onClick={EditRowHandler} PageShowing={0} TableData={this.props.TableData} NameLIst={NameLIst} search = {value} /></Grid>
                </Fragment>
              )
      }
        </Grid>
      </Fragment>
    );
  }
}


export default Partners;
