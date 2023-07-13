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
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { INPUT_PATTERNS } from "../../../../utils/constants.js";

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

const langOptions = {
  ProfileImage: {
    en: "Profile Image*",
    hi: "Profile Image*",
    ma: "Profile Image*",
    error: {
      en: "Required Field",
      hi: "आवश्यक क्षेत्र",
      ma: "आवश्यक फील्ड",
    },
  },
  FirstName: {
    en: "First Name",
    hi: "प्रथम नाम",
    ma: "पहिले नाव",
    error: {
      en: "Enter First Name",
      hi: "प्रथम नाम दर्ज करें",
      ma: "प्रथम नाव प्रविष्ट करा",
    },
  },
  MiddleName: {
    en: "Middle Name",
    hi: "मध्यनाम",
    ma: "मधले नाव",
    error: {
      en: "Enter Middle Name",
      hi: "मध्यनाम नाम दर्ज करें",
      ma: "मधले नाव प्रविष्ट करा",
    },
  },
  LastName: {
    en: "Last Name",
    hi: "कुलनाम",
    ma: "आडनाव",
    error: {
      en: "Enter Last Name",
      hi: "कुलनाम नाम दर्ज करें",
      ma: "आडनाव प्रविष्ट करा",
    },
  },
  dob: {
    en: "Date of Birth",
    hi: "जन्मदिन",
    ma: "जन्मदिवस",
    error: {
      en: "Enter Date of Birth",
      hi: "जन्मदिन दर्ज करें",
      ma: "जन्मदिवस टाका",
      validate: {
        en: "Age must be between 17 & 28",
        hi: "उम्र 17 से 28 के बीच होनी चाहिए",
        ma: "वय 17 आणि 28 च्या दरम्यान असावे",
      },
    },
  },
  whatsapp: {
    en: "Your Whatsapp Number",
    hi: "आपका व्हाट्सएप नंबर",
    ma: "तुमचा Whatsapp नंबर",
    error: {
      en: "Enter Whatsapp Number",
      hi: "व्हाट्सएप नंबर दर्ज करें",
      ma: "Whatsapp नंबर टाका",
      pattern: {
        en: "No. should be of 10 digits",
        hi: "नंबर 10 अंकों का होना चाहिए",
        ma: "क्रमांक 10 अंकांचा असावा",
      },
    },
  },
  AlternateNumber: {
    en: "Alternate Number",
    hi: "वैकल्पिक नंबर",
    ma: "पर्यायी क्रमांक",
    error: {
      en: "Enter Alternate Number",
      hi: "वैकल्पिक नंबर दर्ज करें",
      ma: "पर्यायी क्रमांक प्रविष्ट करा",
      pattern: {
        en: "No. should be of 10 digits",
        hi: "नंबर 10 अंकों का होना चाहिए",
        ma: "क्रमांक 10 अंकांचा असावा",
      },
    },
  },
  email: {
    en: "Email",
    hi: "ईमेल",
    ma: "ईमेल",
    error: {
      en: "Enter Email",
      hi: "ईमेल दर्ज करें",
      ma: "ईमेल प्रविष्ट करा",
      pattern: {
        en: "Enter Valid Email",
        hi: "मान्य ईमेल नंबर दर्ज करें",
        ma: "वैध ईमेल प्रविष्ट करा",
      },
    },
  },
  gender: {
    en: "Select Gender",
    hi: "लिंग चुनें",
    ma: "लिंग निवडा",
    options: [
      {
        key: "select gender",
        en: "Select Gender",
        hi: "लिंग चुनें",
        ma: "लिंग निवडा",
      },
      { key: "female", en: "Female", hi: "महिला", ma: "स्त्री" },
      { key: "male", en: "Male", hi: "पुरुष", ma: "पुरुष" },
      // {key:"other", en: "Other", hi: "अन्य", ma: "इतर" },
      { key: "trans", en: "Transgender", hi: "ट्रांसवुमेन", ma: "ट्रांसवुमेन" },
    ],
    error: {
      en: "Please specify your gender",
      hi: "अपना लिंग निर्दिष्ट करें",
      ma: "कृपया तुमचे लिंग निर्दिष्ट करा",
    },
  },
};

const BasicDetails = ({
  lang,
  formData,
  setProfileImage,
  inputDisabled,
  reactForm: { register, errors, control },
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const uploadProfilePhoto = (e) => {
    const file = e.target.files[0];
    //check if file size is greater than 1mb
    if (file.size > 5000000) {
      enqueueSnackbar("File size should not exceed 1MB", { variant: "error" });
      return;
    }
    setProfileImage(file);
  };

  const date = new Date();
  const currentDate = date.getDate();
  const month = date.getMonth();
  const maxDate = date.getFullYear() - 17;
  const minDate = date.getFullYear() - 28;

  return (
    <Container maxWidth="lg" align="center">
      {/* {pfpCompulsion ?  */}
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
            data-cy="avatarImg"
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
          {langOptions.ProfileImage[lang]}
        </Typography>
        {errors.ProfileImage ? (
          <Typography
            style={{ paddingTop: "-0.2rem" }}
            variant="caption"
            color="error"
          >
            {langOptions.ProfileImage.error[lang]}
          </Typography>
        ) : (
          ""
        )}
      </label>
      <input
        onChange={(e) => uploadProfilePhoto(e)}
        data-cy="imageInput"
        id="ProfileImage"
        type="file"
        name="ProfileImage"
        style={{ display: "none" }}
        required={true}
        error
        disabled={inputDisabled && formData.ProfileImage !== null}
        accept=".png,.jpg,.jpeg"
      />
      {/* <label style={{
        cursor: inputDisabled ? "default" : "pointer",
      }} htmlFor="ProfileImage">
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
                ? URL.createObjectURL(formData.ProfileImage.length ? formData.ProfileImage[0] : formData.ProfileImage)
                : formData.PrevImage
            }
          />
        </Badge>
        <Typography variant="h6" className={classes.text} color={errors.ProfileImage && "error"}>
          {langOptions.ProfileImage[lang]}
        </Typography>
        <input
          type="file"
          id="ProfileImage"
          {...register("ProfileImage", {
            // required: "Profile image is required",
            validate: {
              required: (_, formData) => formData.ProfileImage.length > 0 || "Profile image is required",
              fileSize: (value) =>
                value[0].size < 1000000 || "Profile image size should be less than 1MB",
              fileType: (value) =>
                /jpeg|jpg|png/.test(value[0].type) ||
                "Only JPEG, JPG, and PNG image formats are allowed",
            },
            onChange: (e) => uploadProfilePhoto(e)
          })}
          style={{ display: "none" }}
          // error
          disabled={inputDisabled && formData.ProfileImage !== null}
          accept=".png,.jpg,.jpeg"
        />
        {errors.ProfileImage && (
          <Typography variant="caption" color="error">
            {errors.ProfileImage.message}
          </Typography>
        )}
      </label> */}

      <Grid style={{ paddingTop: "1.2rem" }} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            name="FirstName"
            rules={{
              required: true,
              pattern: INPUT_PATTERNS.name, //allow anything that is chinese, hindi, english, and Apostrophe
            }}
            defaultValue={formData.FirstName}
            render={({ field: { ref, onChange, ...rest } }) => (
              <TextField
                data-cy="firstName-input"
                variant="outlined"
                fullWidth
                id="FirstName"
                inputRef={ref}
                onBlur={rest.onBlur}
                className={classes.spacing}
                label={langOptions.FirstName[lang]}
                placeholder={langOptions.FirstName[lang]}
                autoComplete="off"
                type="text"
                error={!!errors.FirstName}
                helperText={
                  errors.FirstName
                    ? langOptions.FirstName.error[lang]
                    : "Ex. XYZ"
                }
                disabled={inputDisabled && formData.FirstName !== null}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    INPUT_PATTERNS.replaceName,
                    ""
                  );
                  onChange(newValue);
                }}
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
            render={({ field: { ref, onChange, ...rest } }) => (
              <TextField
                data-cy="middleName-input"
                variant="outlined"
                id="MiddleName"
                inputRef={ref}
                className={classes.spacing}
                label={langOptions.MiddleName[lang]}
                placeholder={langOptions.MiddleName[lang]}
                autoComplete="off"
                error={!!errors.MiddleName}
                type="text"
                helperText={
                  errors.MiddleName
                    ? langOptions.MiddleName.error[lang]
                    : "Ex. PQR"
                }
                disabled={inputDisabled && formData.MiddleName !== null}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    INPUT_PATTERNS.replaceName,
                    ""
                  );
                  onChange(newValue);
                }}
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
            render={({ field: { ref, onChange, ...rest } }) => (
              <TextField
                data-cy="lastName-input"
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
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    INPUT_PATTERNS.replaceName,
                    ""
                  );
                  onChange(newValue);
                }}
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
                parseInt(dayjs().diff(dayjs(dob), "year"), 10) >= 17 &&
                parseInt(dayjs().diff(dayjs(dob), "year"), 10) <= 28,
            }}
            render={({
              field: { ref, ...rest },
              fieldState: { isTouched },
            }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  data-cy="dob"
                  disableFuture
                  disabled={inputDisabled && formData.dob !== null}
                  id="dob"
                  label={langOptions.dob[lang]}
                  required
                  openTo="year"
                  inputRef={ref}
                  focused={isTouched}
                  inputVariant="outlined"
                  minDate={new Date(`${minDate}-${month + 1}-${currentDate}`)}
                  maxDate={new Date(`${maxDate}-${month + 1}-${currentDate}`)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!!errors.dob}
                      required
                      helperText={
                        errors.dob
                          ? errors.dob.type === "validate"
                            ? langOptions.dob.error.validate[lang]
                            : langOptions.dob.error[lang]
                          : "Ex. 19/11/2003"
                      }
                    />
                  )}
                  fullWidth
                  placeholder={langOptions.dob[lang]}
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
            render={({ field: { ref, onChange, ...rest } }) => (
              <TextField
                data-cy="waInput"
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
                label={langOptions.whatsapp[lang]}
                placeholder={langOptions.whatsapp[lang]}
                type="tel"
                autoComplete="off"
                error={!!errors.whatsapp}
                helperText={
                  errors.whatsapp
                    ? errors.whatsapp.type === "pattern" ||
                      errors.whatsapp.type === "maxLength"
                      ? langOptions.whatsapp.error.pattern[lang]
                      : langOptions.whatsapp.error[lang]
                    : "Ex. 99065xxxxx"
                }
                disabled={inputDisabled}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    INPUT_PATTERNS.numbersOnly,
                    ""
                  );
                  onChange(newValue);
                }}
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
            render={({ field: { ref, onChange, ...rest } }) => (
              <TextField
                data-cy="altInput"
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
                label={langOptions.AlternateNumber[lang]}
                placeholder={langOptions.AlternateNumber[lang]}
                autoComplete="off"
                error={!!errors.AlternateNumber}
                helperText={
                  errors.AlternateNumber
                    ? errors.AlternateNumber.type === "pattern" ||
                      errors.AlternateNumber.type === "maxLength"
                      ? langOptions.AlternateNumber.error.pattern[lang]
                      : langOptions.AlternateNumber.error[lang]
                    : "Ex. 99065xxxxx"
                }
                disabled={inputDisabled}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    INPUT_PATTERNS.numbersOnly,
                    ""
                  );
                  onChange(newValue);
                }}
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
                data-cy="email-input"
                variant="outlined"
                inputRef={ref}
                type="email"
                required
                className={classes.spacing}
                label={langOptions.email[lang]}
                placeholder={langOptions.email[lang]}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.type === "pattern"
                      ? langOptions.email.error.pattern[lang]
                      : langOptions.email.error[lang]
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
                if (gender === "male") {
                  enqueueSnackbar("Currently, Males admission is full.", {
                    variant: "info",
                  });
                  return false;
                }
                if (
                  gender === "female" ||
                  gender === "other" ||
                  gender === "trans"
                ) {
                  return true;
                }
              },
            }}
            name="gender"
            defaultValue={formData.gender ? formData.gender : "select gender"}
            render={({ field: { ref, ...rest } }) => (
              <FormControl
                disabled={inputDisabled}
                variant="outlined"
                required
                fullWidth
                error={errors.gender}
              >
                <InputLabel id="gender-label">
                  {langOptions.gender[lang]}
                </InputLabel>
                <Select
                  data-cy="genderDropdown"
                  label={langOptions.gender[lang]}
                  placeholder={langOptions.gender[lang]}
                  error={!!errors.gender}
                  id="gender"
                  inputRef={ref}
                  required
                  disabled={inputDisabled && formData.gender !== null}
                  {...rest}
                >
                  {langOptions.gender.options.map((el) => (
                    <MenuItem
                      data-cy={el.key}
                      key={el.key}
                      value={el.key}
                      disabled={el.en === "Select Gender"}
                    >
                      {el[lang]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {errors.gender ? (
            <Typography
              data-cy="genderFeedback"
              style={{
                paddingLeft: "0.8rem",
                paddingTop: "0.4rem",
                paddingBottom: "0.4rem",
              }}
              variant="caption"
              color="error"
            >
              {langOptions.gender.error[lang]}
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
