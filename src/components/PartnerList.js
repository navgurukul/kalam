import React from "react";
import { forwardRef } from "react";

import { connect } from "react-redux";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";

import axios from "axios";
import { Box, Link } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { theme } from "../theme/theme";

import ViewAssessments from "./ViewAssessments";
import PartnerLink from "./PartnerLink";
import EditPartner from "./EditPartner";
import CreateAssessment from "./CreateAssessment";
import AddMerakiLink from "./AddMerakiLink";
import EditPartnerDetails from "./EditIcon";

import { changeFetching } from "../store/actions/auth";
import { withRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

const baseUrl = process.env.API_URL;

const styles = (theme) => ({
  innerTable: {
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
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
    label: "Edit Partner Details",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        return <EditPartnerDetails value = {value}/>
      },
    },
  },
  {
    name: "id",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        let name = rowMeta.rowData[3];
        return <PartnerLink url={`partner/${value}`} text={name} name={name} />;
      },
    },
  },

  {
    name: "notes",
    label: "View Assessments",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta) => {
        return <ViewAssessments partnerId={rowMeta.rowData[0]} />;
      },
    },
  },
  {
    name: "name",
    label: "Create Assessment",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (rowData, rowMeta, updateValue) => {
        return (
          <CreateAssessment
            partnerId={rowMeta.rowData[0]}
            partnerName={rowData}
          />
        );
      },
    },
  },
  {
    name: "id",
    label: "Joined Students Progress",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta) => {
        let name = rowMeta.rowData[3];
        return (
          <PartnerLink
            url={`partner/${value}/progress`}
            text={"Get Information"}
            name={name}
          />
        );
      },
    },
  },
  {
    name: "slug",
    label: "Online Test For Partner",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta, updateValue) => {
        if (value) {
          const url = `/partnerLanding/${value}`;
          return (
            <div>
              <a href={url} target="_blank" style={{ color: "#f05f40" }}>
                Go for test
              </a>
            </div>
          );
        } else {
          return (
            <EditPartner
              columnIndex={rowMeta.columnIndex}
              partnerId={rowMeta.rowData[0]}
              name={rowMeta.rowData[3]}
              notes={rowMeta.rowData[2]}
              change={(event) => updateValue(event)}
            />
          );
        }
      },
    },
  },

  {
    name: "meraki_link",
    label: "Meraki Link",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta, updateValue) => {
        return (
          <AddMerakiLink
            isValue={value}
            studentId={rowMeta.rowData[0]}
            updateValue={updateValue}
          />
        );
      },
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

  onRowClick = (event, rowData) => {
    this.props.history.push("/partner/" + rowData.id + "/students");
  };

  dataSetup = (data) => {
    this.setState({ data: data }, function () {
      this.props.fetchingFinish();
    });
  };

  render = () => {
    const { classes } = this.props;
    if (!this.state.data.length) {
      return <Box></Box>;
    }
    return (
      <Box>
        <MuiThemeProvider theme={theme}>
          <div className={classes.innerTable}>
            <MainLayout
              title={"Partners"}
              columns={columns}
              data={this.state.data}
            />
          </div>
        </MuiThemeProvider>
      </Box>
    );
  };

  componentDidMount() {
    this.fetchPartners();
  }

  async fetchPartners() {
    try {
      this.props.fetchingStart();
      const dataURL = baseUrl + "partners";
      const response = await axios.get(dataURL);
      this.dataSetup(response.data.data);
    } catch (e) {
      this.props.fetchingFinish();
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withRouter(
  withStyles(styles)(connect(undefined, mapDispatchToProps)(PartnerList))
);
