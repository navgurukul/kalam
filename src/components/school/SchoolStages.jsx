import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";
import CloseIcon from "@mui/icons-material/Close";
import ToolbarAddButtonSchoolStages from "./ToolbarAddButtonSchoolStages";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  Select as MUISelect,
  TextField,
} from "@mui/material";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const baseUrl = import.meta.env.VITE_API_URL;

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
    name: "id",
    label: "Type",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const index = rowMeta.rowIndex[0];
        return index;
      },
    },
  },
  {
    name: "name",
    label: "Stage Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
          const url = `/stage/${id}`;
        return (
          <Link to={url} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

const SchoolStages = () => {
  const { loggedInUser, roles } = useSelector((state) => state.auth);
  const [schoolStageList, setSchoolStageList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [inputData, setInputData] = useState("");
  const [schoolStageDialog, setSchoolStageDialog] = useState(false);

  const handleOpenSubmit = async () => {
    const dataURL = `${baseUrl}stage`;
    await axios.post(dataURL, { StageName});
    setInputData("");
    fetchStageSchool();
    setSchoolDialog(false);
  };
  //   console.log(dataURL,"..........")

  const openSchoolStageDialog = () => {
    setSchoolStageDialog(true);
  };

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddButtonSchoolStages handleOpen={openSchoolStageDialog} />,
      []
    ),
  };

  const fetchStageSchool = async () => {
    try {
      const adminRole = roles.findIndex(
        (roleItem) => roleItem.role === "Admin"
      );
      const role = roles.find((roleItem) => roleItem.role === "stage");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseUrl}stage`;
      const response = await axios.get(dataURL);
      console.log(response, ".................");
      setSchoolStageList(
        adminRole !== -1
          ? [...response.data]
          : [
              ...response.data.data.filter((schoolStageItem) =>
                access.includes(schoolStageItem.id)
              ),
            ]
      );
      setLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    (async () => {
      await fetchStageSchool();
    })();
  }, [loggedInUser]);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Admission Stages"
        columns={columns}
        data={schoolStageList}
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
                //    onClick={()=>setSchoolDialog(false)}
              />
            </div>

            <FormControl>
            <FormLabel>Stage Type</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="Test" control={<Radio />} label="Test" />
              <FormControlLabel
                value="Interview"
                control={<Radio />}
                label="Interview"
              />
            </RadioGroup>
          </FormControl>
            <TextField
            style={{marginTop:"1rem"}}
              fullWidth
              autoFocus
              label="Stage Name"
              placeholder="Enter Stage"
              variant="outlined"
              sx={{ mt: "0.4rem" }}
              onChange={(e) => {
                setInputData(e.target.value);
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
