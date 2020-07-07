import React, { PureComponent } from 'react';
import {
  Container, Paper, Grid, Button, Typography,
} from '@material-ui/core';
// import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';

class ShowStudenData extends PureComponent {
  render() {
    // console.log(this.props.data.name, 'iam studentDetails.js');
    const EachRowData = this.props.data;
    return (
      <Container maxWidth="sm" component={Paper} style={{ textAlign: 'center' }} disableGutters>
        <Grid container xs={12}>
          <h1>Students Details</h1>
          <Typography variant="h6" gutterBottom>
            Student Name :
            { EachRowData.name }
          </Typography>
          <Typography variant="h6" gutterBottom>
            Mobile Number :
            { EachRowData.contacts[0].mobile}
          </Typography>
          <Button style={{ background: 'silver' }} onClick={this.props.handleClose}>close</Button>
        </Grid>
      </Container>
    );
  }
}

export default ShowStudenData;
