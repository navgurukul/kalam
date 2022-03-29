import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import NewCustomToolbar from "../utils/NewCustomToolbar";
import Select from "react-select";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import TextField from "@material-ui/core/TextField";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Typography,
} from "@material-ui/core";

const baseUrl = process.env.API_URL;

const NewAdminPage = () => {
  const [roleByMailID, setRoleByMailID] = useState([]);
  // const [selectedOptionRole, setSelectedOptionRole] = useState([]);
  // const [selectedOptionPrivilages, setSelectedOptionPrivilages] = useState([]);

  //Snackbar
  const snackbar = useSnackbar();

  //States and Hooks
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [roleMenu, setRoleMenu] = useState("");
  const [selectedPrivilages, setSelectedPrivilages] = useState([]);
  const [mail, setMail] = useState("");
  const [selectedRolePartners, setSelectedRolePartners] = useState([]);
  const [selectedRoleTP, setSelectedRoleTP] = useState([]);

  //options for dropdowns
  const dropDownOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const RoleMenuOptions = [
    { value: "partner", label: "Partners" },
    { value: "t&p", label: "T&P" },
  ];

  const RoleOptions = [
    { value: "partner", label: "Partners" },
    { value: "t&p", label: "T&P" },
  ];

  const handleClose = () => {
    setDialogOpen(false);
    setMail("");
    setSelectedRolePartners([]);
    setSelectedRoleTP([]);
    setSelectedPrivilages([]);
    setEditing(null);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };
  // const allPrivilagesOptions = [
  //   { value: "admin", label: "Admin" },
  //   { value: "admin2", label: "Admin2" },
  //   { value: "admin3", label: "Admin3" },
  // ];

  //event handlers
  const handleRoleChangePartners = (selectedRole) => {
    setSelectedRolePartners(selectedRole);
    console.log(selectedRole);
  };

  const handleRoleChangeTP = (selectedRole) => {
    setSelectedRoleTP(selectedRole);
  };

  const handlePrivilagesChange = (selectedPrivilages) => {
    setSelectedPrivilages(selectedPrivilages);
  };

  const handleRoleMenuChange = (selectedRoleMenu) => {
    setRoleMenu(selectedRoleMenu);
  };

  const handleSubmit = async () => {
    const PartnerRole =
      selectedRolePartners.length > 0 &&
      selectedRolePartners.map((role) => {
        return role.value;
      });
    const TPRole =
      selectedRoleTP.length > 0 &&
      selectedRoleTP.map((role) => {
        return role.value;
      });
    const Role =
      PartnerRole === false
        ? [...TPRole]
        : TPRole === false
        ? [...PartnerRole]
        : [...PartnerRole, ...TPRole];

    console.log(Role, "Roleee");

    await axios
      .post(`${baseUrl}rolebaseaccess/email/add`, {
        email: mail,
        roles: Role,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          snackbar.enqueueSnackbar("Role Assigned Successfully to " + mail, {
            variant: "success",
          });
          setDialogOpen(false);
          setMail("");
          setRoleMenu("");
          setSelectedRolePartners([]);
          setSelectedRoleTP([]);
          setSelectedPrivilages([]);
        } else {
          snackbar.enqueueSnackbar("Something Went Wrong", {
            variant: "error",
          });
        }
      });
  };

  useEffect(() => {
    handleSubmit();
    return () => {
      //cleanup
      setDialogOpen(false);
      setMail("");
      setRoleMenu("");
      setSelectedRolePartners([]);
      setSelectedRoleTP([]);
      setSelectedPrivilages([]);
    };
  }, []);

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

  // const handleRoleChange = (selectedOptionRole) => {
  //   setSelectedOptionRole(selectedOptionRole);
  //   console.log(`Option selected:`, selectedOptionRole);
  // };

  // const handlePrivilagesChange = (selectedOptionPrivilages) => {
  //   setSelectedOptionPrivilages(selectedOptionPrivilages);
  //   console.log(`Option selected:`, selectedOptionPrivilages);
  // };

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
              {value.map((item, inx) => {
                return (
                  <span
                    key={inx}
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
        customBodyRender: (value, { rowData }) => {
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
                onClick={() => {
                  console.log(rowData);
                  setEditing(rowData[3]);
                  setMail(rowData[0]);
                  setSelectedPrivilages([
                    { value: rowData[2], label: rowData[2] },
                  ]);
                  let roles = {};
                  rowData[1].forEach((el) => {
                    if (el.split(":")[0] === "partner") {
                      let partners = el
                        .split(":")[1]
                        .split(",")
                        .map((el) => ({ label: el, value: el }));
                      console.log(partners);
                      roles["partners"] = partners;
                    }
                    if (el.split(":")[0] === "T&P") {
                      let campuses = el
                        .split(":")[1]
                        .split(",")
                        .map((el) => ({ value: el, label: el }));
                      roles["tnp"] = campuses;
                    }
                  });
                  if (roles["partners"])
                    setSelectedRolePartners(roles["partners"]);
                  if (roles["tnp"]) setSelectedRoleTP(roles["tnp"]);
                  handleOpen();
                }}
              />
              <DeleteIcon
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.confirm(
                    `Do you want to delete roles of ${rowData[0]}?`
                  )
                    ? axios
                        .delete(
                          `${baseUrl}rolebaseaccess/email/delete/${rowData[3]}`
                        )
                        .then((res) => {
                          snackbar.enqueueSnackbar(
                            "Role deleted successfully!",
                            {
                              variant: "success",
                            }
                          );
                        })
                    : "";
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
      return <NewCustomToolbar handleOpen={handleOpen} />;
    },
  };

  let data = roleByMailID.map((item) => {
    return [item.email, item.roles, item.privilege, item.id];
  });

  return (
    <>
      <MUIDataTable
        title={"Role Based Accesses"}
        data={data}
        columns={columns}
        options={options}
      />
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>
          <Typography
            variant="h4"
            color="primary"
            // style={{
            //   // color: "#f05f40",
            //   textAlign: "center",
            //   marginTop: "0px",
            //   position: "relative",
            //   bottom: "20px",
            // }}
          >
            Give Access To -
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            > */}
            <Grid item xs={12}>
              {/* <label htmlFor="email">Email Id</label> */}
              <TextField
                fullWidth
                label="Email Id"
                placeholder="Email Id"
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                // style={{
                //   width: "50%",
                //   marginLeft: "20px",
                //   marginRight: "20px",
                // }}
              />
            </Grid>
            {/* </div> */}
            <Grid item xs={12} style={{ padding: "0.1rem" }}>
              <InputLabel
                id="role-menu-label"
                style={{ paddingBottom: "0.2rem" }}
              >
                Roles
              </InputLabel>
              <Select
                placeholder={"Role Menu"}
                value={roleMenu}
                onChange={handleRoleMenuChange}
                options={RoleMenuOptions}
                styles={{
                  menuList: (base) => ({
                    ...base,
                    // position: "fixed !important",
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    // width: "100%",
                  }),
                }}
              />
            </Grid>
            {roleMenu.value === "partner" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="role"
                    style={{
                      paddingBottom: "0.2rem",
                    }}
                  >
                    Partners
                  </InputLabel>
                  <Select
                    placeholder={"Select Particular Partners"}
                    value={selectedRolePartners}
                    onChange={handleRoleChangePartners}
                    isMulti={true}
                    options={dropDownOptions}
                    styles={{
                      menuList: (base) => ({
                        ...base,
                        position: "fixed !important",

                        backgroundColor: "white",
                        border: "1px solid lightgray",
                        // width: "18%",
                      }),
                    }}
                  />
                </FormControl>
              </Grid>
            )}
            {roleMenu.value === "t&p" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="t&p"
                    style={{
                      paddingBottom: "0.2rem",
                    }}
                  >
                    T&P
                  </InputLabel>
                  <Select
                    placeholder={"Select Particular T&P"}
                    value={selectedRoleTP}
                    onChange={handleRoleChangeTP}
                    isMulti={true}
                    options={dropDownOptions}
                    styles={{
                      menuList: (base) => ({
                        ...base,
                        position: "fixed !important",

                        backgroundColor: "white",
                        border: "1px solid lightgray",
                        width: "18%",
                      }),
                    }}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <InputLabel
                style={{
                  paddingBottom: "0.2rem",
                }}
                htmlFor="privilage"
              >
                Privilage
              </InputLabel>
              <Select
                placeholder={"Select Privilage"}
                value={selectedPrivilages}
                onChange={handlePrivilagesChange}
                isMulti={true}
                // options={PrivilageOptions}
                styles={{
                  menuList: (base) => ({
                    ...base,
                    // position: "fixed !important",
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    // width: "18%",
                  }),
                }}
              />
            </Grid>
          </Grid>
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                margin: "0.4rem",
              }}
              onClick={() => {
                const PartnerRole =
                  selectedRolePartners.length > 0 &&
                  "partner:" +
                    selectedRolePartners
                      .map((role) => {
                        return role.value;
                      })
                      .join(",");
                const TPRole =
                  selectedRoleTP.length > 0 &&
                  "T&P:" +
                    selectedRoleTP
                      .map((role) => {
                        return role.value;
                      })
                      .join(",");
                const Role =
                  PartnerRole === false
                    ? [TPRole]
                    : TPRole === false
                    ? [PartnerRole]
                    : [PartnerRole, TPRole];

                console.log(Role, "Roleee");

                if (editing) {
                  axios
                    .put(`${baseUrl}rolebaseaccess/email/update/${editing}`, {
                      email: mail,
                      roles: Role,
                    })
                    .then((res) => {
                      console.log(res);
                      if (res.status === 200) {
                        snackbar.enqueueSnackbar(
                          "Role Updated Successfully for " + mail,
                          {
                            variant: "success",
                          }
                        );
                        setDialogOpen(false);
                        setMail("");
                        setSelectedRolePartners([]);
                        setSelectedRoleTP([]);
                        setSelectedPrivilages([]);
                        setEditing(null);
                      } else {
                        snackbar.enqueueSnackbar("Something Went Wrong", {
                          variant: "error",
                        });
                      }
                    });
                } else {
                  axios
                    .post(`${baseUrl}rolebaseaccess/email/add`, {
                      email: mail,
                      roles: Role,
                    })
                    .then((res) => {
                      console.log(res);
                      if (res.status === 200) {
                        snackbar.enqueueSnackbar(
                          "Role Assigned Successfully to " + mail,
                          {
                            variant: "success",
                          }
                        );
                        setDialogOpen(false);
                        setMail("");
                        setSelectedRolePartners([]);
                        setSelectedRoleTP([]);
                        setSelectedPrivilages([]);
                      } else {
                        snackbar.enqueueSnackbar("Something Went Wrong", {
                          variant: "error",
                        });
                      }
                    });
                }
              }}
            >
              {editing ? "Update" : "Submit"}
            </Button>
            <Button
              style={{
                margin: "0.4rem",
              }}
              variant="outlined"
              color="primary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewAdminPage;
