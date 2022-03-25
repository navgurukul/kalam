import React from "react";

import { makeStyles } from "@mui/styles";
import axios, { post } from "axios";
import ReactJson from "react-json-view";
import { Modal } from "@mui/material";
import Spinner from "react-spinner-material";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.API_URL;

const useStyles = makeStyles((theme) => ({
  innerTable: {
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    marginTop: "5",
    marginBottom: "5",
    [theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
      marginTop: 5,
      marginBottom: 5,
    },
  },
  clear: {
    clear: "both",
  },
}));

const getModalStyle = () => ({
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "85vh",
  backgroundColor: "white",
  border: "2px solid rgb(0, 0, 0)",
  marginTop: "4vw",
  overflow: "auto",
  maxHeight: "92vh",
  padding: "20px",
});

const CsvUpload = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = React.useState({
    modalOpen: false,
    errors: "",
    file: "",
    loading: false,
  });
  // this.onFormSubmit = this.onFormSubmit.bind(this)
  // this.onChange = this.onChange.bind(this)
  // this.fileUpload = this.fileUpload.bind(this)

  const addAttempts = async (fileUrl) => {
    const { partnerId, assessmentId } = props;
    try {
      if (fileUrl) {
        const url = `${baseUrl}partners/${partnerId}/assessments/${assessmentId}/attempts`;
        const response = await axios.post(url, {
          csvUrl: fileUrl,
        });
        if (response.data.errors !== undefined) {
          setState({
            ...state,
            errors: response.data,
            loading: false,
          });
          enqueueSnackbar("successfully uploaded csv file!", {
            variant: "success",
          });
        } else {
          setState({
            ...state,
            errors: "sucess",
            loading: false,
          });
        }
      }
    } catch (e) {
      enqueueSnackbar("Internal Server Error", { variant: "error" });
    }
  };

  const errorHandler = () => {
    if (typeof state.errors === "object") {
      return (
        <div>
          <h3 style={{ color: "green", textAlign: "center" }}>
            Please coreect your csv file according to the detailsErrors and
            answerErrors using following instructions.
          </h3>
          <ReactJson src={state.errors} />
        </div>
      );
    }
    if (state.errors === "sucess") {
      return enqueueSnackbar("successfully uploaded csv file!", {
        variant: "success",
      });
    }
  };

  const fileUpload = async (file) => {
    const url = `${baseUrl}general/upload_file/answerCSV`;
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return post(url, formData, config);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault(); // Stop form submit

    fileUpload(state.file).then((response) => {
      try {
        if (response.data.errors === undefined) {
          addAttempts(response.data.fileUrl);
        } else {
          alert("It is enternal server error please refresh the page.");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
  };

  const onChange = async (e) => {
    await setState({ ...state, file: e.target.files[0], loading: true });
    await onFormSubmit(e);
  };

  const handleClose = () => {
    setState({
      ...state,
      modalOpen: false,
    });
  };

  const modalStyle = getModalStyle();
  const { loading } = state;
  return (
    <div>
      <form style={{ padding: "10px" }}>
        <h3>File Upload</h3>
        <input
          type="file"
          accept=".csv"
          onChange={onChange}
          style={{ color: "green" }}
        />
        <Spinner
          size={35}
          spinnerColor="#ed343d"
          spinnerWidth={5}
          visible={loading}
          style={{ padding: "10px" }}
        />
      </form>
      <Modal open={state.modalOpen} onClose={handleClose}>
        <div style={modalStyle} className={classes.errors}>
          {errorHandler()}
        </div>
      </Modal>
    </div>
  );
};

// export default withSnackbar(withRouter(withStyles(styles)(CsvUpload)));
export default CsvUpload;
