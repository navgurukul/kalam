import React, { Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import AddPartner from "../partner/AddPartner";

const EditPartnerDetails = (props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

  const { value } = props;
  return (
    <>
      <EditIcon onClick={handleOpen} style={{ cursor: "pointer" }} />
      <Dialog scroll="paper" open={dialogOpen} onClose={handleClose}>
        <DialogContent dividers>
          <AddPartner partnerId={value} closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPartnerDetails;
