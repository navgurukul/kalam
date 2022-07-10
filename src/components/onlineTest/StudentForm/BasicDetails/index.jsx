/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container,
  Typography,
  Avatar,
  Grid,
  Badge,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useSnackbar } from "notistack";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 400,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  container: {
    maxWidth: 500,
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(0.5),
  },
  text: { marginTop: theme.spacing(0.5) },
  date: {
    maxWidth: 400,
    paddingTop: theme.spacing(-2),
    paddingBottom: theme.spacing(1),
  },
}));

const BasicDetails = ({
  lang,
  formData,
  setProfileImage,
  inputDisabled,
  pfpCompulsion,
  reactForm: { errors, control },
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const uploadProfilePhoto = (e) => {
    const file = e.target.files[0];
    //check if file size is greater than 1mb
    if (file.size > 1000000) {
      enqueueSnackbar("File size should not exceed 1MB", { variant: "error" });
      return;
    }
    setProfileImage(file);
  };
  return (
    <Container maxWidth="lg" align="center">
      <label
        style={{
          cursor: inputDisabled ? "default" : "pointer",
        }}
        htmlFor="ProfileImage"
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={<CameraAltIcon />}
        >
          <Avatar
            style={{
              width: "70px",
              height: "70px",
            }}
            alt="ProfileImage"
            src={
              formData.ProfileImage
                ? URL.createObjectURL(formData.ProfileImage)
                : formData.PrevImage
            }
          />
        </Badge>
        <Typography variant="h6" className={classes.text}>
          Profile Image{pfpCompulsion ? "*" : ""}
        </Typography>
        {errors.ProfileImage ? (
          <Typography
            style={{ paddingTop: "-0.2rem" }}
            variant="caption"
            color="error"
          >
            {lang === "en" ? "Required Field" : "आवश्यक क्षेत्र"}
          </Typography>
        ) : (
          ""
        )}
      </label>

      <input
        onChange={(e) => uploadProfilePhoto(e)}
        id="ProfileImage"
        type="file"
        name="ProfileImage"
        style={{ display: "none" }}
        required
        disabled={inputDisabled && formData.ProfileImage !== null}
        accept=".png,.jpg,.jpeg"
      />
      <Grid style={{ paddingTop: "1.2rem" }} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="FirstName"
            rules={{ required: true }}
            defaultValue={formData.FirstName}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="FirstName"
                // autoFocus
                inputRef={ref}
                onBlur={rest.onBlur}
                className={classes.spacing}
                label={lang === "en" ? "First Name" : "प्रथम नाम"}
                placeholder={lang === "en" ? "First Name" : "प्रथम नाम"}
                // name="FirstName"
                autoComplete="off"
                type="text"
                error={!!errors.FirstName}
                helperText={
                  errors.FirstName
                    ? lang === "en"
                      ? "Enter First Name"
                      : "प्रथम नाम दर्ज करें"
                    : "Ex. XYZ"
                }
                disabled={inputDisabled && formData.FirstName !== null}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Controller
            control={control}
            name="MiddleName"
            defaultValue={formData.MiddleName}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                id="MiddleName"
                inputRef={ref}
                className={classes.spacing}
                label={lang === "en" ? "Middle Name " : "मध्यनाम"}
                placeholder={lang === "en" ? "Middle Name " : "मध्यनाम"}
                autoComplete="off"
                error={!!errors.MiddleName}
                type="text"
                helperText={
                  errors.MiddleName
                    ? lang === "en"
                      ? "Enter Middle Name"
                      : "मध्यनाम दर्ज करें"
                    : "Ex. PQR"
                }
                disabled={inputDisabled && formData.MiddleName !== null}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Controller
            control={control}
            defaultValue={formData.LastName}
            name="LastName"
            rules={{ required: true }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                required
                type="text"
                id="LastName"
                inputRef={ref}
                className={classes.spacing}
                label={lang === "en" ? "Last Name" : "कुलनाम"}
                placeholder={lang === "en" ? "Last Name" : "कुलनाम"}
                autoComplete="off"
                error={!!errors.LastName}
                helperText={
                  errors.LastName
                    ? lang === "en"
                      ? "Enter Last Name"
                      : "कुलनाम दर्ज करें"
                    : "Ex. ABC"
                }
                disabled={inputDisabled && formData.LastName !== null}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="dob"
            defaultValue={formData.dob ? formData.dob : null}
            rules={{
              required: true,
              validate: (dob) =>
                parseInt(dayjs().diff(dayjs(dob), "year"), 10) >= 16 &&
                parseInt(dayjs().diff(dayjs(dob), "year"), 10) <= 27,
            }}
            render={({
              field: { ref, ...rest },
              fieldState: { isTouched },
            }) => (
              <LocalizationProvider dateAdapter={DateFnsUtils}>
                <DatePicker
                  disableFuture
                  disabled={inputDisabled && formData.dob !== null}
                  // margin="normal"
                  id="dob"
                  label={lang === "en" ? "Date of Birth" : "आपका जन्मदिन"}
                  required
                  inputRef={ref}
                  focused={isTouched}
                  inputFormat="dd/MM/yyyy"
                  inputVariant="outlined"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.dob}
                      helperText={
                        errors.dob
                          ? errors.dob.type === "validate"
                            ? lang === "en"
                              ? "Age must be between 16 & 27"
                              : "आयु 16 या अधिक होनी चाहिए"
                            : lang === "en"
                            ? "Enter Date of Birth"
                            : "जन्मदिन दर्ज करें"
                          : "Ex. 19/11/2005"
                      }
                    />
                  )}
                  fullWidth
                  placeholder={lang === "en" ? "Date of Birth" : "आपका जन्मदिन"}
                  error={!!errors.dob}
                  {...rest}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /(6|7|8|9)\d{9}/,
              maxLength: 10,
            }}
            defaultValue={formData.whatsapp}
            name="whatsapp"
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                required
                fullWidth
                id="whatsapp"
                className={classes.spacing}
                inputRef={ref}
                onKeyPress={(e) => {
                  if (e.key === "e" || e.key === "+" || e.key === "-")
                    e.preventDefault();
                }}
                label={
                  lang === "en" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                placeholder={
                  lang === "en" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                type="number"
                autoComplete="off"
                error={!!errors.whatsapp}
                helperText={
                  errors.whatsapp
                    ? errors.whatsapp.type === "pattern" ||
                      errors.whatsapp.type === "maxLength"
                      ? lang === "en"
                        ? "No. should be of 10 digits"
                        : "नंबर 10 अंकों का होना चाहिए"
                      : lang === "en"
                      ? "Enter Whatsapp Number"
                      : "व्हाट्सएप नंबर दर्ज करें"
                    : "Ex. 99065xxxxx"
                }
                disabled={inputDisabled}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            defaultValue={formData.AlternateNumber}
            name="AlternateNumber"
            rules={{
              pattern: /(6|7|8|9)\d{9}/,
              maxLength: 10,
            }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="AlternateNumber"
                onKeyPress={(e) => {
                  if (e.key === "e" || e.key === "+" || e.key === "-")
                    e.preventDefault();
                }}
                type="tel"
                inputRef={ref}
                className={classes.spacing}
                label={lang === "en" ? "Alternate Number" : "वैकल्पिक नंबर"}
                placeholder={
                  lang === "en" ? "Alternate Number" : "वैकल्पिक नंबर"
                }
                autoComplete="off"
                error={!!errors.AlternateNumber}
                helperText={
                  errors.AlternateNumber
                    ? errors.AlternateNumber.type === "pattern" ||
                      errors.AlternateNumber.type === "maxLength"
                      ? lang === "en"
                        ? "No. should be of 10 digits"
                        : "नंबर 10 अंकों का होना चाहिए"
                      : lang === "en"
                      ? "Enter Alternate Number"
                      : "वैकल्पिक नंबर दर्ज करें"
                    : "Ex. 99065xxxxx"
                }
                disabled={inputDisabled}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            control={control}
            defaultValue={formData.email}
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
                className={classes.spacing}
                label={lang === "en" ? "Email" : "ईमेल"}
                placeholder={lang === "en" ? "Email" : "ईमेल"}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.type === "pattern"
                      ? lang === "en"
                        ? "Enter Valid Email"
                        : "मान्य ईमेल नंबर दर्ज करें"
                      : lang === "en"
                      ? "Enter Email"
                      : "ईमेल दर्ज करें"
                    : "Ex. xyz@mail.com"
                }
                autoComplete="off"
                fullWidth
                disabled={inputDisabled && formData.email !== null}
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
              validate: (gender) => {
                if (gender === "select gender") return false;
                if (gender === "female" || gender === "other") return true;
                enqueueSnackbar("Curently, Males cannot appear for the Test", {
                  variant: "info",
                });
                return false;
                // return true;
              },
            }}
            name="gender"
            defaultValue={formData.gender ? formData.gender : "select gender"}
            render={({ field: { ref, ...rest } }) => (
              <FormControl
                disabled={inputDisabled}
                variant="outlined"
                fullWidth
              >
                <InputLabel id="gender-label">
                  {lang === "en" ? "Select Gender" : "लिंग चुनें"}
                </InputLabel>
                <Select
                  label={lang === "en" ? "Select Gender" : "लिंग चुनें"}
                  error={!!errors.gender}
                  id="gender"
                  inputRef={ref}
                  placeholder={lang === "en" ? "Select Gender" : "लिंग चुनें"}
                  required
                  disabled={inputDisabled && formData.gender !== null}
                  {...rest}
                >
                  {[
                    ["Select Gender", "लिंग चुनें"],
                    ["Female", "महिला"],
                    ["Male", "पुरुष"],
                    ["Other", "अन्य"],
                  ].map((el) => (
                    <MenuItem
                      key={el[0]}
                      value={el[0].toLowerCase()}
                      disabled={el[0] === "Select Gender"}
                    >
                      {lang === "en" ? el[0] : el[1]}
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
              {lang === "en"
                ? "Please specify your gender"
                : "अपना लिंग निर्दिष्ट करें"}
            </Typography>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BasicDetails;
