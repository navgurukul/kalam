import React from "react";
import {
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { deepOrange } from "@mui/material/colors";
// import pencil from "../../assets/img/pencil.png";
import EditIcon from "@mui/icons-material/Edit";
import AddOrUpdateContact from "./AddOrUpdateContact";

import { contactType } from "../../utils/constants";
import { toTitleCase } from "../../utils";

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

const StudentContact = ({
  closeTransition,
  contacts,
  studentId,
  studentName,
}) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialog2Open, setDialog2Open] = React.useState(false);

  const handleOpen = () => setDialogOpen(true);

  const handleClose = () => setDialogOpen(false);

  const dialog2HandleOpen = () => setDialog2Open(true);

  const dialog2HandleClose = () => setDialog2Open(false);

  const allClose = () => {
    dialog2HandleClose();
    handleClose();
    closeTransition();
  };

  return (
    <>
      {/* <Typography variant="h6" id="modal-title">
          Edit Student Contact
        </Typography> */}
      <Tooltip title="Edit Student Contact">
        <IconButton color="primary" size="small" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Contacts for {studentName}</DialogTitle>
        <DialogContent>
          <List>
            {contacts.map((item) => (
              <ListItem key={item.mobile}>
                <ListItemText
                  primary={`${toTitleCase(item.contact_type)}`}
                  secondary={item.mobile}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={dialog2HandleOpen}
          >
            Edit Number
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialog2Open} onClose={dialog2HandleClose}>
        <Grid
          container
          direction="column"
          justify="space-between"
          className={classes.dialogContainer}
        >
          <DialogTitle>Add Or Update Contact Number!</DialogTitle>
          {/* eslint-disable-next-line camelcase */}
          {contactType.map((type) => (
            <React.Fragment key={type}>
              <DialogContent>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                >
                  <AddOrUpdateContact
                    contactType={type}
                    mobile={
                      contacts.find((contact) => contact.contact_type === type)
                        ?.mobile || null
                    }
                    handleClose={allClose}
                    studentId={studentId}
                  />
                </Grid>
              </DialogContent>
            </React.Fragment>
          ))}
          <DialogActions>
            <Button
              variant="outlined"
              color="primary"
              onClick={dialog2HandleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </Grid>
      </Dialog>
    </>
  );
};

export default StudentContact;
