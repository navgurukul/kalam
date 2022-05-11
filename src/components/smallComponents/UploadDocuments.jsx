/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useSnackbar } from "notistack";

import Input from "@mui/material/Input";
// or

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",

  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const baseUrl = import.meta.env.VITE_API_URL;

const UploadDocuments = (props) => {
  const snackbar = useSnackbar();
  const { rowMeta } = props;
  console.log(rowMeta.rowData);
  const studentId = rowMeta.rowData[0];
  const studentName = rowMeta.rowData[2];

  const [open, setOpen] = React.useState(false);
  const [Link, setLink] = React.useState({
    idProofLink: "",
    signedConsentLink: "",
    resumeLink: "",
    marksheetLink: "",
  });

  const LinkGenerator = (e, unique) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(e.target.files[0]);
    formData.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}/students/resume/documents`, formData)
      .then((res) => {
        if (res.status === 200) {
          if (unique === 1) {
            setLink({ ...Link, idProofLink: res.data });
          }
          if (unique === 2) {
            setLink({ ...Link, signedConsentLink: res.data });
          }
          if (unique === 3) {
            setLink({ ...Link, resumeLink: res.data });
          }
          if (unique === 4) {
            setLink({ ...Link, marksheetLink: res.data });
          }
          snackbar.enqueueSnackbar(
            "Link generated and pasted in the text box successfully, click on upload!",
            {
              variant: "success",
            }
          );
          // console.log(Link.idProofLink);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const UploadIdProof = (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}students/uploadDocument/${studentId}`, {
        Id_proof_link: Link.idProofLink,
      })
      .then((res) => {
        if (res.status === 200) {
          snackbar.enqueueSnackbar("ID Proof uploaded successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const UploadSignedConsent = (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}students/uploadDocument/${studentId}`, {
        signed_consent_link: Link.signedConsentLink,
      })
      .then((res) => {
        if (res.status === 200) {
          snackbar.enqueueSnackbar("Signed Consent uploaded successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const UploadResume = (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}students/uploadDocument/${studentId}`, {
        Resume_link: Link.resumeLink,
      })
      .then((res) => {
        if (res.status === 200) {
          snackbar.enqueueSnackbar("Resume uploaded successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const UploadMarksheet = (e) => {
    e.preventDefault();

    axios
      .post(`${baseUrl}students/uploadDocument/${studentId}`, {
        marksheet_link: Link.marksheetLink,
      })
      .then((res) => {
        if (res.status === 200) {
          snackbar.enqueueSnackbar("10th Marksheet uploaded successfully", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const columns = [
    {
      name: "name",
      label: "ID Proof",
      options: {
        customBodyRender: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="contained-button-file1">
              <Input
                accept="image/*"
                id="contained-button-file1"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={(e) => {
                  LinkGenerator(e, 1);
                }}
              />
              <Button
                variant="contained"
                component="span"
                style={{
                  width: "100%",
                  backgroundColor: "grey",

                  //corner radius
                  borderRadius: "20px",
                }}
              >
                Generate Link
              </Button>
            </label>
            <Input
              type="text"
              value={Link.idProofLink}
              variant="outlined"
              style={{
                width: "100%",
                margin: "10px 0",
              }}
              placeholder="Paste the link here"
              onChange={(e) => {
                setLink({ ...Link, idProofLink: e.target.value });
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              disabled={Link.idProofLink === ""}
              onClick={UploadIdProof}
            >
              Upload
            </Button>
          </div>
        ),
      },
    },
    {
      name: "company",
      label: "Signed Consent",
      options: {
        customBodyRender: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="contained-button-file2">
              <Input
                accept="image/*"
                id="contained-button-file2"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={(e) => {
                  LinkGenerator(e, 2);
                }}
              />
              <Button
                variant="contained"
                component="span"
                style={{
                  width: "100%",
                  backgroundColor: "grey",

                  //corner radius
                  borderRadius: "20px",
                }}
              >
                Generate Link
              </Button>
            </label>
            <Input
              type="text"
              value={Link.signedConsentLink}
              variant="outlined"
              style={{
                width: "100%",
                margin: "10px 0",
              }}
              placeholder="Paste the link here"
              onChange={(e) => {
                setLink({ ...Link, signedConsentLink: e.target.value });
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              disabled={Link.signedConsentLink === ""}
              onClick={UploadSignedConsent}
            >
              Upload
            </Button>
          </div>
        ),
      },
    },
    {
      name: "city",
      label: "Resume",
      options: {
        customBodyRender: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="contained-button-file3">
              <Input
                accept="image/*"
                id="contained-button-file3"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={(e) => {
                  LinkGenerator(e, 3);
                }}
              />
              <Button
                variant="contained"
                component="span"
                style={{
                  width: "100%",
                  backgroundColor: "grey",

                  //corner radius
                  borderRadius: "20px",
                }}
              >
                Generate Link
              </Button>
            </label>
            <Input
              type="text"
              value={Link.resumeLink}
              variant="outlined"
              style={{
                width: "100%",
                margin: "10px 0",
              }}
              placeholder="Paste the link here"
              onChange={(e) => {
                setLink({ ...Link, resumeLink: e.target.value });
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              disabled={Link.resumeLink === ""}
              onClick={UploadResume}
            >
              Upload
            </Button>
          </div>
        ),
      },
    },
    {
      name: "state",
      label: "Marksheet",
      options: {
        customBodyRender: () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="contained-button-file4">
              <Input
                accept="image/*"
                id="contained-button-file4"
                type="file"
                style={{
                  display: "none",
                }}
                onChange={(e) => {
                  LinkGenerator(e, 4);
                }}
              />
              <Button
                variant="contained"
                component="span"
                style={{
                  width: "100%",
                  backgroundColor: "grey",

                  //corner radius
                  borderRadius: "20px",
                }}
              >
                Generate Link
              </Button>
            </label>
            <Input
              type="text"
              value={Link.marksheetLink}
              variant="outlined"
              style={{
                width: "100%",
                margin: "10px 0",
              }}
              placeholder="Paste the link here"
              onChange={(e) => {
                setLink({ ...Link, marksheetLink: e.target.value });
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              disabled={Link.marksheetLink === ""}
              onClick={UploadMarksheet}
            >
              Upload
            </Button>
          </div>
        ),
      },
    },
  ];

  const data = [
    { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
  ];

  const options = {
    filter: false,
    selectableRows: "none",

    //disable toolbar
    print: false,
    download: false,
    search: false,
    //disable pagination
    pagination: false,
  };

  return (
    <div>
      <Button onClick={handleOpen}>UPLOAD</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h4"
            id="modal-modal-title"
            style={{
              textAlign: "center",
              color: "#F05F40",
              fontWeight: "500",
              marginBottom: "20px",
            }}
          >
            Upload Documents
          </Typography>

          <Typography
            variant="p"
            id="modal-modal-title"
            style={{
              textAlign: "center",
              //   color: "#F05F40",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ( Upload link of the documents, if you are not having link you can
            generate link by selecting file and clicking on generate link. )
          </Typography>

          <MUIDataTable
            title={`Student Name: ${studentName}`}
            data={data}
            columns={columns}
            options={options}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UploadDocuments;
