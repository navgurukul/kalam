import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";
import ToolbarAddButtonSchoolStages from "./ToolbarAddButtonSchoolStages";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  Select as MUISelect,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import EditStage from "./SchoolStageEdit";
import SchoolStageDelete from "./SchoolStageDelete";
import { Refresh } from "@mui/icons-material";

const baseUrl = import.meta.env.VITE_API_URL;


const SchoolStages = () => {
    const [SchoolStageList, setSchoolStageList] = useState([]);
    const [loading, setLoading] = React.useState(true);
    const [schoolStageDialog, setSchoolStageDialog] = useState(false);
    const [refresh , setRefresh] = useState(false);
    const columns = [
      {
        name: "id",
        label: "S.No",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, rowMeta) => {
            const index = rowMeta.rowIndex + 1;
            return index;
          },
        },
      },
    
      {
        name: "stageType",
        label: "Type",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, rowMeta) => {
            return value;
          },
        },
      },
      {
        name: "stageName",
        label: "Stage Name",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, rowMeta) => {
            return value;
          },
        },
      },
    
      {
        name: "id",
        label: "Edit",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <EditStage setRefresh={setRefresh} value={value} />,
        },
      },
    
      {
        name: "id",
        label: "Delete",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => <SchoolStageDelete setRefresh={setRefresh} value={value} />,
        },
      },
    ];
    
const SchoolStages = () => {
  const { loggedInUser, roles } = useSelector((state) => state.auth);
  const [schoolStageList, setSchoolStageList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [inputData, setInputData] = useState("");
  const [schoolStageDialog, setSchoolStageDialog] = useState(false);

  let location = useLocation();
  let id = location.pathname.split("/")[2];

  const fetchStages = async () => {
    let url = `${baseUrl}stage/${id}`;
    let data = await axios.get(url);
    // console.log(data.data, "all data is here.....");
    setSchoolStageList(data.data);
    setLoading(true);
    setSchoolStageDialog(false);
  };

  // For post api
  const handleOpenSubmit = async () => {
    //   if (inputData.stageType && inputData.stageName){
    let id = location.pathname.split("/")[2];
    const dataURL = `${baseUrl}stage`;
    await axios.post(dataURL,inputData);
    setInputData("");
    fetchStages();
    setSchoolStageDialog(false);
// }
  };

  const openSchoolStageDialog = () => {
    setSchoolStageDialog(true);
  };


  useEffect(async () => {
    (async () => {
      await fetchStages();
      setRefresh(false);
    })();
  }, [refresh]);

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddButtonSchoolStages handleOpen={openSchoolStageDialog} />,
      []
    ),
  };

  return (
    <Container maxWidth="md">
  

      <MainLayout
        title="Admission Stage"
        columns={columns}
        data={SchoolStageList}
        showLoader={loading}
        options={options}
      />
      <Dialog
        fullWidth
        open={schoolStageDialog}
        onClose={() => setSchoolStageDialog(false)}
      >
        <section style={{ padding: "0rem 1rem 1rem 1rem" }}>
          <DialogContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "24px" }}>Admission Stage</p>
              <CloseIcon
                style={{ cursor: "pointer" }}
                onClick={() => setSchoolStageDialog(false)}
              />
            </div>
            <FormControl>
              <FormLabel>Stage Type</FormLabel>
              <RadioGroup
                row
                onChange={(e) => {
                  setInputData({ ...inputData, stageType : e.target.value ,school_id:id } );
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
              onChange={(e) => {
                setInputData({ ...inputData, stageName: e.target.value });
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
            //   onChange={(e) => {
            //     setInputData({ ...inputData, location: e.target.value });
            //   }}  
              onClick={handleOpenSubmit}
            >
              Add Admission Stage
            </Button>
          </DialogActions>
        </section>
      </Dialog>
    </Container>
  );
};
export default SchoolStages;
