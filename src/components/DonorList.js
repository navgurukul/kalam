import React, { Component } from "react";
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

class DonorList extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      showLoader: true
    };
  }
  componentDidMount() {
    this.fetchDonors();
  }

  async fetchDonors() {
    try {
      const dataURL = baseUrl + "donors";
      const response = await axios.get(dataURL);
      this.setState({
        data: response.data,
        showLoader: false
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { data, showLoader } = this.state;
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
  }
}

export default DonorList;
