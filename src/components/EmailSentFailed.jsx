import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { makeStyles } from "@mui/styles";

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
          Offer letter was not sent..
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
