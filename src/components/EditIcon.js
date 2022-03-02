import React, { Fragment } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { Dialog } from "@material-ui/core";
import AddPartner from "./AddPartner";
import DialogContent from "@material-ui/core/DialogContent";

const EditPartnerDetails = (props) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

  const { value } = props;
  return (
    <Fragment>
      <EditIcon onClick={handleOpen} style={{ cursor: "pointer" }} />
      <Dialog scroll="paper" open={dialogOpen} onClose={handleClose}>
        <DialogContent dividers={true}>
          <AddPartner value={value} />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default EditPartnerDetails;
