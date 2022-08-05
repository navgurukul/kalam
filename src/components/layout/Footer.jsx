import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    // position: "fixed",
    // bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    backgroundColor: "#f1f3f4",
    textAlign: "center",
    color: "black",
    padding: theme.spacing(1),
  },
  dummySpace: {
    // height: theme.spacing(8),
  },
}));

const langOptions = {
  Footer: {
    en: "For more queries, write at hi@navgurukul.org",
    hi: "अधिक जानकारी के लिए ईमेल करे: hi@navgurukul.org",
    ma: "अधिक प्रश्नांसाठी, hi@navgurukul.org वर लिहा",
  },
};

export default () => {
  const classes = useStyles();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.ui);
  return (
    <Box className={classes.root}>
      <Typography variant="body1" gutterBottom>
        {isAuthenticated
          ? "Managed and run by NavGurukul Students"
          : langOptions.Footer[lang]}
      </Typography>
    </Box>
  );
};
