import React, { useEffect } from "react";
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
      customBodyRender: (value, rowMeta) => {
        const index = rowMeta.rowIndex + 1;
        return index;
      },
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
        const url = `/donor/${id}/students`;
        return (
          <Link to={url} style={{ color: "#f05f40" }}>
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
  const [state, setState] = React.useState({
    data: [],
    showLoader: true,
  });
  const fetchDonors = async (signal) => {
    try {
      const role = roles.find((roleItem) => roleItem.role === "Donor");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseUrl}donors`;
      const response = await axios.get(dataURL, { signal });
      setState({
        ...state,
        data: response.data.filter((donorItem) =>
          access.includes(donorItem.id)
        ),
        showLoader: false,
      });
    } catch (e) {
      // console.error(e);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => fetchDonors(controller.signal);
    fetchData();
    fetchingFinish();
    return () => controller.abort();
  }, []);

  const { data, showLoader } = state;
  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Donors Name"
        columns={columns}
        data={data}
        showLoader={showLoader}
      />
    </Container>
  );
};

export default DonorList;
