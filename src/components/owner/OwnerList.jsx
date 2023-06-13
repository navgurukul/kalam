/* eslint-disable no-use-before-define */
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton } from "@mui/material";
import theme from "../../theme";
import {
  fetchUsers as fetchUsersAction,
  fetchOwners as fetchOwnersAction,
  setOwnerData,
  deleteOwner as deleteOwnerAction,
} from "../../store/slices/ownerSlice";
import MainLayout from "../muiTables/MainLayout";
import AddOwner from "./AddOwner";
import OwnerSchedule from "./OwnerSchedule";
import { closeDialog, showDialog } from "../../store/slices/uiSlice";

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
  const { loggedInUser, privileges } = useSelector((state) => state.auth);
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
          const user = loggedInUser?.mail_id || null;
          const canUpdate =
            privileges.some((priv) => priv.privilege === "UpdateOwner") ||
            rowMeta.rowData[1] === user;
          const canDelete =
            (privileges.some((priv) => priv.privilege === "DeleteOwner") ||
              rowMeta.rowData[1] === user) &&
            rowMeta.rowData[4] === 0;

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
                updateOwners={updateOwners}
              />

              <IconButton
                disabled={!canDelete}
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
                  color={!canDelete ? "" : "error"}
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
          if (value === 1) return "Female";
          if (value === 2) return "Male";
          if (value === 3) return "Transgender";
          return "N/A";
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
  ];

  useEffect(() => {
    dispatch(fetchOwnersAction());
    dispatch(fetchUsersAction());
  }, []);

  const updateOwners = (data, isEdit) => {
    if (isEdit) {
      const newData = [...ownerData];
      const updatedOwnerInd = newData.findIndex((x) => x.id === data.id);
      const updatedOwner = { ...newData[updatedOwnerInd] };

      updatedOwner.available = data.available;
      updatedOwner.type = data.type;
      updatedOwner.max_limit = data.max_limit;
      updatedOwner.gender = data.gender;
      newData[updatedOwnerInd] = updatedOwner;
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
      dispatch(setOwnerData([data, ...ownerData]));
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
            <AddOwner
              disabled={
                !privileges.some((priv) => priv.privilege === "AddOwner")
              }
              updateOwners={updateOwners}
              ownerData={ownerData}
            />
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
            scheduleOpen={scheduleOpen}
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
