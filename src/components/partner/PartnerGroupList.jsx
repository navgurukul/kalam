import React, { useEffect } from "react";
import Container from "@mui/material/Container";
// import axios from "axios";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import MainLayout from "../muiTables/MainLayout";

// const baseUrl = import.meta.env.VITE_API_URL;

const partnerGroups = [
  {
    id: 1,
    partnerGroup: "AKANSHA",
  },
];

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
    name: "partnerGroup",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const id = rowMeta.rowData[0];
        const url = `/partner/group/${id}`;
        return (
          <Link target="_blank" to={url} style={{ color: "#f05f40" }}>
            {value}
          </Link>
        );
      },
    },
  },
];

const PartnerGroupList = () => {
  // const { roles, loggedInUser } = useSelector((state) => state.auth);

  const [partnerGroupList, setPartnerGroupList] = React.useState([]);
  const [loading] = React.useState(false);

  // const fetchPartnerGroupList = async () => {
  //   try {
  //     const adminRole = roles.findIndex(
  //       (roleItem) => roleItem.role === "Admin"
  //     );
  //     const role = roles.find((roleItem) => roleItem.role === "Campus");
  //     const access = role?.access?.map((accessItem) => accessItem.access) || [];
  //     const dataURL = `${baseUrl}campus`;
  //     const response = await axios.get(dataURL);
  //     setPartnerGroupList(
  //       adminRole !== -1
  //         ? [...response.data.data, { campus: "All" }]
  //         : [
  //             ...response.data.data.filter((campusItem) =>
  //               access.includes(campusItem.id)
  //             ),
  //           ]
  //     );
  //     setLoading(false);
  //   } catch (e) {
  //     // console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   (async () => {
  //     // await fetchAccess();
  //     await fetchCampus();
  //   })();
  // }, [loggedInUser]);

  useEffect(() => setPartnerGroupList(partnerGroups), []);

  return (
    <Container maxWidth="sm">
      <MainLayout
        title="Partner Groups"
        columns={columns}
        data={partnerGroupList}
        showLoader={loading}
      />
    </Container>
  );
};

export default PartnerGroupList;
