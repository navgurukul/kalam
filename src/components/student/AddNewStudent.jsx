import { Container, Grid, Typography } from "@mui/material";
import React from "react";

const AddNewStudent = () => {
  const [studentData, setStudentData] = React.useState({});
  return (
    <Container maxWidth="md">
      <Typography variant="h4">Add New Student Data</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          1
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddNewStudent;
