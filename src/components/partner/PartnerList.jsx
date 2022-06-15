import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, makeStyles } from "@mui/styles";
import axios from "axios";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import theme from "../../theme";
import ViewAssessments from "../assessment/ViewAssessments";
import PartnerLink from "./PartnerLink";
import EditPartner from "./EditPartner";
// eslint-disable-next-line import/no-named-as-default
import CreateAssessment from "../assessment/CreateAssessment";
import AddMerakiLink from "../smallComponents/AddMerakiLink";
import EditPartnerDetails from "../smallComponents/EditIcon";
import { changeFetching } from "../../store/slices/uiSlice";
import MainLayout from "../muiTables/MainLayout";
import ReportSend from "../report/ReportSend";
// import user from "../utils/user";
import NotHaveAccess from "../layout/NotHaveAccess";
import Loader from "../ui/Loader";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles(() => ({
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
  buttons: {
    display: "flex",
    gap: theme.spacing(2),
    margin: theme.spacing(2),
  },
}));

const columns = [
  {
    name: "id",
    label: "Edit Partner Details",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value) => <EditPartnerDetails value={value} />,
    },
  },
  {
    name: "id",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta) => {
        const name = rowMeta.rowData[3];
        return (
          <PartnerLink url={`/partner/${value}`} text={name} name={name} />
        );
      },
    },
  },

  {
    name: "notes",
    label: "View Assessments",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta) => (
        <ViewAssessments partnerId={rowMeta.rowData[0]} />
      ),
    },
  },
  {
    name: "name",
    label: "Create Assessment",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (rowData, rowMeta) => (
        <CreateAssessment
          partnerId={rowMeta.rowData[0]}
          partnerName={rowData}
        />
      ),
    },
  },
  {
    name: "id",
    label: "Joined Students Progress",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta) => {
        const name = rowMeta.rowData[3];
        return (
          <PartnerLink
            url={`/partner/${value}/progress`}
            text="Get Information"
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
        }
        return (
          <EditPartner
            columnIndex={rowMeta.columnIndex}
            partnerId={rowMeta.rowData[0]}
            name={rowMeta.rowData[3]}
            notes={rowMeta.rowData[2]}
            change={(event) => updateValue(event)}
          />
        );
      },
    },
  },

  {
    name: "meraki_link",
    label: "Meraki Link",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, rowMeta, updateValue) => (
        <AddMerakiLink
          isValue={value}
          studentId={rowMeta.rowData[0]}
          updateValue={updateValue}
        />
      ),
    },
  },
  {
    name: "id",
    label: "Send Report",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => <ReportSend partnerId={value} />,
    },
  },
];

const PartnerList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.auth);
  const { isFetching } = useSelector((state) => state.ui);
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [state, setState] = React.useState({
    data: [],
    access: null, //access object to store access data
    // userLoggedIn: user(), //user object to store user data
    partnerRouteConditon: false, //to check condition of partner route
  });

  const fetchAccess = async () => {
    try {
      const accessUrl = `${baseUrl}rolebaseaccess`;
      axios.get(accessUrl).then((response) => {
        const partnerData = response.data; //variable to store response data
        const conditions =
          partnerData &&
          loggedInUser &&
          loggedInUser.email &&
          partnerData.partners &&
          partnerData.partners.view &&
          partnerData.partners.view.includes(loggedInUser.email);
        setState((prevState) => ({
          ...prevState,
          access: partnerData || null, //set access data to state
          partnerRouteConditon: conditions,
        }));
      });
    } catch (e) {
      // console.error(e);
    }
  };

  const dataSetup = (data) => {
    setState((prevState) => ({ ...prevState, data }));
  };

  const fetchPartners = async () => {
    try {
      const dataURL = `${baseUrl}partners`;
      const response = await axios.get(dataURL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      dataSetup(response.data.data);
    } catch (e) {
      // fetchingFinish();
    }
  };

  useEffect(() => {
    (async () => {
      fetchingStart();
      await fetchAccess();
      await fetchPartners();
      fetchingFinish();
    })();
  }, []);

  return state.partnerRouteConditon ? (
    <Box>
      <ThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <div className={classes.buttons}>
            <Link to="/partner/add">
              <Button color="primary" variant="contained">
                Add Partner
              </Button>
            </Link>
          </div>
          <MainLayout
            title="Partners"
            columns={columns}
            data={state.data}
            showLoader={isFetching}
          />
        </div>
      </ThemeProvider>
    </Box>
  ) : isFetching ? (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "4rem",
      }}
    >
      <Typography variant="h3" style={{ marginBottom: "2.4rem" }}>
        Loading
      </Typography>
      <Loader />
      {isFetching.toString()}
    </Container>
  ) : (
    <NotHaveAccess />
  );
};

export default PartnerList;
