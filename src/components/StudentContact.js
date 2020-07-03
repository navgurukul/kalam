import React, { Component } from "react";
import Typography from '@material-ui/core/Typography'
import { Button, Grid } from "@material-ui/core";
import { Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import pencil from '../assets/img/pencil.png'
import { deepOrange } from '@material-ui/core/colors';
import { contact_type } from '../config/index';
import { withSnackbar } from 'notistack';
import AddOrUpdateContact from './AddOrUpdateContact';

const styles = theme => ({
  dialogContainer: {
    padding: 10
  },
  button: {
    margin: 10
  },
  orange: {
    backgroundColor: deepOrange[500],
    cursor: 'pointer'
  },
})

class StudentContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      dialogOpen: false,
      dialogOpen2: false,
      updateOrAddType: '',
      contact_type: '',
    }
  }
  
  handelChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };

  handleOpen = () => {
    this.setState({
      dialogOpen: true
    })
  }
  
  handleClose = () => {
    this.setState({
      dialogOpen: false
    })
  }

  dialog2HandelClose = () => {
    this.setState({
      dialogOpen2: false,
    })
  }
  
  allClose = () => {
    const { closeTransition } = this.props;
    this.setState({
      dialogOpen2: false,
      dialogOpen: false
    });
    closeTransition()
  }
  
  dialog2HandelOpen = () => {
    this.setState({
      dialogOpen2: true
    })
  }

  render() {
    const {contacts, classes, studentId} = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        > 
          <Grid container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
          </Grid>
            <Typography variant="h6" id="modal-title">Edit Student Contact Number</Typography>
            <Avatar alt="Remy Sharp" src={pencil} onClick={this.handleOpen} className={classes.orange}/>
        </Grid>
        <Dialog
            open={this.state.dialogOpen}
            onClose={this.handleClose}
          >
            <Grid container
              direction="column"
              justify="space-between"
              className={classes.dialogContainer}
            >
              <DialogActions>
                <Button variant="contained" color="primary" value="add" onClick={this.dialog2HandelOpen}>Edit Number</Button>
              </DialogActions>
              <DialogContent>
                <List>
                  {contacts.map((item) => <ListItem>
                    <ListItemText primary={`(${item.contact_type.toUpperCase()}): ${item.mobile}`} />
                  </ListItem>)}
                </List>
              </DialogContent>
            </Grid>
          </Dialog>
          <Dialog
            open={this.state.dialogOpen2}
            onClose={this.dialog2HandelClose}
          >
              <Grid container
                direction="column"
                justify="space-between"
                className={classes.dialogContainer}
              > 
                <DialogTitle>Add Or Update Contact Number!</DialogTitle>
                {contact_type.map((type, index) =>
                  <React.Fragment>
                    <DialogContent>
                      <Grid container direction="row" justify="space-between" alignItems="center">
                        <TextField
                          name="mobile"
                          variant="outlined"
                          onChange={this.handelChange}
                          defaultValue={contacts.filter(contact => contact.contact_type == type).length > 0
                            ? contacts.filter(contact => contact.contact_type == type)[0].mobile: null }
                          label={type.toUpperCase()}
                        />
                        <AddOrUpdateContact
                          contact_type={type}
                          mobile={this.state.mobile}
                          handleClose={this.allClose}
                          studentId={studentId}
                        />
                      </Grid>
                    </DialogContent>
                  </React.Fragment>
                )}
                <DialogActions>
                  <Button variant="contained" color="primary" onClick={this.dialog2HandelClose}>cancel</Button>
                </DialogActions>
              </Grid>
          </Dialog>
      </div>
    )
  }
}

export default withSnackbar(withStyles(styles)(StudentContact));