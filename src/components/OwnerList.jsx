/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { Box, DialogTitle, DialogActions, Dialog, Button } from "@mui/material";
import theme from "../theme";
import MainLayout from "./MainLayout";
import AddOwner from "./AddOwner";
// import AddOwnerSchedule from "./AddOwnerSchedule";

const baseUrl = import.meta.env.VITE_API_URL;
const { permissions } = require("../config");

const useStyles = makeStyles(() => ({
  innerTable: {
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "80vw",
    marginTop: "5",
    marginBottom: "5",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      marginTop: 5,
      marginBottom: 5,
    },
  },
}));

const stagesColor = {
  defaultValue: "#F0E5D8",
  EnglishInterview: "#FFC478",
  AlgebraInterview: "#EFB7B7",
  CultureFitInterview: "#75CFB8",
};

const OwnerList = () => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    data: [],
    interviewData: [],
    showLoader: true,
    showModal: false,
    ownerId: null,
  });
  const columns = [
    {
      name: "id",
      label: "Edit",
      options: {
        filter: true,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta) => {
          const user = window.localStorage.user
            ? JSON.parse(window.localStorage.user).email
            : null;
          //const update = !permissions.updateStage.includes(user);
          const canUpdate =
            permissions.updateStage.includes(user) ||
            rowMeta.rowData[1] === user.split("@")[0];
          //console.log(rowMeta);
          return (
            <div
              style={{
                display: "flex",
                margin: "10px",
                justifyContent: "space-between",
              }}
            >
              <AddOwner
                ownerId={value}
                isEdit
                disabled={!canUpdate}
                getUpdatedData={getUpdatedData}
              />
              {rowMeta.rowData[3] ? null : (
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setState({ ...state, showModal: true, ownerId: value })
                  }
                />
              )}
            </div>
          );
        }, []),
      },
    },
    {
      name: "user.mail_id",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          //console.log("value", value);
          if (value === 1) return "Female";
          if (value === 2) return "Male";
          if (value === 3) return "Transgender";
          return "NA";
        },
      },
    },
    {
      name: "available",
      label: "Available",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => (value ? "Yes" : "No"),
      },
    },
    {
      name: "pending_interview_count",
      label: "Pending Interviews",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "type",
      label: "Interview Types",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) =>
          value.map((v) => {
            if (stagesColor[v]) {
              return (
                <p
                  key={v}
                  style={{
                    backgroundColor: stagesColor[v],
                    textAlign: "center",
                    borderRadius: "75px",
                  }}
                >
                  {" "}
                  {v}{" "}
                </p>
              );
            }
            return (
              <p
                key={v}
                style={{
                  backgroundColor: stagesColor.defaultValue,
                  textAlign: "center",
                  borderRadius: "75px",
                }}
              >
                {" "}
                {v}{" "}
              </p>
            );
          }),
      },
    },
    {
      name: "max_limit",
      label: "Assigned Interviews Limit",
      options: {
        filter: false,
        sort: true,
      },
    },
    // {
    //   name: "schedule",
    //   label: "Interview Schedule",
    //   options: {
    //     filter: false,
    //     display: false,

    //     sort: false,
    //     customBodyRender: (value, { rowData }) => {
    //       const user = window.localStorage.user
    //         ? JSON.parse(window.localStorage.user).email
    //         : null;
    //       //const update = !permissions.updateStage.includes(user);
    //       const canUpdate =
    //         permissions.updateStage.includes(user) ||
    //         rowData[1] === user.split("@")[0];
    //       //console.log(value,rowData);

    //       return (
    //         <div
    //           style={{
    //             display: "flex",
    //             margin: "10px",
    //             justifyContent: "space-between",
    //           }}
    //         >
    //           <AddOwnerSchedule
    //             updateData={updateData}
    //             ownerId={rowData[0]}
    //             prevSchedule={value}
    //             isEdit={value !== undefined}
    //             disabled={!canUpdate}
    //           />
    //           {/* {value?value.from+" "+value.to:<button disabled={!canUpdate}>
    //           Set Availibility
    //           </button>} */}
    //         </div>
    //       );
    //     },
    //   },
    // },
  ];

  useEffect(() => {
    const fetchData = async () => fetchOwners();
    fetchData();
  }, []);

  const fetchOwners = async () => {
    const dataURL = `${baseUrl}owner`;
    const response = await axios.get(dataURL);
    const { data } = response.data;

    // const interviewDataURL = `${baseUrl  }ownershedule`;
    // const interviewResponse = await axios.get(interviewDataURL);
    // const { data: interviewData } = interviewResponse.data;

    // const newData = await data.map((owner) => {
    //   let newOwner = { ...owner };
    //   let ownerInterview = interviewData.find(
    //     (iData) => iData.owner_id === owner.id
    //   );
    //   if (ownerInterview) {
    //     newOwner["schedule"] = ownerInterview;
    //   }
    //   return newOwner;
    // });
    setState({
      ...state,
      data,
      // interviewData: interviewResponse.data.data,
      showLoader: false,
    });
    //console.log(interviewData);
  };

  // const updateData = () => {
  //   fetchOwners();
  // };

  const getUpdatedData = (data, isEdit) => {
    let newData = [...state.data];
    if (isEdit) {
      newData = newData.map((x) => {
        const nUser = { ...x };
        if (x.user.mail_id === data.user.mail_id) {
          nUser.available = data.available;
          nUser.type = data.type;
          nUser.max_limit = data.max_limit;
          nUser.gender = data.gender;
        }
        return nUser;
      });
      setState({
        ...state,
        data: newData,
      });
    } else {
      setState({
        ...state,
        data: [data, ...state.data],
      });
    }
  };

  const deleteOwner = (ownerId) => {
    const { data } = state;
    axios.delete(`${baseUrl}owner/${ownerId}`).then(() => {
      snackbar.enqueueSnackbar("Owner  successfully deleted", {
        variant: "success",
      });
      const newData = data.filter((x) => x.id !== ownerId);
      setState({
        ...state,
        data: newData,
        showModal: false,
      });
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      showModal: false,
    });
  };
  const { showModal, ownerId, data, showLoader } = state;
  return (
    <Box mt={2}>
      <ThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <AddOwner getUpdatedData={getUpdatedData} ownerData={data} />
          <MainLayout
            title="Owners"
            columns={columns}
            data={data}
            showLoader={showLoader}
          />
          <Dialog
            open={showModal}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {" "}
              Do you want to delete owner ??
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => deleteOwner(ownerId)} color="primary">
                YES
              </Button>
              <Button onClick={handleClose} color="primary">
                NO
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </ThemeProvider>
    </Box>
  );
};

export default OwnerList;
