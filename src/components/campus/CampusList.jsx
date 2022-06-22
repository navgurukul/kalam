import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";

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
  const { loggedInUser, roles } = useSelector((state) => state.auth);

  const [campusList, setCampusList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     fetchingStart();
  //     await fetchAccess();
  //     fetchingFinish();
  //   };
  //   fetchData();
  // }, [loggedInUser]);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Campuses Name"
        columns={columns}
        data={campusList}
        showLoader={loading}
      />
    </Container>
  );
};

export default CampusList;
