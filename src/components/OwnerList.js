import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import { Box } from "@material-ui/core";
import { theme } from "../theme/theme";
import { withRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import AddOwner from "./AddOwner";

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

export class PartnerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showLoader: true,
    };
    this.columns = [
      {
        name: "id",
        label: "Edit",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return (
              <AddOwner
                ownerId={value}
                isEdit={true}
                getUpdatedData={this.getUpdatedData}
              />
            );
          },
        },
      },
      {
        name: "user.user_name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
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

  render = () => {
    const { classes } = this.props;
    return (
      <Box mt={2}>
        <MuiThemeProvider theme={theme}>
          <div className={classes.innerTable}>
            <AddOwner
              getUpdatedData={this.getUpdatedData}
              ownerData={this.state.data}
            />
            <MainLayout
              title={"Owners"}
              columns={this.columns}
              data={this.state.data}
              showLoader={this.state.showLoader}
            />
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

export default withRouter(withStyles(styles)(PartnerList));
