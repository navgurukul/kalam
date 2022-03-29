import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import axios from "axios";
import { Link } from "react-router-dom";
import MainLayout from "./MainLayout";
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
        const url =
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

const CampusList = () => {
  const [state, setState] = React.useState({
    data: [],
    showLoader: true,
    access: null,
    userLoggedIn: user(),
    campusCondition: false,
  });

  const fetchAccess = async () => {
    try {
      const accessUrl = `${baseUrl}rolebaseaccess`;
      axios.get(accessUrl).then((response) => {
        const campusData = response.data.campus; //storing response data in campusData variable
        const conditions = //variable to check if user is allowed to access the page
          campusData &&
          state.userLoggedIn &&
          state.userLoggedIn.email &&
          campusData.view &&
          campusData.view.includes(state.userLoggedIn.email);

        setState((prevState) => ({
          ...prevState,
          access: campusData || null,
          campusCondition: conditions, //to set access object
        }));
      });
    } catch (e) {
      // console.error(e);
    }
  };

  const fetchCampus = async () => {
    try {
      const dataURL = `${baseUrl}campus`;
      const response = await axios.get(dataURL);
      setState((prevState) => ({
        ...prevState,
        data: [...response.data.data, { campus: "All" }],
        showLoader: false,
      }));
    } catch (e) {
      // console.error(e);
    }
  };
  const { data, showLoader } = state;
  useEffect(() => {
    const fetchData = async () => {
      await fetchCampus();
      await fetchAccess();
    };
    fetchData();
  }, []);
  return (
    <div>
      {state.campusCondition ? (
        <Container maxWidth="sm">
          <MainLayout
            title="Campuses Name"
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
};

export default CampusList;
