import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const NotHaveAccess = () => (
  <Box
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography
      variant="h3"
      color="error"
      sx={{
        marginTop: "4rem",
      }}
    >
      You need access to view this page!!!
    </Typography>
    <Typography
      variant="h4"
      sx={{
        marginTop: "0.8rem",
      }}
    >
      For Requesting Access, contact the following people
    </Typography>
    <Box
      sx={{
        marginTop: "1.2rem",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {["Kittiy P", "Kirithiv R", "Swanand Buva", "Vaibhav Magar"].map((nm) => (
        <Typography key={nm} variant="h6">
          {nm}
        </Typography>
      ))}
    </Box>
  </Box>
);

export default NotHaveAccess;
