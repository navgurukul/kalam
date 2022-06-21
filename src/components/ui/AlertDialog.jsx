import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/slices/uiSlice";

const Transition = React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Grow ref={ref} {...props} />
));

const AlertDialog = () => {
  const dispatch = useDispatch();
  const { dialogOpen, dialogProps, dialogTitle, dialogContent, dialogActions } =
    useSelector((state) => state.ui);
  const handleClose = (ev, reason) => {
    if (reason === "clickaway") return;
    dispatch(closeDialog());
  };

  return (
    <Dialog
      fullWidth
      open={dialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby={dialogTitle || ""}
      aria-describedby={`Dialog for ${dialogTitle}` || ""}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(dialogProps || {})}
    >
      <DialogTitle id="title">{dialogTitle}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        {dialogActions}
        <Button color="primary" variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
