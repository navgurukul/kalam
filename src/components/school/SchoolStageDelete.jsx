import React, { Fragment } from "react";
// import EditIcon from "@mui/icons-material/Edit";
import { Alert, Dialog, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import DialogContent from "@mui/material/DialogContent";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const SchoolStageDelete = (props) => {
const {value,setRefresh} = props;
const { privileges } = useSelector((state) => state.auth);
const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

    const HandleDelete=  async()=>{
      const url = `${baseUrl}stage/${value}`;
      let data = await axios.delete(url);
      setRefresh(true)
      handleClose();
    }

  return (
    <>
      <IconButton
        disabled={
          !privileges.some((priv) => priv.privilege === "UpdatePartner")
        }
        onClick={handleOpen}
      >
        <DeleteIcon />
      </IconButton>

      <Dialog scroll="paper" open={dialogOpen} onClose={handleClose}>
        <DialogContent>
          <Alert> Are you sure you want to delete this Stage?</Alert>
          <div
          style={{display:"flex",
          justifyContent: "space-evenly",
          marginTop:"1rem"
        }}
          >
          <Button variant="contained" disableElevation
          onClick={HandleDelete}
          >
            Yes
          </Button>
          <Button variant="contained" disableElevation
          onClick={handleClose}
          >
            NO
          </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolStageDelete;
