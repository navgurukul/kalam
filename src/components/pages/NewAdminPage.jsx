/* eslint-disable no-return-await */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Select from "react-select";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  DialogActions,
  Container,
  Chip,
  Typography,
  Select as MUISelect,
  MenuItem,
  FormControl,
  TextField,
} from "@mui/material";
import { debounce } from "underscore";
import { AddCircleOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import NewCustomToolbar from "../smallComponents/NewCustomToolbar";
import { campus } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

const NewAdminPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  //States and Hooks
  const [users, setUsers] = useState([]);
  const [accessDialog, setAccessDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
  // const [selectedRoles, setSelectedRoles] = useState([]);
  // const [selectedPrivilages, setSelectedPrivilages] = useState([]);
  const [access, setAccess] = useState({
    role: "selectrole",
    access: "selectaccess",
    privilege: "selectprivilege",
  });
  const [currentUser, setCurrentUser] = useState({
    id: "",
    email: "",
    selectedRoles: [],
    selectedPrivileges: [],
  });
  const [optionsData, setOptionsData] = React.useState({
    partner: [],
  });
  const [changeFn, setChangeFn] = React.useState({ ex: () => {} });

  //options for dropdowns
  const [rolePrivilegeOptions, setRolePrivilegeOptions] = React.useState({
    roleOptions: [],
    privilegeOptions: [],
  });
  // const [privilegeOptions, setPrivilegeOptions] = React.useState([]);

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

  const toTitleCase = (str) => `${str.charAt(0).toUpperCase()}${str.substr(1)}`;

  const getAccessData = (role, accessId) => {
    let matchedItem;
    switch (role.toLowerCase()) {
      case "campus":
        matchedItem = campus.find((campusItem) => campusItem.id === accessId);
        // console.log(matchedItem);
        return matchedItem;

      case "partner":
        matchedItem = optionsData.partner.find(
          (partnerItem) => partnerItem.value === accessId
        );
        return matchedItem
          ? { id: matchedItem.value, name: matchedItem.label }
          : {};
      default:
        return {};
    }
  };

  const getOptions = (roleId, filterRoles) => {
    const { roleOptions } = rolePrivilegeOptions;
    let exclusions;
    const role = roleOptions.find((opt) => opt.value === roleId) || "";
    switch (role?.label?.toLowerCase() || "") {
      case "campus":
        exclusions = filterRoles.reduce((acc, filterItem) => {
          filterItem.access.forEach((accessItem) =>
            acc.push(accessItem.access)
          );
          return acc;
        }, []);
        return campus
          .filter((campusItem) => !exclusions.includes(campusItem.id))
          .map((campusItem) => ({
            label: campusItem.name,
            value: campusItem.id,
          }));
      case "partner":
        exclusions = filterRoles.reduce(
          (acc, filterItem) => [
            ...acc,
            ...filterItem.access.map((accessItem) => accessItem.access),
          ],
          []
        );
        return optionsData.partner.filter(
          (partnerItem) => !exclusions.includes(partnerItem.value)
        );
      default:
        return [];
    }
  };

  const openEmailDialog = () => {
    setEmailDialog(true);
  };

  const columns = [
    { name: "email", label: "Mail-Id" },
    {
      name: "roles",
      label: "Roles",
      options: {
        filter: true,
        sort: true,
        customBodyRender: React.useCallback(
          (value, rowMeta, change) => (
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

            <>
              {value.map((item) =>
                item.access.map((accessItem) => (
                  <Chip
                    key={`${item} ${Math.random() * 10}`}
                    variant="filled"
                    label={`${item.role}-${
                      getAccessData(item.role, accessItem.access)?.name || ""
                    }`}
                    sx={{ marginX: "0.4rem", marginY: "0.4rem" }}
                    onDelete={() => {}}
                  />
                ))
              )}
              <Chip
                variant="outlined"
                sx={{ marginX: "0.4rem", marginY: "0.4rem" }}
                icon={<AddCircleOutlined />}
                label="Add"
                onClick={() => {
                  setChangeFn({ ex: change });
                  // setSelectedRoles();
                  setAccessDialog("role");
                  setCurrentUser({
                    email: rowMeta.rowData[0],
                    id: rowMeta.rowData[3],
                    selectedRoles: value,
                  });
                }}
              />
            </>
          ),
          [optionsData.partner, users]
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
          (rowData, rowMeta, change) => (
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
            <>
              {rowData.map((privItem) => (
                <Chip
                  label={privItem.privilege}
                  key={privItem.id}
                  sx={{ pX: "0.4rem" }}
                  onDelete={() => {}}
                />
              ))}
              <Chip
                variant="outlined"
                sx={{ marginX: "0.4rem", marginY: "0.4rem" }}
                icon={<AddCircleOutlined />}
                label="Add"
                onClick={() => {
                  setChangeFn({ ex: change });
                  // setSelectedRoles();
                  setAccessDialog("privilege");
                  setCurrentUser({
                    email: rowMeta.rowData[0],
                    id: rowMeta.rowData[3],
                    selectedPrivileges: rowData,
                  });
                }}
              />
            </>
          ),
          []
        ),
      },
    },
    {
      name: "id",
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
                  // setEditing(true);
                  const { privilegeOptions } = rolePrivilegeOptions;
                  setCurrentUser({
                    email: rowData[0],
                    selectedRoles: rowData[1].reduce((acc, role) => {
                      role.access.forEach((accessItem) => {
                        acc.push({
                          label: `${role.role}-${
                            getAccessData(role.role, accessItem.access).name
                          }`,
                          value: `${role.role_id}-${accessItem.id}`,
                        });
                      });
                      return acc;
                    }, []),
                    selectedPrivileges: rowData[2].map((priv) => {
                      const privData = privilegeOptions.find(
                        (opt) => opt.value === priv.id
                      );
                      if (privData) {
                        return { label: privData.label, value: privData.value };
                      }
                      return { label: "Invalid Privelege", value: "0" };
                    }),
                  });

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
                  // handleOpen();
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
                        enqueueSnackbar("Role deleted successfully!", {
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

  useEffect(
    () => () => {
      //cleanup
      setAccessDialog(false);
      setCurrentUser({
        id: "",
        email: "",
        selectedRoles: [],
        selectedPrivileges: [],
      });
    },
    []
  );

  const handleClose = () => {
    setAccessDialog(false);
    setAccess({ role: "selectrole", access: "selectaccess", privilege: [] });
    setCurrentUser({
      id: "",
      email: "",
      selectedRoles: [],
      selectedPrivileges: [],
    });
    // setEditing(null);
  };

  // const handlePrivilegeChange = (newSelectedPrivileges) => {
  //   setSelectedPrivilages(newSelectedPrivileges);
  // };

  // const handleRoleChange = (selectedRoleMenu) => {
  //   // dispatch(showDialog({ title: "123" }));
  //   if (selectedRoleMenu.length < selectedRoles.length) {
  //     setSelectedRoles(selectedRoleMenu);
  //     return;
  //   }
  //   setAccess(
  //     selectedRoleMenu[selectedRoleMenu.length - 1].label.toLowerCase()
  //   );
  //   setAccessDialog(true);
  // };

  const setupUser = (user) => {
    let currentUserData = {};
    const roles = [];
    const privileges = [];
    console.log(user);
    user.userrole.forEach((roleData) => {
      if (roleData.role?.length > 0 && roleData.access)
        roles.push({
          access: roleData.access.filter(
            (accesObj) => accesObj.user_role_id === roleData.id
          ),
          role_id: roleData.id,
          role: `${toTitleCase(roleData.role[0].roles)}`,
        });
      if (roleData.privilege && roleData.privileges.length !== 0)
        privileges.push({
          id: roleData.privileges[0].id,
          privilege: toTitleCase(roleData.privileges[0].privilege),
        });
    });
    currentUserData = {
      id: user.id,
      email: user.email,
      roles,
      privileges,
    };
    console.log(currentUserData);
    return currentUserData;
  };

  const fetchByMailId = () => {
    axios
      .get(`${baseUrl}rolebaseaccess/email`)
      .then((response) => {
        const userList = response.data.map(setupUser);
        setUsers(userList);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const fetchRolesPrivileges = async () => {
    try {
      const roles = await axios.get(`${baseUrl}role/getRole`);
      const privilege = await axios.get(`${baseUrl}role/getPrivilege`);
      setRolePrivilegeOptions({
        roleOptions: roles.data.map((role) => ({
          label: `${toTitleCase(role.roles)}`,
          value: role.id,
        })),
        privilegeOptions: privilege.data.map((priv) => ({
          label: toTitleCase(priv.privilege),
          value: priv.id,
        })),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPartnerList = async () => {
    const partnerRes = await axios.get(`${baseUrl}partners`);
    const partnerList = partnerRes.data.data.map((partnerItem) => ({
      label: partnerItem.name,
      value: partnerItem.id,
    }));
    setOptionsData({ ...optionsData, partner: partnerList });
  };

  const updateAccess = (acc) => setAccess(acc);

  useEffect(() => {
    const fetch = async () => {
      await fetchPartnerList();
      fetchRolesPrivileges();
      fetchByMailId();
    };
    fetch();
  }, []);

  // const handleRoleChange = (selectedOptionRole) => {
  //   setSelectedOptionRole(selectedOptionRole);
  //   console.log(`Option selected:`, selectedOptionRole);
  // };

  // const handlePrivilagesChange = (selectedOptionPrivilages) => {
  //   setSelectedOptionPrivilages(selectedOptionPrivilages);
  //   console.log(`Option selected:`, selectedOptionPrivilages);
  // };

  const { roleOptions, privilegeOptions } = rolePrivilegeOptions;

  const createUserEmail = async () => {
    const alreadyExists =
      (await (
        await axios.get(`${baseUrl}rolebaseaccess/mail/${currentUser.email}`)
      ).data.length) !== 0;
    console.log(currentUser, users);
    if (alreadyExists) {
      enqueueSnackbar("Email Already Exists", { variant: "error" });
      return;
    }

    await axios.post(`${baseUrl}role/createUserEmail`, {
      email: currentUser.email,
    });
    const newUser = await (
      await axios.get(`${baseUrl}rolebaseaccess/mail/${currentUser.email}`)
    ).data[0];
    setEmailDialog(false);
    // setCurrentUser({})
    enqueueSnackbar("Added New Email", { variant: "success" });
    console.log(setupUser(newUser));
    setUsers([...users, setupUser(newUser)]);
    await fetchByMailId();
  };

  const getRoleData = (roleId) =>
    rolePrivilegeOptions.roleOptions.find(
      (roleItem) => roleId === roleItem.value
    );

  const getPrivilegeData = (privId) =>
    privilegeOptions.find((privItem) => privId === privItem.value);

  const createUserRolePrivilege = async (
    emailId,
    rolePrivilegeId,
    rolePrivilege = "roles"
  ) => {
    console.log(emailId, rolePrivilege, rolePrivilegeId);
    const newRole = await axios.post(`${baseUrl}role/createUserRole`, {
      chanakya_user_email_id: emailId,
      [rolePrivilege]: rolePrivilegeId,
    });
    return {
      [rolePrivilege === "roles" ? "role_id" : "id"]: newRole.data.id,
      [rolePrivilege === "roles" ? "role" : "privilege"]:
        rolePrivilege === "roles"
          ? getRoleData(newRole.data.roles).label
          : getPrivilegeData(newRole.data.privilege).label,
    };
  };

  const createAccess = async (accessList, roleId) => {
    const newAccess = await Promise.all(
      accessList.map(async (accessItem) => {
        const accessRes = await axios.post(
          `${baseUrl}role/createUserRoleAccess`,
          { user_role_id: roleId, access: accessItem.value }
        );
        return { id: accessRes.data.id, access: accessRes.data.access };
      })
    );
    return newAccess;
  };

  const assignRoles = async () => {
    const { selectedRoles } = currentUser;
    if (window.confirm("Are you sure to assign the mentioned roles?")) {
      try {
        const alreadyHasRole = selectedRoles.findIndex(
          (roleItem) => roleItem.role === getRoleData(access.role).label
        );
        console.log(access, selectedRoles, alreadyHasRole);
        let newRole;
        let newAccess;
        let updatedRoles;
        if (alreadyHasRole !== -1) {
          newRole = selectedRoles[alreadyHasRole];
          //async code for new access here
          newAccess = await createAccess(access.access, newRole.role_id);
          newRole.access = [
            ...newRole.access,
            ...newAccess.map((accessItem) => ({
              id: accessItem.id,
              user_role_id: newRole.role_id,
              access: accessItem.access,
            })),
          ];
          console.log(newRole);
          updatedRoles = [...selectedRoles];
          updatedRoles[alreadyHasRole] = newRole;
          // setSelectedRoles([]);
        } else {
          // async code for new Role
          newRole = await createUserRolePrivilege(
            currentUser.id,
            access.role,
            "roles"
          );
          // console.log()
          // async code for new access for that role
          newAccess = await createAccess(access.access, newRole.role_id);
          newRole.access = [
            ...newAccess.map((accessItem) => ({
              id: accessItem.id,
              user_role_id: newRole.role_id,
              access: accessItem.access,
            })),
          ];
          updatedRoles = [...selectedRoles, newRole];
        }
        changeFn.ex(updatedRoles);
        setAccess({ ...access, role: "selectrole", access: "selectaccess" });
        setAccessDialog(false);
        await fetchByMailId();
        enqueueSnackbar("Assigned Roles Successfully", { variant: "success" });
      } catch (e) {
        console.error(e);
        enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      }
    }
  };

  const assignPrivileges = async () => {
    if (window.confirm("Are you sure to assign the mentioned privileges?")) {
      console.log(access.privilege, currentUser.selectedPrivileges);
      try {
        const newPrivs = await Promise.all(
          access.privilege.map(
            async (privItem) =>
              await createUserRolePrivilege(
                currentUser.id,
                privItem.value,
                "privilege"
              )
          )
        );
        const updatedPrivs = [...currentUser.selectedPrivileges, ...newPrivs];
        console.log(updatedPrivs);
        changeFn.ex(updatedPrivs);
        setAccess({ ...access, privilege: [] });
        setAccessDialog(false);
        await fetchByMailId();
        enqueueSnackbar("Assigned Privileges Successfully", {
          variant: "success",
        });
      } catch (e) {
        console.error(e);
        enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      }
    }
  };

  const getDialogContent = (rolePrivilege) => {
    switch (rolePrivilege) {
      case "role":
        return (
          <Grid container sx={{ mY: "0.8rem" }} spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ pY: "0.4rem" }}>
                <InputLabel>Select Role</InputLabel>
                <MUISelect
                  fullWidth
                  label="Select Role"
                  placeholder="Select Role"
                  name="role-select"
                  value={access.role}
                  onChange={(ev) => {
                    updateAccess({
                      ...access,
                      access: "selectaccess",
                      role: ev.target.value,
                    });
                  }}
                >
                  <MenuItem disabled value="selectrole">
                    Select Role
                  </MenuItem>
                  {roleOptions.map((arrItem) => (
                    <MenuItem key={arrItem.value} value={arrItem.value}>
                      {arrItem.label}
                    </MenuItem>
                  ))}
                </MUISelect>
              </FormControl>
            </Grid>
            {access.role !== "selectrole" ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label>
                    <Typography variant="caption">
                      Select{" "}
                      {access.role === "selectRole" ? "Role" : access.role}
                    </Typography>
                  </label>
                  <Select
                    label={`Select ${access.role}`}
                    placeholder={`Select ${
                      roleOptions.find((opt) => opt.value === access.role).label
                    }`}
                    isMulti
                    onChange={(ev) => updateAccess({ ...access, access: ev })}
                    options={getOptions(access.role, currentUser.selectedRoles)}
                    menuPortalTarget={document.body}
                    value={access.access}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </FormControl>
              </Grid>
            ) : null}
          </Grid>
        );
      case "privilege":
        return (
          <Grid container sx={{ mY: "0.8rem" }} spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>
                  <Typography variant="caption">Select Privileges</Typography>
                </label>
                <Select
                  label="Select Privileges"
                  placeholder="Select Privileges"
                  isMulti
                  onChange={(ev) => updateAccess({ ...access, privilege: ev })}
                  options={privilegeOptions.filter((privItem) =>
                    currentUser.selectedPrivileges.findIndex(
                      (selPrivItem) => selPrivItem.id === privItem.value
                    )
                  )}
                  menuPortalTarget={document.body}
                  value={access.privilege}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return <div />;
    }
  };

  const options = {
    selectableRows: "none",
    responsive: "vertical",
    // textLabels: {
    //   body: {
    //     noMatch: loading ? (
    //       <Loader />
    //     ) : (
    //       "Sorry, there is no matching data to display"
    //     ),
    //   },
    // },
    customToolbar: React.useCallback(
      () => <NewCustomToolbar handleOpen={openEmailDialog} />,
      []
    ),
  };

  return (
    <Container maxWidth="xl">
      <MUIDataTable
        title="Role Based Access"
        data={users}
        columns={columns}
        options={options}
      />
      <Dialog fullWidth open={Boolean(accessDialog)} onClose={handleClose}>
        <DialogTitle>
          Select {accessDialog === "role" ? "Role" : "Privilege"}
        </DialogTitle>
        <DialogContent sx={{ pY: "0.8rem" }}>
          {getDialogContent(accessDialog)}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              accessDialog === "role"
                ? access.role === "selectrole" ||
                  access.access === "selectaccess"
                : access.privilege.length === 0
            }
            variant="contained"
            color="primary"
            onClick={accessDialog === "role" ? assignRoles : assignPrivileges}
          >
            Assign {accessDialog === "role" ? "Roles" : "Privileges"}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={emailDialog}
        onClose={() => setEmailDialog(false)}
      >
        <DialogTitle>Enter New Email</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="Enter Email"
            placeholder="Enter Email"
            variant="outlined"
            sx={{ mt: "0.4rem" }}
            // value={currentUser.email}
            onChange={debounce(
              (e) =>
                setCurrentUser({
                  ...currentUser,
                  email: e.target.value,
                }),
              500
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={createUserEmail}>
            Create User Email
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEmailDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>Give Access To -</DialogTitle> 
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
            <DialogTitle>
              Select{" "}
              {roleOptions.find((opt) => opt.value === access.role)?.label}
            </DialogTitle>
            <DialogContent sx={{ w: "50%" }}>
              <Container maxWidth="md" sx={{ p: "0.4rem" }}>
                <Autocomplete
                  options={getOptions(access.role, selectedRoles)}
                  disablePortal
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Id"
                placeholder="Email Id"
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </Grid>
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
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    // width: "100%",
                  }),
                }}
              />
            </Grid>
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
        </DialogContent> 
         <DialogActions>
          <Button
            variant="contained"
            color="primary"
            style={{
              margin: "0.4rem",
            }}
            onClick={() => {
              // const PartnerRole =
              //   selectedRolePartners.length > 0 &&
              //   `partner:${selectedRolePartners
              //     .map((role) => role.value)
              //     .join(",")}`;
              // const TPRole =
              //   selectedRoleTP.length > 0 &&
              //   `T&P:${selectedRoleTP.map((role) => role.value).join(",")}`;
              // const Role =
              //   PartnerRole === false
              //     ? [TPRole]
              //     : TPRole === false
              //     ? [PartnerRole]
              //     : [PartnerRole, TPRole];
              // if (editing) {
              //   axios
              //     .put(`${baseUrl}rolebaseaccess/email/update/${editing}`, {
              //       email: mail,
              //       roles: Role,
              //     })
              //     .then((res) => {
              //       if (res.status === 200) {
              //         snackbar.enqueueSnackbar(
              //           `Role Updated Successfully for ${mail}`,
              //           { variant: "success" }
              //         );
              //         setDialogOpen(false);
              //         setMail("");
              //         // setSelectedRolePartners([]);
              //         // setSelectedRoleTP([]);
              //         setSelectedPrivilages([]);
              //         setEditing(null);
              //       } else {
              //         snackbar.enqueueSnackbar("Something Went Wrong", {
              //           variant: "error",
              //         });
              //       }
              //     });
              // } else {
              //   axios
              //     .post(`${baseUrl}rolebaseaccess/email/add`, {
              //       email: mail,
              //       roles: Role,
              //     })
              //     .then((res) => {
              //       if (res.status === 200) {
              //         snackbar.enqueueSnackbar(
              //           `Role Assigned Successfully to ${mail}`,
              //           {
              //             variant: "success",
              //           }
              //         );
              //         setDialogOpen(false);
              //         setMail("");
              //         // setSelectedRolePartners([]);
              //         // setSelectedRoleTP([]);
              //         setSelectedPrivilages([]);
              //       } else {
              //         snackbar.enqueueSnackbar("Something Went Wrong", {
              //           variant: "error",
              //         });
              // }
              // });
              // }
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
       </Dialog> */}
    </Container>
  );
};

export default NewAdminPage;
