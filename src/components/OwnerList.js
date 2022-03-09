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
            console.log("value", value);
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
            return value.map((v) => {
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
    console.log("data", data);
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
    this.setState({ data: response.data.data, showLoader: false });
  }
}

export default withSnackbar(withRouter(withStyles(styles)(OwnerList)));
