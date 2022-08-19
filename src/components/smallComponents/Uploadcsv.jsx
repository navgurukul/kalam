import React from "react";

import { makeStyles } from "@mui/styles";
import axios, { post } from "axios";
import ReactJson from "react-json-view";
import { Modal } from "@mui/material";
import Spinner from "react-spinner-material";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

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

const CsvUpload = ({ partnerId, assessmentId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState(null);

  const addAttempts = async (fileUrl) => {
    try {
      if (fileUrl) {
        const url = `${baseUrl}partners/${partnerId}/assessments/${assessmentId}/attempts`;
        const response = await axios.post(url, {
          csvUrl: fileUrl,
        });
        if (response.data.errors !== undefined) {
          setErrors(response.data);
        } else {
          enqueueSnackbar("successfully uploaded csv file!", {
            variant: "success",
          });
        }
        setLoading(false);
      }
    } catch (e) {
      enqueueSnackbar("Internal Server Error", { variant: "error" });
    }
  };

  const errorHandler = () => {
    if (typeof errors === "object") {
      return (
        <div>
          <h3 style={{ color: "green", textAlign: "center" }}>
            Please coreect your csv file according to the detailsErrors and
            answerErrors using following instructions.
          </h3>
          <ReactJson src={errors} />
        </div>
      );
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

  const onFormSubmit = async (file) => {
    fileUpload(file).then((response) => {
      try {
        if (response.data.errors === undefined) {
          addAttempts(response.data.fileUrl);
        } else {
          alert("It is enternal server error please refresh the page.");
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const onChange = async (e) => {
    // setState({ ...state, file: e.target.files[0] });
    setLoading(true);
    await onFormSubmit(e.target.files[0]);
  };

  const handleClose = () => setErrors(null);

  const modalStyle = getModalStyle();
  return (
    <>
      <div style={{ padding: "10px" }}>
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
      </div>
      <Modal open={!!errors} onClose={handleClose}>
        <div style={modalStyle} className={classes.errors}>
          {errorHandler()}
        </div>
      </Modal>
    </>
  );
};

// export default withSnackbar(withRouter(withStyles(styles)(CsvUpload)));
export default CsvUpload;
