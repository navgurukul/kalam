import React, { useEffect } from "react";
import Container from "@material-ui/core/Container";
import MainLayout from "./MainLayout";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl = process.env.API_URL;

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
        let url = `donor/${id}/students`;
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
  const [state, setState] = React.useState({
    data: [],
    showLoader: true,
  });

  useEffect(() => {
    const fetchData = async () => await fetchDonors();
    fetchData();
  }, []);

  const fetchDonors = async () => {
    try {
      const dataURL = baseUrl + "donors";
      const response = await axios.get(dataURL);
      setState({
        ...state,
        data: response.data,
        showLoader: false,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const { data, showLoader } = state;
  return (
    <Container maxWidth="sm">
      <MainLayout
        title={"Donors Name"}
        columns={columns}
        data={data}
        showLoader={showLoader}
      />
    </Container>
  );
};

export default DonorList;
