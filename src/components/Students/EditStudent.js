import React, { PureComponent } from 'react';
import {
  Container, Paper, Grid, Button, Typography,
} from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import FormBuilder from '../ReUsableComponents/PartnersFormBuilder';
import FormData from './StudentsData';

class ShowStudenData extends PureComponent {
  // onClick = async ({ values, id }) => {
  //   const response = await axios.put(`http://join.navgurukul.org/api/partners/${id}`, values);
  //   this.props.onClick();
  // }
  render() {
    // console.log(this.props.data.name, 'iam studentDetails.js');
    const EachRowData = this.props.data;
    return (
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }} disableGutters>
        <Grid container xs={12}>
          <Grid item xs={8} style={{ align: 'left' }}><h1 style={{ textAlign: 'right', marginTop: 100 }}>Edit Student</h1></Grid>
          <Grid style={{ marginTop: 112, textAlign: 'center' }} item xs={4}><CancelPresentationIcon onClick={this.props.onClickCLose} style={{ cursor: 'pointer' }}>Back</CancelPresentationIcon></Grid>
          <FormBuilder
            list={FormData}
            onClick={this.onClick}
            name={EachRowData.name}
            id={EachRowData.id}
            mobile={EachRowData.contacts[0].mobile}
            stage={EachRowData.stage}
            partnerName={EachRowData.partnerName}
          />
        </Grid>
      </Container>
    );
  }
}

export default ShowStudenData;
