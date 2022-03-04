import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { ThemeProvider } from "@material-ui/styles";

import axios from "axios";
import { Box } from "@material-ui/core";

import { theme } from "../theme/theme";

import ViewAssessments from "./ViewAssessments";
import PartnerLink from "./PartnerLink";
import EditPartner from "./EditPartner";
import CreateAssessment from "./CreateAssessment";
import AddMerakiLink from "./AddMerakiLink";
import EditPartnerDetails from "./EditIcon";

import { changeFetching } from "../store/actions/auth";
import MainLayout from "./MainLayout";
import ReportSend from "./ReportSend";
import user from "../utils/user";
import NotHaveAccess from "./NotHaveAccess";
import { makeStyles } from "@material-ui/styles";
const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
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
}));

const columns = [
  {
    name: "id",
    label: "Edit Partner Details",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => {
        return <EditPartnerDetails value={value} />;
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
      customBodyRender: (rowData, rowMeta) => {
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
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "#f05f40" }}
              >
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
  {
    name: "id",
    label: "Send Report",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        return <ReportSend partnerId={value} />;
      },
    },
  },
];

const PartnerList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  // const history = useHistory();
  const [state, setState] = React.useState({
    data: [],
    access: null, //access object to store access data
    userLoggedIn: user(), //user object to store user data
    partnerRouteConditon: false, //to check condition of partner route
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchPartners();
      await fetchAccess();
    };
    fetchData();
  }, []);

  const fetchAccess = async () => {
    try {
      const accessUrl = baseUrl + "rolebaseaccess";
      axios.get(accessUrl).then((response) => {
        const partnerData = response.data; //variable to store response data
        const conditions =
          partnerData &&
          state.userLoggedIn &&
          state.userLoggedIn.email &&
          partnerData.partners &&
          partnerData.partners.view &&
          partnerData.partners.view.includes(state.userLoggedIn.email);
        setState((prevState) => ({
          ...prevState,
          access: partnerData ? partnerData : null, //set access data to state
          partnerRouteConditon: conditions,
        }));
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPartners = async () => {
    try {
      fetchingStart();
      const dataURL = baseUrl + "partners";
      const response = await axios.get(dataURL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      dataSetup(response.data.data);
    } catch (e) {
      fetchingFinish();
    }
  };

  // const onRowClick = (event, rowData) => history.push("/partner/" + rowData.id + "/students");

  const dataSetup = (data) => {
    setState((prevState) => ({ ...prevState, data }));
    fetchingFinish();
  };

  if (!state.data.length) {
    return <Box></Box>;
  }
  console.log(state);
  return (
    <div>
      {state.partnerRouteConditon ? (
        <Box>
          <ThemeProvider theme={theme}>
            <div className={classes.innerTable}>
              <MainLayout
                title={"Partners"}
                columns={columns}
                data={state.data}
              />
            </div>
          </ThemeProvider>
        </Box>
      ) : (
        <NotHaveAccess />
      )}
    </div>
  );
};

export default PartnerList;
