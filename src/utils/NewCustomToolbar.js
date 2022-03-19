import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Dialog, Snackbar } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import { useSnackbar } from "notistack";
import axios from "axios";

const NewCustomToolbar = (props) => {
  //BaseURL
  const baseUrl = process.env.API_URL;

  //Snackbar
  const snackbar = useSnackbar();

  //States and Hooks
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roleMenu, setRoleMenu] = useState("");
  const [mail, setMail] = useState("");
  const [selectedRolePartners, setSelectedRolePartners] = useState([]);
  const [selectedRoleTP, setSelectedRoleTP] = useState([]);
  const [selectedPrivilages, setSelectedPrivilages] = useState([]);

  //options for dropdowns
  const options = [
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

  //event handlers
  const handleRoleChangePartners = (selectedRole) => {
    setSelectedRolePartners(selectedRole);
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

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
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
  const { classes } = props;
  return (
    <React.Fragment>
      <Tooltip title={"custom icon"}>
        <IconButton>
          <Fragment>
            <Box onClick={handleOpen}>
              <AddIcon />
            </Box>
            <Dialog open={dialogOpen} onClose={handleClose}>
              <form>
                <h1
                  style={{
                    color: "#f05f40",
                    textAlign: "center",
                    marginTop: "0px",
                    position: "relative",
                    bottom: "20px",
                  }}
                >
                  Give Access To -
                </h1>

                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <label htmlFor="email">Email Id</label>
                    <input
                      type="email"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                      style={{
                        width: "50%",
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="role">Roles</label>
                    <Select
                      placeholder={"Role Menu"}
                      value={roleMenu}
                      onChange={handleRoleMenuChange}
                      options={RoleMenuOptions}
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
                  </div>
                  {roleMenu.value === "partner" && (
                    <div>
                      <label
                        htmlFor="role"
                        style={{
                          marginTop: "40px",
                        }}
                      >
                        Partners
                      </label>
                      <Select
                        placeholder={"Select Particular Partners"}
                        value={selectedRolePartners}
                        onChange={handleRoleChangePartners}
                        isMulti={true}
                        options={options}
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
                    </div>
                  )}
                  {roleMenu.value === "t&p" && (
                    <div>
                      <label
                        htmlFor="t&p"
                        style={{
                          marginTop: "40px",
                        }}
                      >
                        T & P
                      </label>
                      <Select
                        placeholder={"Select Particular T&P"}
                        value={selectedRoleTP}
                        onChange={handleRoleChangeTP}
                        isMulti={true}
                        options={options}
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
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <label htmlFor="privilage">Privilage</label>
                    <Select
                      placeholder={"Select Privilage"}
                      value={selectedPrivilages}
                      onChange={handlePrivilagesChange}
                      isMulti={true}
                      // options={PrivilageOptions}
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
                  </div>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                  onClick={() => {
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
                  }}
                >
                  Submit
                </Button>
              </form>
            </Dialog>
          </Fragment>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};

export default NewCustomToolbar;
