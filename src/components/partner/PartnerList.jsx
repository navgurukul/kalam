import React, { useEffect } from "react";
import { ThemeProvider, makeStyles } from "@mui/styles";
import axios from "axios";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import theme from "../../theme";
import ViewAssessments from "../assessment/ViewAssessments";
import PartnerLink from "./PartnerLink";
import EditPartner from "./EditPartner";
// eslint-disable-next-line import/no-named-as-default
import CreateAssessment from "../assessment/CreateAssessment";
import AddMerakiLink from "../smallComponents/AddMerakiLink";
import EditPartnerDetails from "../smallComponents/EditIcon";
import MainLayout from "../muiTables/MainLayout";
import ReportSend from "../report/ReportSend";

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
  const { privileges } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [partnerList, setPartnerList] = React.useState([]);

  const dataSetup = (data) => {
    setPartnerList(data);
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
      setLoading(true);
      await fetchPartners();
      setLoading(false);
    })();
  }, []);

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <div className={classes.buttons}>
            <Button
              disabled={
                !privileges.some((priv) => priv.privilege === "AddPartner")
              }
              color="primary"
              variant="contained"
              onClick={() => navigate("/partner/add")}
            >
              Add Partner
            </Button>
          </div>
          <MainLayout
            title="Partners"
            columns={columns}
            data={partnerList}
            showLoader={loading}
          />
        </div>
      </ThemeProvider>
    </Box>
  );
};

export default PartnerList;
