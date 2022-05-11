import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Button, Link, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    padding: theme.spacing(3),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
  link: {
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  thanks: {
    marginBottom: theme.spacing(2),
  },
}));

function ThankYouPage(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [totalMarks, setTotalMarks] = useState("");
  useEffect(() => {
    fetch(
      `${baseUrl}/on_assessment/Show_testResult/${
        location.pathname.split("/")[2]
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalMarks(data.total_marks);
      });
  }, []);
  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root} align="center">
        <Typography variant="h4" className={classes.thanks}>
          Thank you! you have passed the test. You have scored {totalMarks}
        </Typography>
        <Typography>NavGurukul ki One Year Fellowship mein</Typography>
        <Typography>apply karne ke liye shukriya.</Typography>
        <Typography>
          Aap apna interview slot apne time ke hisab se book kar sakte hain.
        </Typography>
        <Typography className={classes.link}>
          Aap humein{" "}
          <Link href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=hi@navgurukul.org">
            hi@navgurukul.org
          </Link>{" "}
          par mail bhi kar sakte hai.
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => {
            localStorage.removeItem("answerList");
            localStorage.removeItem("enrollmentKey");
            localStorage.removeItem("index");
            localStorage.removeItem("time");
            const { userID } = props;
            navigate(`/bookSlot/${userID}`);
          }}
        >
          Book Slot
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.button}
          //   onClick={clickHandler}
        >
          <a
            href="http://navgurukul.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Visit NavGurukul Website
          </a>
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondry"
          className={classes.button}
          //   onClick={clickHandler}
        >
          <a
            href="https://www.merakilearn.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Start Learning Coding Now
          </a>
        </Button>
      </div>
    </Container>
  );
}

export default ThankYouPage;
