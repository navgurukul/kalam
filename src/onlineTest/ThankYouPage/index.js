import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

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
  const { total_marks } = props;
  return (
    <Container maxWidth="lg" align="center">
      <div className={classes.root} align="center" justifyContent="center">
        <Typography variant="h4" className={classes.thanks}>
          Thank you! you have passed the test. You have scored {total_marks}
        </Typography>
        <Typography>NavGurukul ki One Year Fellowship mein</Typography>
        <Typography>apply karne ke liye shukriya.</Typography>
        <Typography>Hum jald hi aapko contact karenge.</Typography>
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
          //   onClick={clickHandler}
        >
          Visit NavGurukul Website
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondry"
          className={classes.button}
          //   onClick={clickHandler}
        >
          Start Learning Coding Now
        </Button>
      </div>
    </Container>
  );
}

export default ThankYouPage;
