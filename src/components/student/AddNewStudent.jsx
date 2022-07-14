import { Container, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const AddNewStudent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm();

  const [studentData, setStudentData] = React.useState({
    fullName: "",
    email: "",
    whatsapp: "",
    alternateNumber: "",
    gender: "",
    dob: "",
    district: "",
    pinCode: "",
    state: "",
    city: "",
    currentStatus: "",
    qualification: "",
    schoolMedium: "",
    caste: "",
    religion: "",
    percentageIn10th: "",
    percentageIn12th: "",
  });
  return (
    <Container maxWidth="md">
      <Typography variant="h4">Add New Student Data</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="name"
            defaultValue={studentData.fullName}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                id="MiddleName"
                inputRef={ref}
                label="Full Name"
                placeholder="Full Name"
                autoComplete="off"
                error={!!errors.name}
                type="text"
                helperText={errors.name ? "Enter Full Name" : "Ex. PQR"}
                {...rest}
              />
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddNewStudent;
