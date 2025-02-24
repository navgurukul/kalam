import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MainLayout from "../muiTables/MainLayout";
import { changeFetching } from "../../store/slices/uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const columns = [
  {
    name: "id",
    label: "S.No",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => rowMeta.rowIndex + 1,
    },
  },
  {
    name: "donor",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
        return (
          <Link to={`/donor/${id}/students`} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

const DonorList = () => {
  const { roles } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fetchingFinish = () => dispatch(changeFetching(false));
  
  const [state, setState] = useState({
    data: [],
    showLoader: true,
  });

  const fetchDonors = async (signal) => {
    try {
      const response = await axios.get(`${baseUrl}donors`, { signal });
      console.log("API Response:", response.data);

      const role = roles.find((roleItem) => roleItem.role === "Donor");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      console.log("User Access List:", access);
      console.log("Roles from Redux:", roles);

      // Fix: Allow access if user has no restrictions
      const filteredDonors =
        roles.some((roleItem) => roleItem.role === "Admin") || access.length === 0
          ? response.data
          : response.data.filter((donorItem) => access.includes(donorItem.id));

      console.log("Filtered Donors:", filteredDonors);

      setState((prev) => ({
        ...prev,
        data: filteredDonors,
        showLoader: false,
      }));
    } catch (e) {
      if (axios.isCancel(e)) {
        console.warn("Request canceled:", e.message);
      } else {
        console.error("Error fetching donors:", e);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchDonors(controller.signal);
    fetchingFinish();
    return () => controller.abort();
  }, []);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Donors Name"
        columns={columns}
        data={state.data}
        showLoader={state.showLoader}
      />
    </Container>
  );
};

export default DonorList;
