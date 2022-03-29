import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import DetailsIcon from "@material-ui/icons/Details";
import { caste, religon, currentStatus, qualification } from "../config";
import { makeStyles } from "@material-ui/styles";
const _ = require("underscore");

const getModalStyle = () => {
  const top = 54; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: "scroll",
    maxHeight: "80vh",
    width: "45%",
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    marginLeft: "3vw",
    marginRight: "3vw",
    width: "60vw",
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

const StudentDetails = (props) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  if (!modalOpen) {
    return (
      <Button color="primary" align="right" onClick={handleOpen}>
        <DetailsIcon />
      </Button>
    );
  } else {
    const modalStyle = getModalStyle();
    const { details } = props;
    return (
      <div>
        <Button color="primary" align="right" onClick={handleOpen}>
          <DetailsIcon />
        </Button>
        <Modal open={modalOpen} onClose={handleClose}>
          <div style={modalStyle} className={classes.paper}>
            <Typography variant="h5" id="modal-title">
              Student Other Details
              <br />
            </Typography>
            <br></br>
            <table>
              <tbody>
                <tr>
                  <th>Email</th>
                  <td> {details.email} </td>
                </tr>
                <tr>
                  <th>Caste</th>
                  <td>{_.invert(caste)[details.caste]}</td>
                </tr>
                <tr>
                  <th>Religion</th>
                  <td> {_.invert(religon)[details.religon]} </td>
                </tr>
                <tr>
                  <th>Qualification</th>
                  <td> {_.invert(qualification)[details.qualification]} </td>
                </tr>
                <tr>
                  <th>Curent Status</th>
                  <td> {_.invert(currentStatus)[details.currentStatus]} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    );
  }
};

export default StudentDetails;
