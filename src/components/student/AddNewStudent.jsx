import React from "react";
import {
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

const AddNewStudent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm();

  const [studentData, setStudentData] = React.useState({
    fullName: "",
    email: "",
    number: "",
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
      <Typography fontWeight="medium" variant="h4">
        Add New Student Data
      </Typography>
      <Divider color="gray" sx={{ mt: "0.8rem", mb: "2rem" }} />
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="h6">Basic Details</Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="name"
            defaultValue={studentData.fullName}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                fullWidth
                variant="outlined"
                id="name"
                inputRef={ref}
                label="Full Name"
                placeholder="Full Name"
                autoComplete="off"
                error={!!errors.name}
                type="text"
                helperText={errors.name ? "Enter Full Name" : "Ex. ABC"}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="number"
            defaultValue={studentData.number}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                fullWidth
                variant="outlined"
                id="number"
                inputRef={ref}
                label="Mobile No."
                placeholder="Mobile No."
                autoComplete="off"
                error={!!errors.number}
                type="text"
                helperText={
                  errors.number ? "Enter Mobile No." : "Ex. 88844xxxxx"
                }
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            defaultValue={studentData.email}
            name="email"
            rules={{
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                inputRef={ref}
                type="email"
                required
                label="Email"
                placeholder="Email"
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.type === "pattern"
                      ? "Enter Valid Email"
                      : "Enter Email"
                    : "Ex. xyz@mail.com"
                }
                autoComplete="off"
                fullWidth
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            name="gender"
            defaultValue={studentData.gender || "select gender"}
            render={({ field: { ref, ...rest } }) => (
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="gender-label">Select Gender</InputLabel>
                <Select
                  label="Select Gender"
                  placeholder="Select Gender"
                  error={!!errors.gender}
                  id="gender"
                  inputRef={ref}
                  required
                  {...rest}
                >
                  {[
                    {
                      key: "select gender",
                      en: "Select Gender",
                    },
                    { key: "female", en: "Female" },
                    { key: "male", en: "Male" },
                    { key: "other", en: "Other" },
                    {
                      key: "trans",
                      en: "Transwomen",
                    },
                  ].map((el) => (
                    <MenuItem
                      key={el.key}
                      value={el.key}
                      disabled={el.en === "Select Gender"}
                    >
                      {el.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {errors.gender ? (
            <Typography
              style={{
                paddingLeft: "0.8rem",
                paddingTop: "0.4rem",
                paddingBottom: "0.4rem",
              }}
              variant="caption"
              color="error"
            >
              Please specify student&apos;s gender
            </Typography>
          ) : (
            ""
          )}
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="dob"
            defaultValue={studentData.dob || null}
            rules={{
              required: true,
              validate: (dob) =>
                parseInt(dayjs().diff(dayjs(dob), "year"), 10) >= 17,
            }}
            render={({
              field: { ref, ...rest },
              fieldState: { isTouched },
            }) => (
              <LocalizationProvider dateAdapter={DateFnsUtils}>
                <DatePicker
                  disableFuture
                  // margin="normal"
                  id="dob"
                  label="Date of Birth"
                  required
                  inputRef={ref}
                  focused={isTouched}
                  inputFormat="dd/MM/yyyy"
                  inputVariant="outlined"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.dob}
                      helperText={
                        errors.dob
                          ? errors.dob.type === "validate"
                            ? "Age must be between 17 & 28"
                            : "Enter Date of Birth"
                          : "Ex. 19/11/2003"
                      }
                    />
                  )}
                  fullWidth
                  placeholder="Date of Birth"
                  error={!!errors.dob}
                  {...rest}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            name="number"
            defaultValue={studentData.number}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                fullWidth
                variant="outlined"
                id="number"
                inputRef={ref}
                label="Mobile No."
                placeholder="Mobile No."
                autoComplete="off"
                error={!!errors.number}
                type="text"
                helperText={
                  errors.number ? "Enter Mobile No." : "Ex. 88844xxxxx"
                }
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
