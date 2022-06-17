/* eslint-disable no-return-await */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Select, { components } from "react-select";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
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
  IconButton,
} from "@mui/material";
import { debounce } from "underscore";
import { AddCircleOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import ToolbarAddButton from "./ToolbarAddButton";
import { campus } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

const toTitleCase = (str) => `${str.charAt(0).toUpperCase()}${str.substr(1)}`;

export const setupUser = (user) => {
  let currentUserData = {};
  const roles = [];
  const privileges = [];
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
        id: roleData.id,
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

const CustomMVLabel = ({ children, ...rest }) => (
  <components.MultiValueLabel {...rest}>
    {children.name}
  </components.MultiValueLabel>
);

const CustomOption = ({ children, ...rest }) => (
  <components.Option {...rest}>
    {children.name} - {children.description}
  </components.Option>
);

const AdminPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  //States and Hooks
  const [users, setUsers] = useState([]);
  const [accessDialog, setAccessDialog] = useState(false);
  const [emailDialog, setEmailDialog] = useState(false);
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
    donor: [],
  });
  const [changeFn, setChangeFn] = React.useState({ ex: () => {} });

  //options for dropdowns
  const [rolePrivilegeOptions, setRolePrivilegeOptions] = React.useState({
    roleOptions: [],
    privilegeOptions: [],
  });

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
      case "donor":
        matchedItem = optionsData.donor.find(
          (donorItem) => donorItem.value === accessId
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
    const role = roleOptions.find((opt) => opt.value === roleId) || "";
    const exclusions = filterRoles.reduce(
      (acc, filterItem) =>
        role.label.name === filterItem.role
          ? [
              ...acc,
              ...filterItem.access.map((accessItem) => accessItem.access),
            ]
          : acc,
      []
    );
    switch (role?.label?.name.toLowerCase() || "") {
      case "campus":
        return campus
          .filter((campusItem) => !exclusions.includes(campusItem.id))
          .map((campusItem) => ({
            label: campusItem.name,
            value: campusItem.id,
          }));
      case "partner":
        return optionsData.partner.filter(
          (partnerItem) => !exclusions.includes(partnerItem.value)
        );

      case "donor":
        return optionsData.donor.filter(
          (donorItem) => !exclusions.includes(donorItem.value)
        );
      default:
        return [];
    }
  };

  const openEmailDialog = () => {
    setEmailDialog(true);
  };

  const deleteUserEmail = async (email, emailId) => {
    try {
      if (window.confirm(`Are you sure to delete ${email}?`)) {
        await axios.delete(`${baseUrl}role/deleteUserEmail/${emailId}`);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== emailId)
        );
        enqueueSnackbar(`${email} Deleted Successfully`, {
          variant: "success",
        });
      }
    } catch (e) {
      console.error(e);
      enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
    }
  };

  const deleteRolePrivilege = async (
    rowData,
    change,
    rolePrivilegeId,
    rolePrivilege = "Role"
  ) => {
    try {
      await axios.delete(`${baseUrl}role/deleteUserRole/${rolePrivilegeId}`);
      if (rolePrivilege === "Role") {
        ///
        change(
          rowData.filter((rowItem) => rowItem.role_id !== rolePrivilegeId)
        );
      } else {
        change(rowData.filter((rowItem) => rowItem.id !== rolePrivilegeId));
      }
      enqueueSnackbar(`${rolePrivilege} Deleted Successfully`, {
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
    }
  };

  const deleteUserAccess = async (rowData, change, accessObj) => {
    try {
      await axios.delete(`${baseUrl}role/deleteUserRoleAccess/${accessObj.id}`);
      change(
        rowData.map((role) => {
          const newRole = { ...role };
          newRole.access = role.access.filter(
            (accessItem) => accessItem.id !== accessObj.id
          );
          return newRole;
        })
      );
      enqueueSnackbar(
        `${accessObj.role}-${accessObj.name}Deleted Successfully`,
        {
          variant: "success",
        }
      );
    } catch (e) {
      console.error(e);
      enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
    }
  };

  const hasAccessObj = (role) =>
    !["admin", "dev"].some((roleItem) => role.toLowerCase() === roleItem);

  const columns = [
    { name: "email", label: "Email" },
    {
      name: "roles",
      label: "Roles",
      options: {
        filter: true,
        sort: false,
        customBodyRender: React.useCallback(
          (value, rowMeta, change) => (
            <>
              {value.map((item) =>
                hasAccessObj(item.role) ? (
                  item.access.map((accessItem) => (
                    <Chip
                      key={`${item} ${Math.random() * 10}`}
                      variant="filled"
                      label={`${item.role}-${
                        getAccessData(item.role, accessItem.access)?.name || ""
                      }`}
                      sx={{ marginX: "0.4rem", marginY: "0.2rem" }}
                      onDelete={() =>
                        deleteUserAccess(value, change, {
                          role: item.role,
                          name:
                            getAccessData(item.role, accessItem.access)?.name ||
                            "",
                          id: accessItem.id,
                        })
                      }
                    />
                  ))
                ) : (
                  <Chip
                    variant="filled"
                    label={`${item.role}`}
                    key={item.role_id}
                    sx={{ marginX: "0.4rem", marginY: "0.2rem" }}
                    onDelete={() =>
                      deleteRolePrivilege(value, change, item.role_id, "Role")
                    }
                  />
                )
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
        sort: false,
        customBodyRender: React.useCallback(
          (rowData, rowMeta, change) => (
            <>
              {rowData.map((privItem) => (
                <Chip
                  label={privItem.privilege}
                  key={privItem.id}
                  sx={{ marginX: "0.4rem", marginY: "0.2rem" }}
                  onDelete={() =>
                    deleteRolePrivilege(
                      rowData,
                      change,
                      privItem.id,
                      "Privilege"
                    )
                  }
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
        sort: false,
        customBodyRender: React.useCallback(
          (value, { rowData }) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <IconButton onClick={() => deleteUserEmail(rowData[0], value)}>
                <DeleteIcon
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                />
              </IconButton>
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

  const fetchByMailId = () => {
    axios
      .get(`${baseUrl}rolebaseaccess/email`)
      .then((response) => {
        const userList = response.data.reverse().map(setupUser);
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
          label: {
            name: `${toTitleCase(role.roles)}`,
            description: role.description,
          },
          value: role.id,
        })),
        privilegeOptions: privilege.data.map((priv) => ({
          label: {
            name: toTitleCase(priv.privilege),
            description: priv.description,
          },
          value: priv.id,
        })),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLists = async () => {
    const partnerRes = await axios.get(`${baseUrl}partners`);
    const partnerList = partnerRes.data.data.map((partnerItem) => ({
      label: partnerItem.name,
      value: partnerItem.id,
    }));
    const donorRes = await axios.get(`${baseUrl}donors`);
    const donorList = donorRes.data.map(({ id, donor: donorName }) => ({
      label: donorName,
      value: id,
    }));
    setOptionsData({ ...optionsData, partner: partnerList, donor: donorList });
  };

  const updateAccess = (acc) => setAccess(acc);

  useEffect(() => {
    const fetch = async () => {
      await fetchLists();
      fetchRolesPrivileges();
      fetchByMailId();
    };
    fetch();
  }, []);

  const { roleOptions, privilegeOptions } = rolePrivilegeOptions;

  const createUserEmail = async () => {
    const alreadyExists =
      (await (
        await axios.get(`${baseUrl}rolebaseaccess/mail/${currentUser.email}`)
      ).data.length) !== 0;
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
          (roleItem) => roleItem.role === getRoleData(access.role).label.name
        );
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
          updatedRoles = [...selectedRoles];
          updatedRoles[alreadyHasRole] = newRole;
        } else {
          // async code for new Role
          newRole = await createUserRolePrivilege(
            currentUser.id,
            access.role,
            "roles"
          );

          // async code for new access for that role
          if (hasAccessObj(newRole.role.name)) {
            newAccess = await createAccess(access.access, newRole.role_id);
            newRole.access = [
              ...newAccess.map((accessItem) => ({
                id: accessItem.id,
                user_role_id: newRole.role_id,
                access: accessItem.access,
              })),
            ];
          }
          updatedRoles = [
            ...selectedRoles,
            { ...newRole, role: newRole.role.name },
          ];
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
                  // renderValue={(value) => value.name}
                >
                  <MenuItem disabled value="selectrole">
                    Select Role
                  </MenuItem>
                  {roleOptions.map((arrItem) => (
                    <MenuItem key={arrItem.value} value={arrItem.value}>
                      {arrItem.label.name} - {arrItem.label.description}
                    </MenuItem>
                  ))}
                </MUISelect>
              </FormControl>
            </Grid>
            {access.role !== "selectrole" &&
            hasAccessObj(
              roleOptions.find((opt) => opt.value === access.role).label.name
            ) ? (
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
                    label={`Select ${access.role?.name}`}
                    placeholder={`Select ${
                      roleOptions.find((opt) => opt.value === access.role).label
                        .name
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
                  options={privilegeOptions.filter(
                    (privItem) =>
                      !currentUser.selectedPrivileges.some(
                        (selPrivItem) =>
                          selPrivItem.privilege === privItem.label
                      )
                  )}
                  components={{
                    MultiValueLabel: CustomMVLabel,
                    Option: CustomOption,
                  }}
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
    filter: false,
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
      () => <ToolbarAddButton handleOpen={openEmailDialog} />,
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
                  (hasAccessObj(
                    roleOptions.find((opt) => opt.value === access.role).label
                      .name
                  ) &&
                    access.access === "selectaccess")
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
    </Container>
  );
};

export default AdminPage;
