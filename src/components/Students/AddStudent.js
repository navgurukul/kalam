import React, { PureComponent } from 'react';
import {
  Container, Paper, Grid, Button, Typography,
} from '@material-ui/core';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import FormBuilder from '../ReUsableComponents/PartnersFormBuilder';
import FormData from './StudentsData';

class ShowStudenData extends PureComponent {
  render() {
    // console.log(this.props.data.name, 'iam studentDetails.js');
    const EachRowData = this.props.data;
    return (
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center', height: 600 }} disableGutters>
        <Grid container xs={12}>
          <Grid item xs={8} style={{ align: 'left' }}><h1 style={{ textAlign: 'right' }}>Add Student</h1></Grid>
          <Grid style={{ marginTop: 28, textAlign: 'center' }} item xs={4}><CancelPresentationIcon onClick={this.props.handleClose} style={{ cursor: 'pointer' }}>Back</CancelPresentationIcon></Grid>
          <FormBuilder
            list={FormData}
            onClick={this.onClick}
          />
        </Grid>
      </Container>
    );
  }
}

export default ShowStudenData;
