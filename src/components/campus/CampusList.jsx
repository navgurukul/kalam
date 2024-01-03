import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";
import ToolbarAddCampuses from "./ToolbarAddCampuses";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
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
    name: "campus",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
        const url =
          value === "All" ? `/campus/allcampus/` : `/campus/${id}/students`;
        return (
          <Link to={url} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

const CampusList = () => {
  const { loggedInUser, roles } = useSelector((state) => state.auth);

  const [campusList, setCampusList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [campusDialog, setCampusDialog] = useState(false);
  const [inputData, setInputData] = useState({ campus: "", address: "" });

  const handleOpenSubmit = async () => {
    if (inputData.campus && inputData.address) {
      const dataURL = `${baseUrl}campus`;
      await axios.post(dataURL, inputData);
      setInputData("");
      fetchCampus();
      setCampusDialog(false);
    }
  };

  const openCampusesDialog = () => {
    setCampusDialog(true);
  };

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    filter: false,
    customToolbar: React.useCallback(
      () => <ToolbarAddCampuses handleOpen={openCampusesDialog} />,
      []
    ),
  };

  const fetchCampus = async () => {
    try {
      const adminRole = roles.findIndex(
        (roleItem) => roleItem.role === "Admin"
      );
      const role = roles.find((roleItem) => roleItem.role === "Campus");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseUrl}campus`;
      const response = await axios.get(dataURL);
      setCampusList(
        adminRole !== -1
          ? [...response.data.data, { campus: "All" }]
          : [
              ...response.data.data.filter((campusItem) =>
                access.includes(campusItem.id)
              ),
            ]
      );
      setLoading(false);
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      // await fetchAccess();
      await fetchCampus();
    })();
  }, [loggedInUser]);

  console.log("campusList", campusList);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Campuses Name"
        columns={columns}
        data={campusList}
        showLoader={loading}
        options={options}
      />
      <Dialog
        fullWidth
        open={campusDialog}
        onClose={() => setCampusDialog(false)}
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
              <p style={{ fontSize: "24px" }}>New Campus Details</p>
              <CloseIcon
                style={{ cursor: "pointer" }}
                onClick={() => setCampusDialog(false)}
              />
            </div>
            <TextField
              fullWidth
              autoFocus
              label="Campus Name"
              placeholder="Enter Campus"
              variant="outlined"
              sx={{ mt: "0.4rem" }}
              onChange={(e) => {
                setInputData({ ...inputData, campus: e.target.value });
              }}
            />
            <TextField
              style={{ marginTop: "2rem" }}
              fullWidth
              // maxWidth="md"
              autoFocus
              label="Address"
              placeholder="Write address"
              variant="outlined"
              sx={{ mt: "0.4rem" }}
              onChange={(e) => {
                setInputData({ ...inputData, address: e.target.value });
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ width: "100%", padding: "0.7rem", marginTop: "2rem" }}
              onClick={handleOpenSubmit}
            >
              Add New Campus
            </Button>
          </DialogContent>
        </section>
      </Dialog>
    </Container>
  );
};

export default CampusList;
