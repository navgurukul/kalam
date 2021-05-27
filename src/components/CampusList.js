import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import MainLayout from "./MainLayout";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl = process.env.API_URL;

const columns = [
  {
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => {
        let url = `/campus/${value}`;
        return (
          <Link to={url} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

class CampusList extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    this.fetchDonors();
  }

  async fetchDonors() {
    try {
      const dataURL = baseUrl + "Campus";
      const response = await axios.get(dataURL);
      this.setState({
        data: response.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Container maxWidth="sm">
        <MainLayout
          title={"Campus Names"}
          columns={columns}
          data={this.state.data}
        />
      </Container>
    );
  }
}

export default CampusList;
