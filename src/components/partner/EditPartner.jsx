import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, IconButton, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import DialogContent from "@mui/material/DialogContent";
import AddPartner from "./AddPartner";

const EditPartner = ({ value }) => {
  const { privileges } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

  const hasEditAccess = privileges.some(
    (priv) => priv.privilege === "UpdatePartner"
  );

  return (
    <>
      <IconButton disabled={!hasEditAccess} onClick={handleOpen}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <EditIcon fontSize="small" />
          <Typography variant="body2">Edit</Typography>
        </Box>
      </IconButton>
      <Dialog scroll="paper" open={dialogOpen} onClose={handleClose}>
        <DialogContent dividers>
          <AddPartner partnerId={value} closeDialog={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPartner;
