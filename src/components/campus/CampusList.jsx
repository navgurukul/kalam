import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";
import Loader from "../ui/Loader";
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
  const { isFetching } = useSelector((state) => state.ui);

  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [campusList, setCampusList] = React.useState([]);

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
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      fetchingStart();
      // await fetchAccess();
      await fetchCampus();
      fetchingFinish();
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

  return !isFetching ? (
    <Container maxWidth="sm">
      <MainLayout
        title="Campuses Name"
        columns={columns}
        data={campusList}
        showLoader={isFetching}
      />
    </Container>
  ) : (
    <Loader container />
  );
};

export default CampusList;
