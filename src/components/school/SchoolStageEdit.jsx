import React, { Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import DialogContent from "@mui/material/DialogContent";
import {
    Button,
    DialogActions,
    Select as MUISelect,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
  } from "@mui/material";
import { useState } from "react";
import axios from "axios";

  const baseUrl = import.meta.env.VITE_API_URL;

const EditStage = (props) => {
const {value,setRefresh} = props
  const { privileges } = useSelector((state) => state.auth);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [inputData, setInputData] = useState("");
  const [stageName, setStageName] = useState("")
  

  const handleClose = () => setDialogOpen(false);
  const handleOpen = () => setDialogOpen(true);

  const handleEdit = async()=>{
    if(stageName || inputData){
    let stageData = {}
        if (stageName){
            stageData.stageName = stageName
        }
        if (inputData ){
            stageData.stageType = inputData
        }
    
    const url = `${baseUrl}stage/update/${value}`;
    let data = await axios.put(url,stageData);
    setRefresh(true);
}
  }
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

        <section style={{ padding: "0rem 1rem 1rem 1rem" }}>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "24px" }}>Edit Admission Stage</p>
            </div>
            <FormControl>
              <FormLabel>Stage Type</FormLabel>
              <RadioGroup
                row
                onChange={(e) => {
                    setInputData( e.target.value );
                  }}
              >
                <FormControlLabel
                  value="Test"
                  control={<Radio />}
                  label="Test"
                />
                <FormControlLabel
                  value="Interview"
                  control={<Radio />}
                  label="Interview"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              style={{ marginTop: "1rem" }}
              fullWidth
              autoFocus
              label="Stage Name"
              placeholder="Enter Stage"
              variant="outlined"
              sx={{ mt: "0.4rem" }}
              value={stageName}
                onChange={(e) => {
                    setStageName(( e.target.value))
              }} 

            />

          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ width: "94%", padding: ".5rem" }}  
 
              onClick={handleEdit}
            >
              Add Admission Stage
            </Button>
          </DialogActions>
        </section>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditStage;
