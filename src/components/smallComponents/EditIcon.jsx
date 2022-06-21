import React, { Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import DialogContent from "@mui/material/DialogContent";
import AddPartner from "../partner/AddPartner";

const EditPartnerDetails = (props) => {
  const { privileges } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

  const { value } = props;
  return (
    <>
      <IconButton
        disabled={
          !privileges.some((priv) => priv.privilege === "UpdatePartner")
        }
        onClick={handleOpen}
      >
        <EditIcon />
      </IconButton>

      <Dialog scroll="paper" open={dialogOpen} onClose={handleClose}>
        <DialogContent dividers>
          <AddPartner partnerId={value} closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPartnerDetails;
