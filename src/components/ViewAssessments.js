import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import AssessmentIcon from "@material-ui/icons/Assessment";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { Link } from "react-router-dom";
import CsvUpload from "./Uploadcsv";
import GlobalService from "../services/GlobalService";

const baseUrl = process.env.API_URL;

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

const ModalStages = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    modalOpen: false,
    data: [],
    partnerId: null,
  });
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
        customBodyRender: (rowData) => {
          return rowData ? (
            <a target="_blank" rel="noreferrer noopner" href={rowData}>
              Link to Assessment
            </a>
          ) : null;
        },
      },
    },
    {
      label: "Answer Key URL",
      name: "answer_key_url",
      options: {
        filter: false,
        customBodyRender: (rowData) => {
          return rowData ? (
            <a target="_blank" rel="noreferrer noopner" href={rowData}>
              Link to Answer Key
            </a>
          ) : null;
        },
      },
    },
    {
      label: "Question Set ID",
      name: "question_set_id",
      options: {
        filter: false,
        customBodyRender: (rowData) => {
          const url =
            "/partners/" + props.partnerId + "/assessments/" + rowData;
          return <Link to={url}>{rowData}</Link>;
        },
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
        customBodyRender: (rowData, rowMeta) => {
          return (
            <CsvUpload partnerId={rowData} assessmentId={rowMeta.rowData[0]} />
          );
        },
      },
    },
  ];

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: false,
    }));
  };

  const handleOpen = () => {
    fetchAssessments();
    setState((prevState) => ({
      ...prevState,
      modalOpen: true,
    }));
    // props.modalOpen = true
  };

  const fetchAssessments = async () => {
    try {
      const dataURL = baseUrl + "partners/" + props.partnerId + "/assessments";
      const response = await axios.get(dataURL);
      setState((prevState) => ({ ...prevState, data: response.data.data }));
    } catch (e) {
      console.error(e);
    }
  };

  const modalStyle = getModalStyle();

  return !state.modalOpen ? (
    <Button color="primary" align="right" onClick={handleOpen}>
      <AssessmentIcon color="primary" />
      &nbsp;&nbsp;
    </Button>
  ) : (
    <Modal open={state.modalOpen} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        <Typography
          variant="h5"
          id="modal-title"
          style={{ backgroundColor: "red" }}
        >
          View Assessments
          <br />
        </Typography>

        <MUIDataTable
          columns={columns}
          data={state.data}
          icons={GlobalService.tableIcons}
          options={{
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            selectableRows: "none",
            toolbar: false,
            filtering: true,
            filter: true,
            filterType: "doprdown",
            responsive: "stacked",
          }}
          style={{ maxWidth: "90%", margin: "0 auto", marginTop: 25 }}
        />
      </div>
    </Modal>
  );
};

export default ModalStages;
