import React, { Component } from 'react'
import { Button } from "@material-ui/core";
import DialogActions from '@material-ui/core/DialogActions';
import axios from "axios";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { permissions } from '../config/index';

const baseUrl = process.env.API_URL;

class AddOrUpdateContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateOrAddType: ''
    }
  }

  addOrUpdateMobile = async (event) => {
    const { contact_type, mobile, studentId, handleClose, loggedInUser } = this.props;
    const type = event.target.innerText;

    await this.setState({
      updateOrAddType: type == "ADD" ? "addContact" : "updateContact"
    });
    
    const { updateOrAddType } = this.state;
    if (permissions.addOrUpdateContact.indexOf(loggedInUser.mail_id) >= 0) {
      try {
        if (mobile) {
          axios.post(`${baseUrl}students/contactUpdateAdd/${studentId}`, {
            mobile: mobile,
            contact_type: contact_type,
            updateOrAddType: updateOrAddType
          })
            .then(() => {
              handleClose()
              this.props.enqueueSnackbar('Contact is successfully Added/Updated!', { variant: 'success' });
            }).catch(() => {
              this.props.enqueueSnackbar("Mobile number should be 10 digit!", { variant: 'error' });
            })
        } else {
          this.props.enqueueSnackbar("New mobile number is required!", { variant: 'error' });
        }
      } catch (e) {
        console.log(e)
        this.props.enqueueSnackbar("Something went wrong in server", { variant: 'error' });
      }
    } else {
      handleClose()
      this.props.enqueueSnackbar("You are not Authenticated user to Add/Update contact!", { variant: 'error' });
    }
  }

  render() {
    return (
      <DialogActions>
        <Button variant="contained" color="primary" onClick={this.addOrUpdateMobile}>Update</Button>
        <Button variant="contained" color="primary" onClick={this.addOrUpdateMobile}>Add</Button>
      </DialogActions>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser,
});

export default withSnackbar(connect(mapStateToProps, undefined)(AddOrUpdateContact));