import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import HelpIcon from "@material-ui/icons/HelpOutline";
import { makeStyles } from "@material-ui/styles";

// const rand = () => Math.round(Math.random() * 20) - 10;

const getModalStyle = () => {
  const top = 50; // + rand()
  const left = 50; //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
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

const ModalStages = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClose = () => setModalOpen(false);

  const handleOpen = () => setModalOpen(true);

  const modalStyle = getModalStyle();

  return (
    <div>
      <Button color="primary" align="right" onClick={handleOpen}>
        <HelpIcon color="primary" />
        &nbsp;&nbsp;
        <Typography
          variant="subtitle1"
          color="primary"
          id="simple-modal-description"
        >
          Instructions
        </Typography>
      </Button>
      <Modal open={modalOpen} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h5" id="modal-title">
            NavGurukul admission process has 4 main stages. <br />
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            All the stages are documented below.
          </Typography>
          <br />

          <Typography variant="h6">Multiple Choice Test</Typography>
          <p>
            Students answer this test either on their mobile or pen/paper. It
            gauges the logical aptitude of the student.
          </p>

          <Typography variant="h6">Logical Level Interview</Typography>
          <p>
            Similar to the multiple choice test, this interview is also used to
            gauge the logical aptitude of the student.
            <br />
            Having a humane interview helps us give more space to students and
            understand them better. This step is also used to account for
            cheating in the previous step.
          </p>

          <Typography variant="h6">English Interview</Typography>
          <p>
            We don&apos;t require high english levels. Most of our students
            haven&apos;t had access to a good english learning environment.
            <br />
            We just require them to understand basic 6th grade English.
          </p>

          <Typography variant="h6">Culture Fit Interview</Typography>
          <p>
            This helps us understand if the students will be a good fit for the
            NavGurukul culture.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ModalStages;
