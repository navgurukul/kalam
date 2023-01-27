import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";
import ToolbarAddButtonSchool from "./ToolbarAddButtonSchool";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  Select as MUISelect,
  TextField,
} from "@mui/material";

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
    name: "name",
    label: "Schools",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
        const url = `/school/${id}/school-stages`;
        return (
          <Link to={url} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

const SchoolData = () => {
  const { loggedInUser, roles } = useSelector((state) => state.auth);
  const [schoolList, setSchoolList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [schoolDialog, setSchoolDialog] = useState(false);
  const [inputData, setInputData] = useState("");

  const handleOpenSubmit = async () => {
    const dataURL = `${baseUrl}school`;
    await axios.post(dataURL, { name: inputData });
    setInputData("");
    fetchSchool();
    setSchoolDialog(false);
  };

  const openSchoolDialog = () => {
    setSchoolDialog(true);
  };

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddButtonSchool handleOpen={openSchoolDialog} />,
      []
    ),
  };

  const fetchSchool = async () => {
    try {
      const adminRole = roles.findIndex(
        (roleItem) => roleItem.role === "Admin"
      );
      const role = roles.find((roleItem) => roleItem.role === "school");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseUrl}school`;
      const response = await axios.get(dataURL);
      setSchoolList(
        adminRole !== -1
          ? [...response.data]
          : [
              ...response.data.data.filter((schoolItem) =>
                access.includes(schoolItem.id)
              ),
            ]
      );
      setLoading(false);
    } catch (e) {}
  };

  useEffect(() => {
    (async () => {
      await fetchSchool();
    })();
  }, [loggedInUser]);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="School Name"
        columns={columns}
        data={schoolList}
        showLoader={loading}
        options={options}
      />
      <Dialog
        fullWidth
        open={schoolDialog}
        onClose={() => setSchoolDialog(false)}
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
              <p style={{fontSize:"24px"}}>Create School</p>
              <CloseIcon style={{cursor:"pointer"}} onClick={()=>setSchoolDialog(false)}/>
            </div>
            <TextField
              fullWidth
              autoFocus
              label="School Name"
              placeholder="Enter School"
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
              style={{ width: "94%",padding:".5rem" }}
              onClick={handleOpenSubmit}
            >
              Create NEW School
            </Button>
          </DialogActions>
        </section>
      </Dialog>
    </Container>
  );
};

export default SchoolData;
