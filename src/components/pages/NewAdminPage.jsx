import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Select from "react-select";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Slide,
  DialogActions,
  Container,
  Chip,
  Autocomplete,
  Select as MUISelect,
  MenuItem,
  FormControl,
} from "@mui/material";
import { AddCircleOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import NewCustomToolbar from "../smallComponents/NewCustomToolbar";
import { campus } from "../../utils/constants";
import { showDialog } from "../../store/slices/uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const NewAdminPage = () => {
  const snackbar = useSnackbar();
  const dispatch = useDispatch();

  //States and Hooks
  const [roleByMailID, setRoleByMailID] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accessDialog, setAccessDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPrivilages, setSelectedPrivilages] = useState([]);
  const [access, setAccess] = useState({
    role: "selectrole",
    access: "selectaccess",
  });
  const [mail, setMail] = useState("");

  //options for dropdowns
  const [roleOptions, setRoleOptions] = React.useState([]);
  const [privilegeOptions, setPrivilegeOptions] = React.useState([]);

  const handleClose = () => {
    setDialogOpen(false);
    setMail("");
    setSelectedRoles([]);
    setSelectedPrivilages([]);
    setEditing(null);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handlePrivilegeChange = (newSelectedPrivilages) => {
    setSelectedPrivilages(newSelectedPrivilages);
  };

  const handleRoleChange = (selectedRoleMenu) => {
    // dispatch(showDialog({ title: "123" }));
    if (selectedRoleMenu.length < selectedRoles.length) {
      setSelectedRoles(selectedRoleMenu);
      return;
    }
    setAccess(
      selectedRoleMenu[selectedRoleMenu.length - 1].label.toLowerCase()
    );
    setAccessDialog(true);
  };

  // const handleSubmit = async () => {
  //   const PartnerRole =
  //     selectedRolePartners.length > 0 &&
  //     selectedRolePartners.map((role) => role.value);
  //   const TPRole =
  //     selectedRoleTP.length > 0 && selectedRoleTP.map((role) => role.value);
  //   const Role =
  //     PartnerRole === false
  //       ? [...TPRole]
  //       : TPRole === false
  //       ? [...PartnerRole]
  //       : [...PartnerRole, ...TPRole];

  //   await axios
  //     .post(`${baseUrl}rolebaseaccess/email/add`, {
  //       email: mail,
  //       roles: Role,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         snackbar.enqueueSnackbar(`Role Assigned Successfully to ${mail}`, {
  //           variant: "success",
  //         });
  //         setDialogOpen(false);
  //         setMail("");
  //         setRoleMenu("");
  //         setSelectedRolePartners([]);
  //         setSelectedRoleTP([]);
  //         setSelectedPrivilages([]);
  //       } else {
  //         snackbar.enqueueSnackbar("Something Went Wrong", {
  //           variant: "error",
  //         });
  //       }
  //     });
  // };

  useEffect(
    () => () => {
      //cleanup
      setDialogOpen(false);
      setMail("");
      setSelectedRoles("");
      setSelectedRoles([]);
      setSelectedPrivilages([]);
    },
    []
  );

  // const roles = ['campus','partner'];

  const toTitleCase = (str) => `${str.charAt(0).toUpperCase()}${str.substr(1)}`;

  const getAccessData = (role, accessId) => {
    let matchedItem;
    switch (role.toLowerCase()) {
      case "campus":
        matchedItem = campus.find((campusItem) => campusItem.id === accessId);
        // console.log(matchedItem);
        return matchedItem;

      default:
        return {};
    }
  };

  const getOptions = (role, filterRoles) => {
    let exclusions;
    switch (role.toLowerCase()) {
      case "campus":
        exclusions = filterRoles.map(
          (filterItem) => filterItem.label.split("-")[1]
        );
        return campus
          .filter((campusItem) => !exclusions.includes(campusItem.name))
          .map((campusItem) => ({
            label: campusItem.name,
            value: campusItem.id,
          }));
      default:
        return [];
    }
  };

  const fetchByMailId = () => {
    axios
      .get(`${baseUrl}rolebaseaccess/email`)
      .then((response) => {
        const users = response.data.map((user) => {
          let userData = {};
          const roles = [];
          const privileges = [];
          user.userrole.forEach((roleData) => {
            if (roleData.role?.length > 0 && roleData.access)
              roles.push({
                access: roleData.access.filter(
                  (accesObj) => accesObj.user_role_id === roleData.role[0].id
                ),
                role_id: roleData.role[0].id,
                role: `${toTitleCase(roleData.role[0].roles)}`,
              });
            if (roleData.privilege && roleData.privileges.length !== 0)
              privileges.push({
                id: roleData.privileges[0].id,
                privilege: roleData.privileges[0].privilege,
              });
          });
          userData = { email: user.email, roles, privileges };
          return userData;
        });
        console.log(users);
        setRoleByMailID(users);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchRolesPrivileges = async () => {
    try {
      const roles = await axios.get(`${baseUrl}role/getRole`);
      const privilege = await axios.get(`${baseUrl}role/getPrivilege`);
      setRoleOptions(
        roles.data.map((role) => ({
          label: `${toTitleCase(role.roles)}`,
          value: role.id,
        }))
      );
      setPrivilegeOptions(
        privilege.data.map((priv) => ({
          label: priv.privilege,
          value: priv.id,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const updateAccess = (acc) => setAccess(acc);

  useEffect(() => {
    fetchByMailId();
    fetchRolesPrivileges();
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
    { name: "email", label: "Mail-Id" },
    {
      name: "roles",
      label: "Roles",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback(
          (value) => (
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
              {value.map((item) =>
                item.access.map((accessItem) => (
                  // <span
                  //   key={`${item} ${Math.random() * 10}`}
                  //   style={{
                  //     display: "inline-block",
                  //     marginRight: "10px",
                  //     border: "1px solid lightgray",
                  //     padding: "8px",
                  //   }}
                  // >
                  //   {item.role}-
                  //   {getAccessData(item.role, accessItem.access).name}
                  // </span>
                  <Chip
                    key={`${item} ${Math.random() * 10}`}
                    variant="filled"
                    label={`${item.role}-${
                      getAccessData(item.role, accessItem.access).name
                    }`}
                    sx={{ marginX: "0.4rem" }}
                    onDelete={() => {}}
                  />
                ))
              )}
              <Chip
                variant="outlined"
                icon={<AddCircleOutlined />}
                label="Add"
                onClick={() => {
                  setAccessDialog(true);
                  // dispatch(
                  //   showDialog({
                  //     title: "Select ",
                  //     content: (
                  //     ),
                  //   })
                  // );
                }}
              />
            </div>
          ),
          []
        ),
      },
    },
    {
      name: "privileges",
      label: "Privileges",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback(
          (rowData) => (
            // <div>
            //   <span
            //     style={{
            //       display: "inline-block",
            //       marginRight: "10px",
            //       border: "1px solid lightgray",
            //       padding: "8px",
            //     }}
            //   >
            //     {rowData[0].privilege}
            //   </span>
            // </div>
            <Chip label={rowData[0].privilege} sx={{ pX: "0.4rem" }} />
          ),
          []
        ),
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback(
          (value, { rowData }) => (
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
                  setEditing(true);
                  setMail(rowData[0]);

                  setSelectedRoles(
                    rowData[1].reduce((acc, role) => {
                      role.access.forEach((accessItem) => {
                        acc.push({
                          label: `${role.role}-${
                            getAccessData(role.role, accessItem.access).name
                          }`,
                          value: `${role.role_id}-${accessItem.id}`,
                        });
                      });
                      return acc;
                    }, [])
                  );

                  setSelectedPrivilages(
                    rowData[2].map((priv) => {
                      const privData = privilegeOptions.find(
                        (opt) => opt.value === priv.id
                      );
                      if (privData) {
                        return { label: privData.label, value: privData.value };
                      }
                      return { label: "Invalid Privelege", value: "0" };
                    })
                  );
                  const roles = {};
                  rowData[1].forEach((el) => {
                    // if (el.split(":")[0] === "partner") {
                    //   const partners = el
                    //     .split(":")[1]
                    //     .split(",")
                    //     .map((elm) => ({ label: elm, value: elm }));
                    //   roles.partners = partners;
                    // }
                    // if (el.split(":")[0] === "T&P") {
                    //   const campuses = el
                    //     .split(":")[1]
                    //     .split(",")
                    //     .map((elm) => ({ value: elm, label: elm }));
                    //   roles.tnp = campuses;
                    // }
                  });
                  // if (roles.partners) setSelectedRolePartners(roles.partners);
                  // if (roles.tnp) setSelectedRoleTP(roles.tnp);
                  handleOpen();
                }}
              />
              <DeleteIcon
                style={{
                  color: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (
                    window.confirm(
                      `Do you want to delete roles of ${rowData[0]}?`
                    )
                  )
                    axios
                      .delete(
                        `${baseUrl}rolebaseaccess/email/delete/${rowData[3]}`
                      )
                      .then(() => {
                        snackbar.enqueueSnackbar("Role deleted successfully!", {
                          variant: "success",
                        });
                      });
                }}
              />
            </div>
          ),
          []
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none",

    customToolbar: React.useCallback(
      () => <NewCustomToolbar handleOpen={handleOpen} />,
      []
    ),
  };

  return (
    <Container maxWidth="xl">
      <MUIDataTable
        title="Role Based Accesses"
        data={roleByMailID}
        columns={columns}
        options={options}
      />
      <Dialog
        fullWidth
        open={accessDialog}
        onClose={() => setAccessDialog(false)}
      >
        <DialogTitle>Select Role</DialogTitle>
        <DialogContent sx={{ pY: "0.8rem" }}>
          <Grid container sx={{ mY: "0.8rem" }} spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ pY: "0.4rem" }}>
                <InputLabel>Select Role</InputLabel>
                <MUISelect
                  fullWidth
                  label="Select Role"
                  placeholder="Select Role"
                  name="role-select"
                  value={access.role.toLowerCase()}
                  onChange={(ev) => {
                    updateAccess({
                      ...access,
                      access: "selectaccess",
                      role: toTitleCase(ev.target.value),
                    });
                  }}
                >
                  <MenuItem disabled value="selectrole">
                    Select Role
                  </MenuItem>
                  {["Campus", "Partners", "Admin"].map((arrItem) => (
                    <MenuItem key={arrItem} value={arrItem.toLowerCase()}>
                      {arrItem}
                    </MenuItem>
                  ))}
                </MUISelect>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>
                  Select {access.role === "selectRole" ? "Role" : access.role}
                </InputLabel>
                <MUISelect
                  fullWidth
                  label={`Select ${access.role}`}
                  placeholder={`Select ${access.role}`}
                  name="access-select"
                  value={access.access}
                  onChange={(ev) =>
                    updateAccess({ ...access, access: ev.target.value })
                  }
                >
                  <MenuItem disabled value="selectaccess">
                    Select {access.role === "selectrole" ? "Role" : access.role}
                  </MenuItem>
                  {access.role !== "selectRole"
                    ? getOptions(access.role, []).map((arrItem) => (
                        <MenuItem key={arrItem.value} value={arrItem.value}>
                          {arrItem.label}
                        </MenuItem>
                      ))
                    : []}
                </MUISelect>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          {/* <Typography
            variant="h4"
            color="primary"
            // style={{
            //   // color: "#f05f40",
            //   textAlign: "center",
            //   marginTop: "0px",
            //   position: "relative",
            //   bottom: "20px",
            // }}
          > */}
          Give Access To -{/* </Typography> */}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Dialog
            maxWidth="sm"
            fullWidth
            open={false}
            onClose={() => setAccessDialog(false)}
          >
            <DialogTitle>Select {toTitleCase(access.role)}</DialogTitle>
            <DialogContent sx={{ w: "50%" }}>
              <Container maxWidth="md" sx={{ p: "0.4rem" }}>
                <Autocomplete
                  options={getOptions(access.role, selectedRoles)}
                  disablePortal
                  // sx={{ width: "4.8rem" }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} />}
                />
              </Container>
            </DialogContent>
            <DialogActions>
              <Button>Confirm</Button>
            </DialogActions>
          </Dialog>

          <Grid container spacing={2} maxWidth="lg">
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
                placeholder="Roles"
                isMulti
                value={selectedRoles}
                onChange={handleRoleChange}
                options={roleOptions}
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
            {/* {roleMenu.value === "partner" && (
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
                    placeholder="Select Particular Partners"
                    // value={selectedRolePartners}
                    onChange={handleRoleChangePartners}
                    isMulti
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
                    placeholder="Select Particular T&P"
                    // value={selectedRoleTP}
                    onChange={handleRoleChangeTP}
                    isMulti
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
            )} */}
            <Grid item xs={12}>
              <InputLabel
                style={{
                  paddingBottom: "0.2rem",
                }}
                htmlFor="privilege"
              >
                Privilege
              </InputLabel>
              <Select
                variant="outlined"
                placeholder="Select Privileges"
                value={selectedPrivilages}
                onChange={handlePrivilegeChange}
                isMulti
                options={privilegeOptions}
                styles={{
                  menuList: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                  }),
                }}
              />
            </Grid>
          </Grid>
          {/* <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: "0.4rem",
            }}
            onClick={() => {
              const PartnerRole =
                selectedRolePartners.length > 0 &&
                `partner:${selectedRolePartners
                  .map((role) => role.value)
                  .join(",")}`;
              const TPRole =
                selectedRoleTP.length > 0 &&
                `T&P:${selectedRoleTP.map((role) => role.value).join(",")}`;
              const Role =
                PartnerRole === false
                  ? [TPRole]
                  : TPRole === false
                  ? [PartnerRole]
                  : [PartnerRole, TPRole];

              if (editing) {
                axios
                  .put(`${baseUrl}rolebaseaccess/email/update/${editing}`, {
                    email: mail,
                    roles: Role,
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      snackbar.enqueueSnackbar(
                        `Role Updated Successfully for ${mail}`,
                        { variant: "success" }
                      );
                      setDialogOpen(false);
                      setMail("");
                      // setSelectedRolePartners([]);
                      // setSelectedRoleTP([]);
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
                    if (res.status === 200) {
                      snackbar.enqueueSnackbar(
                        `Role Assigned Successfully to ${mail}`,
                        {
                          variant: "success",
                        }
                      );
                      setDialogOpen(false);
                      setMail("");
                      // setSelectedRolePartners([]);
                      // setSelectedRoleTP([]);
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
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NewAdminPage;
