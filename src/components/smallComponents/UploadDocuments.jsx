import React from "react";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { useSelector } from "react-redux";
import UploadView from "../placement/UploadView";

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

const UploadDocuments = ({
  studentId,
  studentName,
  currentDocuments,
  change,
}) => {
  const { privileges } = useSelector((state) => state.auth);

  const documents = React.useMemo(
    () => ({
      Id_proof_link: currentDocuments?.Id_proof_link || "",
      Resume_link: currentDocuments?.Resume_link || "",
      marksheet_link: currentDocuments?.marksheet_link || "",
      signed_consent_link: currentDocuments?.signed_consent_link || "",
    }),
    [currentDocuments]
  );
  const [modalOpen, setModalOpen] = React.useState(false);

  const uploadDocument = async (document, url) =>
    axios.post(`${baseUrl}students/uploadDocument/${studentId}`, {
      [document]: url,
    });

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const canView = privileges.some(
    (priv) => priv.privilege === "ViewStudentDocuments"
  );
  const canUpload = privileges.some(
    (priv) => priv.privilege === "UploadStudentDocuments"
  );

  const columns = [
    {
      name: "Id_proof_link",
      label: "ID Proof",
      options: {
        customBodyRender: React.useCallback(
          (value, rowMeta, updateValue) => (
            <UploadView
              name={rowMeta.columnData.name}
              label={rowMeta.columnData.label}
              update={uploadDocument}
              docLink={value}
              editOnLoad
              change={(newVal) => {
                updateValue(newVal);
                change({ [rowMeta.columnData.name]: newVal });
              }}
            />
          ),
          []
        ),
      },
    },
    {
      name: "signed_consent_link",
      label: "Signed Consent",
      options: {
        customBodyRender: React.useCallback(
          (value, rowMeta, updateValue) => (
            <UploadView
              name={rowMeta.columnData.name}
              label={rowMeta.columnData.label}
              update={uploadDocument}
              docLink={value}
              editOnLoad
              change={(newVal) => {
                updateValue(newVal);
                change({ [rowMeta.columnData.name]: newVal });
              }}
            />
          ),
          []
        ),
      },
    },
    {
      name: "Resume_link",
      label: "Resume",
      options: {
        customBodyRender: React.useCallback(
          (value, rowMeta, updateValue) => (
            <UploadView
              name={rowMeta.columnData.name}
              label={rowMeta.columnData.label}
              update={uploadDocument}
              docLink={value}
              editOnLoad
              change={(newVal) => {
                updateValue(newVal);
                change({ [rowMeta.columnData.name]: newVal });
              }}
            />
          ),
          []
        ),
      },
    },
    {
      name: "marksheet_link",
      label: "Marksheet",
      options: {
        customBodyRender: React.useCallback(
          (value, rowMeta, updateValue) => (
            <UploadView
              name={rowMeta.columnData.name}
              label={rowMeta.columnData.label}
              update={uploadDocument}
              docLink={value}
              editOnLoad
              change={(newVal) => {
                updateValue(newVal);
                change({ [rowMeta.columnData.name]: newVal });
              }}
            />
          ),
          []
        ),
      },
    },
  ];

  const isDocumentsEmpty = (docs) =>
    docs &&
    Object.values(docs)
      .map((val) => val && val.length === 0)
      .includes(false);

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
      <Button
        onClick={handleOpen}
        disabled={isDocumentsEmpty(documents) ? !canView : !canUpload}
      >
        {isDocumentsEmpty(documents) ? "VIEW/UPDATE" : "UPLOAD"}{" "}
      </Button>
      <Modal
        open={modalOpen}
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
            data={[documents]}
            columns={columns}
            options={options}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default UploadDocuments;
