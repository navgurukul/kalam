import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

const NotFoundPage = () => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      p: "0.4rem",
    }}
  >
    <Typography variant="h3" textAlign="center" sx={{ marginBottom: "2rem" }}>
      Oops! The Page you accessed does not exist
    </Typography>
    <Link to="/">
      <Button size="large" variant="outlined" color="primary">
        Go Home
      </Button>
    </Link>
  </Container>
);

export default NotFoundPage;
