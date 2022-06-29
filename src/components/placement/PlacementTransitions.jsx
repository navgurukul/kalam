import { Box, Button, IconButton, Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MainLayout from "../muiTables/MainLayout";

const getModalStyle = () => {
  const top = 50; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "90vh",
    width: "90%",
  };
};

const useStyles = makeStyles((_theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "94vw",
    [_theme.breakpoints.up("md")]: {
      margin: "auto",
      width: "50%",
    },
    backgroundColor: _theme.palette.background.paper,
    boxShadow: _theme.shadows[5],
    padding: _theme.spacing(4),
    outline: "none",
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: "22px",
      },
    },
  },
  transitionIcon: {
    transform: "rotate(-180deg)",
  },
}));

const PlacementTransitions = ({
  // studentId,
  studentName,
  studentTransitions,
  modalOpen,
  closeModal,
}) => {
  const classes = useStyles();
  const [viewLink, setViewLink] = React.useState(null);
  const columns = [
    {
      name: "id",
      label: "Actions",
      options: {
        display: false,
        viewColumns: false,
        filter: false,
      },
    },
    {
      name: "employer",
      label: "Employer",
      options: {
        filter: false,
      },
    },
    {
      name: "job_designation",
      label: "Designation",
    },
    {
      name: "job_location",
      label: "Job Location",
    },
    {
      name: "salary",
      label: "Salary",
    },
    {
      name: "job_type",
      label: "Job Type",
    },
    {
      name: "offer_letter_date",
      label: "Offer Letter Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback((value) => {
          // const studentId = rowMeta.rowData[0];
          const offerLetterDate = dayjs(value).format("D MMM YYYY");

          return <p>{offerLetterDate}</p>;
          // <CustomDatePicker
          //   offerLetterDate={offerLetterDate}
          //   id={value?.id}
          //   studentId={studentId}
          //   change={change}
          // />
        }, []),
      },
    },
    {
      name: "resume",
      label: "Resume",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (value) => (
            <Button
              variant="contained"
              endIcon={<VisibilityIcon />}
              onClick={() => setViewLink(value)}
            >
              View
            </Button>
          ),
          []
        ),
      },
    },
    {
      name: "photo_link",
      label: "Photo Link",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (value) => (
            <Button
              variant="contained"
              endIcon={<VisibilityIcon />}
              onClick={() => setViewLink(value)}
            >
              View
            </Button>
          ),
          []
        ),
      },
    },
    {
      name: "video_link",
      label: "Video Link",
      options: {
        filter: false,
        customBodyRender: React.useCallback(
          (value) => (
            <Button
              variant="contained"
              endIcon={<VisibilityIcon />}
              onClick={() => setViewLink(value)}
            >
              View
            </Button>
          ),
          []
        ),
      },
    },
  ];
  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <Box style={getModalStyle()} className={classes.paper}>
        {/* <Typography variant="h3">Transition Data for {studentName}</Typography> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <IconButton onClick={closeModal}>
            <CancelIcon />
          </IconButton>
        </Box>
        <Modal
          open={!!viewLink}
          onClose={() => setViewLink(null)}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "none",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
              }}
            >
              <IconButton onClick={() => setViewLink(null)}>
                <CancelIcon />
              </IconButton>
            </Box>
            <embed
              // id="ytplayer"
              // title="Video Player"
              type="text/html"
              width="800"
              height="600"
              src={viewLink}
              frameBorder="0"
            />
          </Box>
        </Modal>
        <MainLayout
          title={`Transition Data for ${studentName}`}
          data={studentTransitions}
          columns={columns}
          showLoader={false}
        />
      </Box>
    </Modal>
  );
};

export default PlacementTransitions;
