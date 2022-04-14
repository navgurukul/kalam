/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton } from "@mui/material";
import theme from "../theme";
import {
  fetchOwners as fetchOwnersAction,
  setOwnerData,
  deleteOwner as deleteOwnerAction,
} from "../store/slices/ownerSlice";
import MainLayout from "./MainLayout";
import AddOwner from "./AddOwner";
import OwnerSchedule from "./OwnerSchedule";
import { closeDialog, showDialog } from "../store/slices/uiSlice";
// import AddOwnerSchedule from "./AddOwnerSchedule";

// const baseUrl = import.meta.env.VITE_API_URL;
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
  buttons: {
    display: "flex",
    gap: theme.spacing(2),
    margin: theme.spacing(2),
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
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const { ownerData } = useSelector((state) => state.owners);
  const { isFetching } = useSelector((state) => state.ui);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const columns = [
    {
      name: "id",
      label: "Edit",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value, rowMeta) => {
          const user = (loggedInUser && loggedInUser.mail_id) || null;
          //const update = !permissions.updateStage.includes(user);
          const canUpdate =
            permissions.updateStage.includes(user) ||
            rowMeta.rowData[1] === user;
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

              <IconButton
                disabled={rowMeta.rowData[3]}
                onClick={() =>
                  dispatch(
                    showDialog({
                      title: `Do you want to delete owner ${rowMeta.rowData[1].mail_id} ??`,
                      actions: (
                        <Button
                          onClick={() => {
                            deleteOwner(value);
                            dispatch(closeDialog());
                          }}
                          color="primary"
                          variant="contained"
                        >
                          Confirm
                        </Button>
                      ),
                    })
                  )
                }
              >
                <DeleteIcon
                  color={rowMeta.rowData[3] ? "" : "error"}
                  style={{ cursor: "pointer" }}
                />
              </IconButton>
            </div>
          );
        }, []),
      },
    },
    {
      name: "user",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (rowData) => rowData.mail_id,
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
    const fetchData = async () => dispatch(fetchOwnersAction());
    fetchData();
  }, []);

  const getUpdatedData = (data, isEdit) => {
    let newData = [...ownerData];
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
      // setState({
      //   ...state,
      //   data: newData,
      // });
      dispatch(setOwnerData(newData));
    } else {
      // setState({
      //   ...state,
      //   data: [data, ...state.data],
      // });
      dispatch(setOwnerData([data, ownerData]));
    }
  };

  const deleteOwner = (ownerId) => {
    // const { data } = state;
    // axios.delete(`${baseUrl}owner/${ownerId}`).then(() => {
    //   snackbar.enqueueSnackbar("Owner  successfully deleted", {
    //     variant: "success",
    //   });
    //   const newData = data.filter((x) => x.id !== ownerId);
    //   setState({
    //     ...state,
    //     data: newData,
    //     showModal: false,
    //   });
    // });
    dispatch(deleteOwnerAction({ ownerId }));
  };

  return (
    <Box mt={2}>
      <ThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <div className={classes.buttons}>
            <AddOwner getUpdatedData={getUpdatedData} ownerData={ownerData} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setScheduleOpen(true)}
              className={classes.btn}
            >
              Interview Schedule
            </Button>
          </div>
          <OwnerSchedule
            setScheduleOpen={setScheduleOpen}
            ScheduleOpen={scheduleOpen}
          />
          <MainLayout
            title="Owners"
            columns={columns}
            data={ownerData}
            showLoader={isFetching}
          />
        </div>
      </ThemeProvider>
    </Box>
  );
};

export default OwnerList;
