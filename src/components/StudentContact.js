import React from "react";
import Typography from "@material-ui/core/Typography";
import { Button, Grid } from "@material-ui/core";
import { Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import pencil from "../assets/img/pencil.png";
import { deepOrange } from "@material-ui/core/colors";
import { contact_type } from "../config/index";
import AddOrUpdateContact from "./AddOrUpdateContact";

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
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
        ></Grid>
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
              {contacts.map((item, index) => (
                <ListItem key={index}>
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
          {contact_type.map((type, index) => (
            <React.Fragment key={index}>
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
                      contacts.filter((contact) => contact.contact_type == type)
                        .length > 0
                        ? contacts.filter(
                            (contact) => contact.contact_type == type
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
