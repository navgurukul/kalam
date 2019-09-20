import React from 'react';
import { connect } from 'react-redux';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import { Button } from '@material-ui/core';

import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';

import { changeFetching } from '../store/actions/auth';

import {withRouter} from 'react-router-dom';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: 400, 
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  btn: {
    marginTop: theme.spacing(4)
  }
})

export class AddPartnerPage extends React.Component {

  async addPartner() {
    try {
      this.props.fetchingStart()
      const response = await axios.post(this.dataURL, {
        "name": this.state.name,
        "notes": this.state.notes
        }
      );
      this.props.fetchingFinish();
      this.props.history.push("/partners");
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.addPartner();    
  };

  validate = () => {};

  constructor(props) {
    super(props);
    this.dataURL = 'http://join.navgurukul.org/api/partners';

    this.state = {
      "name": "",
      "notes": ""
    }
  }

  handleChange = name => (event) => {
    let valChange = {}
    valChange[name] = event.target.value;

    this.setState(
      valChange
    );
  };

  render = () => {
    const { classes } = this.props;

    return (
      <form className={classes.container}>
        <FormControl>
          <InputLabel htmlFor="partnerName">Partner Name</InputLabel>
          <Input id="partnerName" aria-describedby="my-helper-text" name="name" value={this.state.name} onChange={this.handleChange('name')}/>
          <FormHelperText id="my-helper-text">Partner ka Name Enter karein.</FormHelperText>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="partnerNotes">Partner Notes</InputLabel>
          <Input id="partnerNotes" aria-describedby="my-helper-text" name="notes" value={this.state.notes} onChange={this.handleChange('notes')}/>
          <FormHelperText id="my-helper-text">Partner ki thodi details add karein.</FormHelperText>
        </FormControl>

        <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.btn}>Add Partner</Button>
      </form>
    );
  }
};

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(AddPartnerPage)))