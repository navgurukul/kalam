import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    marginRight: "50px",
  },
}));

const EmailSentFailed = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Offer letter was not sent.."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click here to resend the offer letter from our service.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.root}>
          <Button
            variant="contained"
            onClick={handleClose}
            color="primary"
            href="https://connect.merakilearn.org/admission"
            target="_blank"
          >
            Go to Offer Letter sending service
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmailSentFailed;
