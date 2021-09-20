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

const columns = [
  {
    name: "id",
    label: "Edit",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value) => {
        return <AddOwner ownerId={value} isEdit={true} />;
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
    label: "Interviews Assigned",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        return value.map((v) => `${v} `);
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

export class PartnerList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  getUpdatedData = (data) => {
    this.setState({
      data: [...this.state.data.data],
    });
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
              title={"Owner"}
              columns={columns}
              data={this.state.data}
              showLoader={true}
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
    this.setState({ data: response.data.data });
  }
}

export default withRouter(withStyles(styles)(PartnerList));
