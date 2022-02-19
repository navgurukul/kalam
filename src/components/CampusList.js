import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import MainLayout from "./MainLayout";
import axios from "axios";
import { Link } from "react-router-dom";
import user from "../utils/user";
import NotHaveAccess from "./NotHaveAccess";

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
    name: "campus",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
        let url =
          value === "All"
            ? `/campus/allcampus/students`
            : `/campus/${id}/students`;
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
      showLoader: true,
      access: null,
      userLoggedIn: user(),
      campusCondition: false,
    };
  }
  componentDidMount() {
    this.fetchCampus();
    this.fetchAccess();
  }

  async fetchAccess() {
    try {
      const accessUrl = baseUrl + "rolebaseaccess";
      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus;
        this.setState(
          {
            access: campusData ? campusData : null,
          },
          () => {
            const conditions =
              this.state.access &&
              this.state.userLoggedIn &&
              this.state.userLoggedIn.email &&
              this.state.access.view &&
              this.state.access.view.includes(this.state.userLoggedIn.email);

            this.setState(
              {
                campusCondition: conditions,
              },
              () => {
                console.log(this.state.campusCondition);
              }
            );
          }
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  async fetchCampus() {
    try {
      const dataURL = baseUrl + "campus";
      const response = await axios.get(dataURL);
      this.setState({
        data: [...response.data.data, { campus: "All" }],
        showLoader: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { data, showLoader } = this.state;
    return (
      <div>
        {this.state.campusCondition ? (
          <Container maxWidth="sm">
            <MainLayout
              title={"Campuses Name"}
              columns={columns}
              data={data}
              showLoader={showLoader}
            />
          </Container>
        ) : (
          <NotHaveAccess />
        )}
      </div>
    );
  }
}

export default CampusList;
