import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import {
  Box,
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
} from "@material-ui/core";
import { theme } from "../theme/theme";
import { withRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import AddOwner from "./AddOwner";
import DeleteIcon from "@material-ui/icons/Delete";
import { withSnackbar } from "notistack";
import {permissions} from '../config'
import AddOwnerSchedule from "./AddOwnerSchedule";

const baseUrl = process.env.API_URL;

const styles = (theme) => ({
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
});

const stagesColor = {
  defaultValue: "#F0E5D8",
  EnglishInterview: "#FFC478",
  AlgebraInterview: "#EFB7B7",
  CultureFitInterview: "#75CFB8",
};

export class OwnerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      interviewData:[],
      showLoader: true,
      showModal: false,
      ownerId: null,
    };
    this.columns = [
      {
        name: "id",
        label: "Edit",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, rowMeta) => {
            const user = window.localStorage.user
            ? JSON.parse(window.localStorage.user).email
            : null;
            //const update = !permissions.updateStage.includes(user);
            const canUpdate = permissions.updateStage.includes(user) || rowMeta.rowData[1] === user.split("@")[0];
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
                  isEdit={true}
                  disabled={!canUpdate}
                  getUpdatedData={this.getUpdatedData}
                />
                {rowMeta.rowData[3] ? null : (
                  <DeleteIcon
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      this.setState({ showModal: true, ownerId: value })
                    }
                  />
                )}
              </div>
            );
          },
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
            else if (value === 2) return "Male";
            else if (value === 3) return "Transgender";
            else return "NA";
          },
        },
      },
      {
        name: "available",
        label: "Available",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return value ? "Yes" : "No";
          },
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
          customBodyRender: (value) => {
            return value.map((v,inx) => {
              if (stagesColor[v]) {
                return (
                  <p
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
                  key={inx} 
                  style={{
                    backgroundColor: stagesColor["defaultValue"],
                    textAlign: "center",
                    borderRadius: "75px",
                  }}
                >
                  {" "}
                  {v}{" "}
                </p>
              );
            });
          },
        }
      },
      {
        name: "max_limit",
        label: "Assigned Interviews Limit",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        name: "schedule",
        label: "Interview Schedule",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, {rowData}) =>{
            const user = window.localStorage.user
            ? JSON.parse(window.localStorage.user).email
            : null;
            //const update = !permissions.updateStage.includes(user);
            const canUpdate = permissions.updateStage.includes(user) || rowData[1] === user.split("@")[0];
            console.log(value,rowData);

            return (
              <div
                style={{
                  display: "flex",
                  margin: "10px",
                  justifyContent: "space-between",
                }}
              >
                <AddOwnerSchedule updateData={this.updateData} ownerId={rowData[0]} prevSchedule={value} isEdit={value!==undefined} disabled={!canUpdate} />
              {/* {value?value.from+" "+value.to:<button disabled={!canUpdate}>
              Set Availibility
              </button>} */}
              </div>
            );
          }
        },
      }
    ];
  }

  updateData = () => {
    this.fetchOwners();
  }

  getUpdatedData = (data, isEdit) => {
    let newData = [...this.state.data];
    if (isEdit) {
      newData = newData.map((x) => {
        if (x.user.mail_id === data.user.mail_id) {
          x.available = data.available;
          x.type = data.type;
          x.max_limit = data.max_limit;
          x.gender = data.gender;
        }
        return x;
      });
      this.setState({
        data: newData,
      });
    } else {
      this.setState({
        data: [data, ...this.state.data],
      });
    }
  };

  deleteOwner = (ownerId) => {
    const { data } = this.state;
    axios.delete(`${baseUrl}owner/${ownerId}`).then(() => {
      this.props.enqueueSnackbar("Owner  successfully deleted", {
        variant: "success",
      });
      const newData = data.filter((x) => x.id !== ownerId);
      this.setState({
        data: newData,
        showModal: false,
      });
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false,
    });
  };
  render = () => {
    const { classes } = this.props;
    const { showModal, ownerId, data, showLoader } = this.state;
    return (
      <Box mt={2}>
        <MuiThemeProvider theme={theme}>
          <div className={classes.innerTable}>
            <AddOwner getUpdatedData={this.getUpdatedData} ownerData={data} />
            <MainLayout
              title={"Owners"}
              columns={this.columns}
              data={data}
              showLoader={showLoader}
            />
            <Dialog
              open={showModal}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {" "}
                Do you want to delete owner ??
              </DialogTitle>
              <DialogActions>
                <Button
                  onClick={() => this.deleteOwner(ownerId)}
                  color="primary"
                >
                  YES
                </Button>
                <Button onClick={this.handleClose} color="primary">
                  NO
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </MuiThemeProvider>
      </Box>
    );
  };

  componentDidMount() {
    this.fetchOwners();
  }

  async fetchOwners() {
    const dataURL = baseUrl + "owner";
    const response = await axios.get(dataURL);
    const {data} = response.data;

    const interviewDataURL = baseUrl + "ownershedule";
    const interviewResponse = await axios.get(interviewDataURL);
    const {data: interviewData} = interviewResponse.data;

    const newData = await data.map((owner) => {
      let newOwner = {...owner};
      let ownerInterview = interviewData.find((iData) => iData.owner_id === owner.id);
      if (ownerInterview){
        newOwner['schedule'] = ownerInterview;
      }
      return newOwner;      
    }) 
    this.setState({ data: newData,interviewData:interviewResponse.data.data, showLoader: false });
    console.log(interviewData);
  }
}

export default withSnackbar(withRouter(withStyles(styles)(OwnerList)));
