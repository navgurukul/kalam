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
import VisibilityIcon from "@mui/icons-material/Visibility";
import Input from "@mui/material/Input";

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

const styleForViewModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  justifyContent: "center",
  display: "flex",
  justifyItems: "center",
  alignItems: "center",
};

const baseUrl = import.meta.env.VITE_API_URL;

const UploadDocuments = (props) => {
  //snackbar for success and error
  const snackbar = useSnackbar();

  const { rowMeta, value } = props;

  const [documents, setDocuments] = useState({
    Id_proof_link: value?.Id_proof_link || "",
    Resume_link: value?.Resume_link || "",
    marksheet_link: value?.marksheet_link || "",
    signed_consent_link: value?.signed_consent_link || "",
  });
  const [open, setOpen] = React.useState(false);
  const [viewOpenIdProof, setViewOpenIdProof] = React.useState(false);
  const [viewOpenResume, setViewOpenResume] = React.useState(false);
  const [viewOpenMarksheet, setViewOpenMarksheet] = React.useState(false);
  const [viewOpenSignedConsent, setViewOpenSignedConsent] =
    React.useState(false);
  const [Link, setLink] = React.useState({
    idProofLink: "",
    signedConsentLink: "",
    resumeLink: "",
    marksheetLink: "",
  });

  const studentId = rowMeta.rowData[0];
  const studentName = rowMeta.rowData[1];

  //function to create or generate link
  const LinkGenerator = (e, unique) => {
    e.preventDefault();
    const formData = new FormData();

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

  //function to upload documents - ID proof
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

          if (Link.idProofLink !== "") {
            setDocuments({ ...documents, Id_proof_link: Link.idProofLink });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to upload documents - signed consent
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

          if (Link.signedConsentLink !== "") {
            setDocuments({
              ...documents,
              signed_consent_link: Link.signedConsentLink,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to upload documents - resume
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

          if (Link.resumeLink !== "") {
            setDocuments({ ...documents, Resume_link: Link.resumeLink });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to upload documents - marksheet
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

          if (Link.marksheetLink !== "") {
            setDocuments({ ...documents, marksheet_link: Link.marksheetLink });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //function to add new documents
  const addNewIDProof = () => {
    setDocuments({ ...documents, Id_proof_link: "" });
    setLink({ ...Link, idProofLink: "" });
  };
  const addNewResume = () => {
    setDocuments({ ...documents, Resume_link: "" });
    setLink({ ...Link, resumeLink: "" });
  };
  const addNewSignedConsent = () => {
    setDocuments({ ...documents, signed_consent_link: "" });
    setLink({ ...Link, signedConsentLink: "" });
  };
  const addNewMarksheet = () => {
    setDocuments({ ...documents, marksheet_link: "" });
    setLink({ ...Link, marksheetLink: "" });
  };

  const columns = [
    {
      name: "ID_Proof_link",
      label: "ID Proof",
      options: {
        customBodyRender: () => (
          <div>
            {documents.Id_proof_link.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewOpenIdProof(true);
                  }}
                >
                  View Document
                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "grey",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    addNewIDProof();
                  }}
                >
                  Add New
                </Button>

                <Modal
                  open={viewOpenIdProof}
                  onClose={() => {
                    setViewOpenIdProof(false);
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleForViewModal}>
                    <embed
                      src={documents.Id_proof_link}
                      alt="idProof"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Modal>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="contained-button-file1">
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
                  inputProps={{ type: "file", accept: "image/*,.pdf" }}
                  id="contained-button-file1"
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => {
                    LinkGenerator(e, 1);
                  }}
                />
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
            )}
          </div>
        ),
      },
    },
    {
      name: "signed consent link",
      label: "Signed Consent",
      options: {
        customBodyRender: () => (
          <div>
            {documents.signed_consent_link?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewOpenSignedConsent(true);
                  }}
                >
                  View Document
                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "grey",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    addNewSignedConsent();
                  }}
                >
                  Add New
                </Button>

                <Modal
                  open={viewOpenSignedConsent}
                  onClose={() => {
                    setViewOpenSignedConsent(false);
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleForViewModal}>
                    <embed
                      src={documents.signed_consent_link}
                      alt="signedConsent"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Modal>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="contained-button-file2">
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      width: "100%",
                      backgroundColor: "grey",
                      borderRadius: "20px",
                    }}
                  >
                    Generate Link
                  </Button>
                </label>
                <Input
                  inputProps={{ type: "file", accept: "image/*,.pdf" }}
                  id="contained-button-file2"
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => {
                    LinkGenerator(e, 2);
                  }}
                />
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
            )}
          </div>
        ),
      },
    },
    {
      name: "resume",
      label: "Resume",
      options: {
        customBodyRender: () => (
          <div>
            {documents.Resume_link?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewOpenResume(true);
                  }}
                >
                  View Document
                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "grey",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    addNewResume();
                  }}
                >
                  Add New
                </Button>

                <Modal
                  open={viewOpenResume}
                  onClose={() => {
                    setViewOpenResume(false);
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleForViewModal}>
                    <embed
                      src={documents.Resume_link}
                      alt="resume"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Modal>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="resume-input">
                  <Button
                    variant="contained"
                    component="span"
                    style={{
                      width: "100%",
                      backgroundColor: "grey",
                      borderRadius: "20px",
                    }}
                  >
                    Generate Link
                  </Button>
                </label>
                <Input
                  inputProps={{ type: "file", accept: "image/*,.pdf" }}
                  id="resume-input"
                  type="file"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) => {
                    LinkGenerator(e, 3);
                  }}
                />
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
            )}
          </div>
        ),
      },
    },
    {
      name: "mark sheet",
      label: "Marksheet",
      options: {
        customBodyRender: () => (
          <div>
            {documents.marksheet_link?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setViewOpenMarksheet(true);
                  }}
                >
                  View Document
                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "grey",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    addNewMarksheet();
                  }}
                >
                  Add New
                </Button>

                <Modal
                  open={viewOpenMarksheet}
                  onClose={() => {
                    setViewOpenMarksheet(false);
                  }}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={styleForViewModal}>
                    <embed
                      src={documents.marksheet_link}
                      alt="marksheet"
                      style={{
                        width: "100%",
                        height: "100%",

                        // transform: "translate(-50%, -50%)",
                      }}
                    />
                  </Box>
                </Modal>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="marksheet-input">
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
                  inputProps={{ type: "file", accept: "image/*,.pdf" }}
                  id="marksheet-input"
                  name="marksheet-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    LinkGenerator(e, 4);
                  }}
                />
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
            )}
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
    print: false,
    download: false,
    search: false,
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
