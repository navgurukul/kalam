import React from "react";
import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { makeStyles } from "@mui/styles";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { Link } from "react-router-dom";
import CsvUpload from "../smallComponents/Uploadcsv";
import { tableIcons } from "../../services/GlobalService";

const baseUrl = import.meta.env.VITE_API_URL;

const getModalStyle = () => {
  const top = 54; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "80vh",
    width: "75%",
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
}));

const ModalStages = ({ partnerId }) => {
  const classes = useStyles();
  const [assesstmentData, setAssessmentData] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const columns = [
    {
      label: "ID",
      name: "id",
      options: {
        filter: false,
      },
    },
    {
      label: "Name",
      name: "name",
      options: {
        filter: false,
      },
    },
    {
      label: "Assessment URL",
      name: "assessment_url",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (rowData) =>
            rowData ? (
              <a target="_blank" rel="noreferrer" href={rowData}>
                <Button variant="text" size="small" color="primary">
                  Link to Assessment
                </Button>
              </a>
            ) : null,
          []
        ),
      },
    },
    {
      label: "Answer Key URL",
      name: "answer_key_url",
      options: {
        filter: false,
        customBodyRender: React.useCallback((rowData) =>
          rowData
            ? ((
                <a target="_blank" rel="noreferrer" href={rowData}>
                  <Button variant="text" size="small" color="primary">
                    Link to Answer Key
                  </Button>
                </a>
              ),
              [])
            : null
        ),
      },
    },
    {
      label: "Question Set ID",
      name: "question_set_id",
      options: {
        filter: false,
        customBodyRender: React.useCallback((rowData) => {
          const url = `/partner/${partnerId}/assessments/${rowData}`;
          return (
            <Link to={url}>
              <Button variant="text" color="primary" size="small">
                {rowData}
              </Button>
            </Link>
          );
        }, []),
      },
    },
    {
      label: "Created At",
      name: "created_at",
      options: {
        filter: false,
      },
    },
    {
      label: "Upload Data",
      name: "partner_id",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (rowData, rowMeta) => (
            <CsvUpload partnerId={rowData} assessmentId={rowMeta.rowData[0]} />
          ),
          []
        ),
      },
    },
  ];

  const toggleModal = () => setModalOpen((prev) => !prev);

  const fetchAssessments = async () => {
    try {
      const dataURL = `${baseUrl}partners/${partnerId}/assessments`;
      const response = await axios.get(dataURL);
      setAssessmentData(response.data.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleOpen = () => {
    fetchAssessments();
    toggleModal();
  };

  const modalStyle = getModalStyle();

  return !modalOpen ? (
    <Button color="primary" align="right" onClick={handleOpen}>
      <AssessmentIcon color="primary" />
      &nbsp;&nbsp;
    </Button>
  ) : (
    <Modal open={modalOpen} onClose={toggleModal}>
      <Box style={modalStyle} className={classes.paper}>
        {/* <Typography
          variant="h5"
          id="modal-title"
          // style={{ backgroundColor: "red" }}
        >
          View Assessments
          <br />
        </Typography> */}

        <MUIDataTable
          title="View Assessments"
          columns={columns}
          data={assesstmentData}
          icons={tableIcons}
          options={{
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            selectableRows: "none",
            toolbar: false,
            filtering: true,
            filter: true,
            filterType: "dropdown",
            responsive: "vertical",
          }}
          style={{ maxWidth: "90%", margin: "0 auto", marginTop: 25 }}
        />
      </Box>
    </Modal>
  );
};

export default ModalStages;
