import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import NewCustomToolbar from "../utils/NewCustomToolbar";
import Select from "react-select";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const NewAdminPage = () => {
  const [roleByMailID, setRoleByMailID] = useState([]);
  const [selectedOptionRole, setSelectedOptionRole] = useState([]);
  const [selectedOptionPrivilages, setSelectedOptionPrivilages] = useState([]);

  const baseUrl = process.env.API_URL;
  const allPrivilagesOptions = [
    { value: "admin", label: "Admin" },
    { value: "admin2", label: "Admin2" },
    { value: "admin3", label: "Admin3" },
  ];

  const fetchByMailId = () => {
    axios
      .get(`${baseUrl}rolebaseaccess/email`)
      .then((response) => {
        console.log(response, "response");
        setRoleByMailID(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchByMailId();
  }, []);

  const handleRoleChange = (selectedOptionRole) => {
    setSelectedOptionRole(selectedOptionRole);
    console.log(`Option selected:`, selectedOptionRole);
  };

  const handlePrivilagesChange = (selectedOptionPrivilages) => {
    setSelectedOptionPrivilages(selectedOptionPrivilages);
    console.log(`Option selected:`, selectedOptionPrivilages);
  };

  const columns = [
    "Mail-Id",
    {
      name: "roles",
      label: "Role",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return (
            // <Select
            //   placeholder={"Select Role"}
            //   value={
            //     selectedOptionRole.length > 0
            //       ? selectedOptionRole
            //       : value.map((item) => {
            //           return {
            //             value: item,
            //             label: item.split(":", 1),
            //           };
            //         })
            //   }
            //   isMulti={true}
            //   onChange={handleRoleChange}
            //   options={allPrivilagesOptions}
            //   styles={{
            //     menuList: (base) => ({
            //       ...base,
            //       position: "fixed !important",
            //       backgroundColor: "white",
            //       border: "1px solid lightgray",
            //       width: "18%",
            //     }),
            //   }}
            // />

            <div>
              {value.map((item) => {
                return (
                  <span
                    style={{
                      display: "inline-block",
                      marginRight: "10px",
                      border: "1px solid lightgray",
                      padding: "8px",
                    }}
                  >
                    {item.split(":", 1)}
                    <br />
                  </span>
                );
              })}
            </div>
          );
        },
      },
    },
    {
      name: "privilege",
      label: "Privilages",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return (
            <div>
              <span
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                  border: "1px solid lightgray",
                  padding: "8px",
                }}
              >
                Privilege
                <br />
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <EditIcon
                style={{
                  color: "green",
                  cursor: "pointer",
                }}
                onClick={() => {}}
              />
              <DeleteIcon
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: false,
    customToolbar: () => {
      return <NewCustomToolbar />;
    },
  };

  let data = roleByMailID.map((item) => {
    return [item.email, item.roles, item.privilege];
  });

  return (
    <MUIDataTable
      title={"Role Based Accesses"}
      data={data}
      columns={columns}
      options={options}
    />
  );
};

export default NewAdminPage;
