import React from "react";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { deepOrange } from "@mui/material/colors";
import pencil from "../assets/img/pencil.png";
import AddOrUpdateContact from "./AddOrUpdateContact";

// eslint-disable-next-line camelcase
const { contact_type } = require("../config");

const useStyles = makeStyles(() => ({
  dialogContainer: {
    padding: 10,
  },
  button: {
    margin: 10,
  },
  orange: {
    backgroundColor: deepOrange[500],
    cursor: "pointer",
  },
}));

const StudentContact = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    mobile: "",
    dialogOpen: false,
    dialogOpen2: false,
    updateOrAddType: "",
    contact_type: "",
  });
  const handelChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      dialogOpen: true,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const dialog2HandelClose = () => {
    setState({
      ...state,
      dialogOpen2: false,
    });
  };

  const allClose = () => {
    const { closeTransition } = props;
    setState({
      ...state,
      dialogOpen2: false,
      dialogOpen: false,
    });
    closeTransition();
  };

  const dialog2HandelOpen = () => {
    setState({
      ...state,
      dialogOpen2: true,
    });
  };
  const { contacts, studentId } = props;

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Typography variant="h6" id="modal-title">
          Edit Student Contact Number
        </Typography>
        <Avatar
          alt="Remy Sharp"
          src={pencil}
          onClick={handleOpen}
          className={classes.orange}
        />
      </Grid>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <Grid
          container
          direction="column"
          justify="space-between"
          className={classes.dialogContainer}
        >
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              value="add"
              onClick={dialog2HandelOpen}
            >
              Edit Number
            </Button>
          </DialogActions>
          <DialogContent>
            <List>
              {contacts.map((item) => (
                <ListItem key={item.mobile}>
                  <ListItemText
                    primary={`(${item.contact_type.toUpperCase()}): ${
                      item.mobile
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Grid>
      </Dialog>
      <Dialog open={state.dialogOpen2} onClose={dialog2HandelClose}>
        <Grid
          container
          direction="column"
          justify="space-between"
          className={classes.dialogContainer}
        >
          <DialogTitle>Add Or Update Contact Number!</DialogTitle>
          {/* eslint-disable-next-line camelcase */}
          {contact_type.map((type) => (
            <React.Fragment key={type}>
              <DialogContent>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <TextField
                    name="mobile"
                    variant="outlined"
                    onChange={handelChange}
                    defaultValue={
                      contacts.filter(
                        (contact) => contact.contact_type === type
                      ).length > 0
                        ? contacts.filter(
                            (contact) => contact.contact_type === type
                          )[0].mobile
                        : null
                    }
                    label={type.toUpperCase()}
                  />
                  <AddOrUpdateContact
                    contact_type={type}
                    mobile={state.mobile}
                    handleClose={allClose}
                    studentId={studentId}
                  />
                </Grid>
              </DialogContent>
            </React.Fragment>
          ))}
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={dialog2HandelClose}
            >
              cancel
            </Button>
          </DialogActions>
        </Grid>
      </Dialog>
    </div>
  );
};

export default StudentContact;
