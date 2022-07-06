/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  Container,
  TextField,
  Paper,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { states } from "../../../../utils/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  text: {
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  menuPaper: {
    maxHeight: 300,
  },
}));

function OtherDetails(props) {
  const classes = useStyles();
  // let casteOptions = ["", "obc", "scSt", "general", "others"];
  // let qualificationOptions = [
  //   "",
  //   "lessThan10th",
  //   "class10th",
  //   "class12th",
  //   "graduate",
  //   "ba",
  //   "bcom",
  //   "mcom",
  //   "msc",
  //   "bca",
  //   "bsc",
  //   "bba",
  // ];
  // let religionOptions = ["", "hindu", "islam", "sikh", "jain", "christian", "others"];

  // let CurrentStatusOptions = ["", "nothing", "job", "study", "other"];
  // let schoolMediumOptipns = ["", "en", "other"];
  const {
    inputDisabled,
    formData,
    reactForm: { errors, control, watch, setValue },
    partnerSlug,
  } = props;
  const { lang } = props;

  const customPartner = ["amravati", "breakthrough"];

  const [districts, setDistricts] = useState([]);
  async function getCityFromState(_state) {
    if (partnerSlug && customPartner.includes(partnerSlug)) {
      const newDistricts = [
        { name: "Amravati" },
        {
          name: "Akola",
        },
        { name: "Bhandara" },
        {
          name: "Buldhana",
        },
        {
          name: "Chandrapur",
        },
        { name: "Gadchiroli" },
        { name: "Gondia" },
        { name: "Nagpur" },
        { name: "Wardha" },
        {
          name: "Washim",
        },
        {
          name: "Yavatmal",
        },
      ];
      setDistricts(newDistricts);
      return;
    }
    fetch(
      `https://api.countrystatecity.in/v1/countries/IN/states/${_state}/cities`, //API URL
      {
        headers: {
          accept: "application/json",
          "X-CSCAPI-KEY":
            "TzZrb2p0emtqa29BOW0zTnpLZHdzOVdjNmlubnRDMmtqOEgxRXpFdw==",
        },
      }
    ).then((response) => {
      response.json().then((data) => {
        setDistricts(data);
      });
    });
  }

  const addrState = watch("state");
  const qualification = watch("qualification");

  useEffect(() => {
    if (addrState !== "") {
      if (!inputDisabled) setValue("district", "");
      getCityFromState(addrState);
    }
  }, [addrState]);

  return (
    <Container maxWidth="lg" align="center" className={classes.container}>
      {/* <div className={classes.root}> */}
      <Paper square elevation={0} className={classes.textField} align="left">
        <Grid style={{ paddingTop: "1.2rem" }} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              defaultValue={formData.state || ""}
              name="state"
              rules={{ required: true, validate: (st) => st !== "" }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled && formData.state !== null}
                  fullWidth
                  variant="outlined"
                  required
                >
                  <InputLabel id="state-label">
                    {lang === "en" ? "Select State" : "राज्य चुनें"}
                  </InputLabel>
                  <Select
                    error={!!errors.state}
                    required
                    inputRef={ref}
                    label={lang === "en" ? "Select State" : "राज्य चुनें"}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                  >
                    <MenuItem value="" disabled>
                      {lang === "en" ? "Select State" : "राज्य चुनें"}
                    </MenuItem>
                    {Object.entries(
                      partnerSlug && customPartner.includes(partnerSlug)
                        ? { MH: "Maharashtra" }
                        : states
                    ).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.state ? (
              <Typography
                style={{
                  paddingLeft: "0.8rem",
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
                variant="caption"
                color="error"
              >
                {lang === "en" ? "Select your State" : "अपना राज्य चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              defaultValue={formData.district || ""}
              name="district"
              className={classes.spacing}
              rules={{
                required: true,
                validate: (district) => district !== "",
              }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled && formData.district !== null}
                  fullWidth
                  variant="outlined"
                  required
                >
                  <InputLabel id="district-label">
                    {lang === "en" ? "Select District" : "जिला चुनें"}
                  </InputLabel>
                  <Select
                    error={!!errors.district}
                    required
                    inputRef={ref}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                    label={lang === "en" ? "Select District" : "जिला चुनें"}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                  >
                    <MenuItem value="" disabled>
                      {lang === "en" ? "Select District" : "जिला चुनें"}
                    </MenuItem>
                    {districts.map((key) => (
                      <MenuItem key={key.name} value={key.name}>
                        {key.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.district ? (
              <Typography
                style={{
                  paddingLeft: "0.8rem",
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
                variant="caption"
                color="error"
              >
                {lang === "en" ? "Select your District" : "अपना जिला चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              defaultValue={formData.city}
              name="city"
              rules={{ required: "true" }}
              render={({ field: { ref, ...rest } }) => (
                <TextField
                  disabled={inputDisabled && formData.city !== null}
                  variant="outlined"
                  required
                  inputRef={ref}
                  {...rest}
                  fullWidth
                  id="city"
                  label={lang === "en" ? "City" : "शहर"}
                  placeholder={lang === "en" ? "City" : "शहर"}
                  autoComplete="off"
                  error={!!errors.city}
                  helperText={
                    errors.city
                      ? lang === "en"
                        ? "Select your City"
                        : "अपना शहर चुनें"
                      : "Ex. Bangalore"
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              rules={{ required: true, minLength: 6, maxLength: 6 }}
              defaultValue={formData.pin_code}
              name="pin_code"
              render={({ field: { ref, ...rest } }) => (
                <TextField
                  disabled={inputDisabled && formData.pin_code !== null}
                  variant="outlined"
                  required
                  fullWidth
                  id="pin_code"
                  inputRef={ref}
                  label={lang === "en" ? "Pin code" : "पिन कोड"}
                  placeholder={lang === "en" ? "Pin code" : "पिन कोड"}
                  autoComplete="off"
                  error={!!errors.pin_code}
                  helperText={
                    errors.pin_code
                      ? errors.pin_code.type === "minLength" ||
                        errors.pin_code.type === "maxLength"
                        ? lang === "en"
                          ? "Enter a valid Pin Code"
                          : "एक मान्य पिन कोड दर्ज करें"
                        : lang === "en"
                        ? "Enter your Pin Code"
                        : "अपना पिन कोड दर्ज करें"
                      : "Ex. 4402xx"
                  }
                  {...rest}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              rules={{
                required: "true",
                validate: (ct) => ct !== "Select Option",
              }}
              defaultValue={formData.current_status || "Select Option"}
              name="current_status"
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={
                    inputDisabled && formData.current_status !== undefined
                  }
                  fullWidth
                  variant="outlined"
                  required
                >
                  <InputLabel id="current-status-label">
                    {lang === "en" ? "Current Status" : "वर्तमान स्थिति"}
                  </InputLabel>
                  <Select
                    disabled={
                      inputDisabled && formData.current_status !== undefined
                    }
                    error={!!errors.current_status}
                    label={lang === "en" ? "Current Status" : "वर्तमान स्थिति"}
                    required
                    inputRef={ref}
                    {...rest}
                  >
                    <MenuItem value="Select Option" disabled>
                      Select Option
                    </MenuItem>
                    {["Nothing", "Job", "Study", "Other"].map((el) => (
                      <MenuItem key={el} value={el.toLowerCase()}>
                        {el}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.current_status ? (
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
                  ? "Select your Current Status"
                  : "अपनी वर्तमान स्थिति चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              rules={{ required: "true", validate: (q) => q !== "" }}
              defaultValue={formData.qualification || ""}
              name="qualification"
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={
                    inputDisabled && formData.qualification !== undefined
                  }
                  variant="outlined"
                  fullWidth
                  required
                >
                  <InputLabel id="qualification-label">
                    {lang === "en" ? "Maximum Qualification" : "अधिकतम योग्यता"}
                  </InputLabel>
                  <Select
                    label={
                      lang === "en" ? "Maximum Qualification" : "अधिकतम योग्यता"
                    }
                    error={!!errors.qualification}
                    required
                    inputRef={ref}
                    {...rest}
                  >
                    <MenuItem value="" disabled>
                      Select Option
                    </MenuItem>
                    {partnerSlug &&
                    customPartner.includes(partnerSlug) ? null : (
                      <>
                        <MenuItem value="lessThan10th">
                          Less than 10th pass
                        </MenuItem>
                        <MenuItem value="class10th">10th pass</MenuItem>
                      </>
                    )}
                    <MenuItem value="class12th">12th pass</MenuItem>
                    <MenuItem value="graduate">Graduated</MenuItem>
                    {partnerSlug && customPartner.includes(partnerSlug) ? (
                      <MenuItem value="iti">ITI</MenuItem>
                    ) : null}
                  </Select>
                </FormControl>
              )}
            />
            {errors.qualification ? (
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
                  ? "Select your Current Qualification"
                  : "अपनी वर्तमान योग्यता चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          {qualification === "class10th" ? (
            <Grid item xs={12} sm={12}>
              <Controller
                control={control}
                defaultValue={formData.percentage_in10th}
                rules={{ required: true, max: 100 }}
                name="percentage_in10th"
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    disabled={
                      inputDisabled && formData.percentage_in10th !== null
                    }
                    variant="outlined"
                    required
                    inputRef={ref}
                    {...rest}
                    fullWidth
                    label={
                      lang === "en"
                        ? "Percentage in 10th class"
                        : "10वीं कक्षा के प्रतिशत अंक"
                    }
                    placeholder={
                      lang === "en"
                        ? "Percentage in 10th class"
                        : "10वीं कक्षा के प्रतिशत अंक"
                    }
                    type="number"
                    autoComplete="off"
                    error={!!errors.percentage_in10th}
                    helperText={
                      errors.percentage_in10th
                        ? errors.percentage_in10th.type === "max"
                          ? lang === "en"
                            ? "Enter valid Percentage"
                            : "मान्य प्रतिशत दर्ज करें"
                          : lang === "en"
                          ? "Enter 10th Class Percentage"
                          : "10वीं कक्षा के प्रतिशत अंक दर्ज करें"
                        : "Ex. 86.40"
                    }
                  />
                )}
              />
            </Grid>
          ) : null}
          {qualification === "class12th" ||
          qualification === "graduate" ||
          qualification === "iti" ? (
            <>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  defaultValue={formData.percentage_in10th}
                  rules={{
                    required: !customPartner.includes(partnerSlug),
                    max: 100,
                  }}
                  name="percentage_in10th"
                  render={({ field: { ref, ...rest } }) => (
                    <TextField
                      disabled={
                        inputDisabled && formData.percentage_in10th !== null
                      }
                      variant="outlined"
                      required={!customPartner.includes(partnerSlug)}
                      inputRef={ref}
                      {...rest}
                      fullWidth
                      label={
                        lang === "en"
                          ? "Percentage in 10th class"
                          : "10वीं कक्षा के प्रतिशत अंक"
                      }
                      placeholder={
                        lang === "en"
                          ? "Percentage in 10th class"
                          : "10वीं कक्षा के प्रतिशत अंक"
                      }
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in10th}
                      helperText={
                        errors.percentage_in10th
                          ? errors.percentage_in10th.type === "max"
                            ? lang === "en"
                              ? "Enter valid Percentage"
                              : "मान्य प्रतिशत दर्ज करें"
                            : lang === "en"
                            ? "Enter 10th Class Percentage"
                            : "10वीं कक्षा के प्रतिशत अंक दर्ज करें"
                          : "Ex. 86.40"
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  name="percentage_in12th"
                  rules={{
                    required: !customPartner.includes(partnerSlug),
                    max: 100,
                  }}
                  defaultValue={formData.percentage_in12th}
                  render={({ field: { ref, ...rest } }) => (
                    <TextField
                      disabled={
                        inputDisabled && formData.percentage_in12th !== null
                      }
                      variant="outlined"
                      required={!customPartner.includes(partnerSlug)}
                      inputRef={ref}
                      {...rest}
                      fullWidth
                      label={
                        lang === "en"
                          ? `Percentage in ${
                              qualification === "iti" ? "ITI" : "12th class"
                            }`
                          : `${
                              qualification === "iti" ? "ITI" : "12वीं कक्षा"
                            } के प्रतिशत अंक`
                      }
                      placeholder={
                        lang === "en"
                          ? `Percentage in ${
                              qualification === "iti" ? "ITI" : "12th class"
                            }`
                          : `${
                              qualification === "iti" ? "ITI" : "12वीं कक्षा"
                            } के प्रतिशत अंक`
                      }
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in12th}
                      helperText={
                        errors.percentage_in12th
                          ? errors.percentage_in12th.type === "max"
                            ? lang === "en"
                              ? "Enter valid Percentage"
                              : "मान्य प्रतिशत दर्ज करें"
                            : lang === "en"
                            ? `Enter ${
                                qualification === "iti" ? "ITI" : "Class 12th"
                              } Percentage`
                            : `${
                                qualification === "iti" ? "ITI" : "12वीं कक्षा"
                              } के प्रतिशत अंक दर्ज करें`
                          : "Ex. 76.40"
                      }
                    />
                  )}
                />
              </Grid>
            </>
          ) : null}
          <Grid item xs={12}>
            <Controller
              control={control}
              name="school_medium"
              defaultValue={formData.school_medium || ""}
              rules={{ required: true, validate: (sm) => sm !== "" }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={
                    inputDisabled && formData.school_medium !== undefined
                  }
                  fullWidth
                  variant="outlined"
                  required
                >
                  <InputLabel id="school-medium-label">
                    {lang === "en" ? "School Medium" : "स्कूल माध्यम"}
                  </InputLabel>
                  <Select
                    label={lang === "en" ? "School Medium" : "स्कूल माध्यम"}
                    error={!!errors.school_medium}
                    required
                    inputRef={ref}
                    {...rest}
                    disabled={
                      inputDisabled && formData.school_medium !== undefined
                    }
                  >
                    <MenuItem value="" disabled>
                      {lang === "en" ? "Select Langauge" : "भाषा चुने"}
                    </MenuItem>

                    {Object.entries({
                      hi: ["Hindi", "हिन्दी"],
                      en: ["English", "अंग्रेज़ी"],
                      ma: ["Marathi", "मराठी"],
                    }).map(([key, value]) => (
                      <MenuItem value={key} key={key}>
                        {value[lang === "en" ? 0 : 1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.school_medium ? (
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
                  ? "Select your School Medium"
                  : "अपना स्कूल माध्यम चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          {customPartner.includes(partnerSlug) ? null : (
            <Grid item xs={12}>
              <Controller
                control={control}
                name="caste"
                defaultValue={formData.caste || "Select Option"}
                rules={{
                  required: true,
                  validate: (caste) => caste !== "Select Option",
                }}
                render={({ field: { ref, ...rest } }) => (
                  <FormControl
                    disabled={inputDisabled && formData.caste !== undefined}
                    fullWidth
                    variant="outlined"
                    required
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      {lang === "en" ? " Caste/Tribe" : "जाति/जनजाति"}
                    </InputLabel>
                    <Select
                      label={lang === "en" ? " Caste/Tribe" : "जाति/जनजाति"}
                      error={!!errors.caste}
                      required
                      inputRef={ref}
                      {...rest}
                    >
                      <MenuItem value="Select Option" disabled>
                        Select Option
                      </MenuItem>
                      <MenuItem value="scSt">
                        (SC) Scheduled Caste / (ST) Scheduled Tribe
                      </MenuItem>
                      <MenuItem value="obc">
                        (OBC) Other Backward Classes
                      </MenuItem>
                      <MenuItem value="general">General</MenuItem>
                      <MenuItem value="others">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.caste ? (
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
                    ? "Select your Caste/Tribe"
                    : "अपनी जाति/जनजाति चुनें"}
                </Typography>
              ) : (
                ""
              )}
            </Grid>
          )}
          <Grid item xs={12}>
            <Controller
              control={control}
              name="religion"
              defaultValue={formData.religion || ""}
              rules={{ required: true }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled && formData.religion !== undefined}
                  required
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="religion-label">
                    {lang === "en" ? "Religion" : "धर्म"}
                  </InputLabel>
                  <Select
                    label={lang === "en" ? "Religion" : "धर्म"}
                    required
                    inputRef={ref}
                    error={!!errors.religion}
                    {...rest}
                  >
                    <MenuItem value="" disabled>
                      Select Option
                    </MenuItem>
                    <MenuItem value="hindu">Hindu</MenuItem>
                    <MenuItem value="islam">Islam</MenuItem>
                    <MenuItem value="sikh">Sikh</MenuItem>
                    <MenuItem value="christian">Christian</MenuItem>
                    <MenuItem value="jain">Jain</MenuItem>
                    <MenuItem value="buddhism">Buddhism</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            {errors.religion ? (
              <Typography
                style={{
                  paddingLeft: "0.8rem",
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
                variant="caption"
                color="error"
              >
                {lang === "en" ? "Select your Religion" : "अपना धर्म चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default OtherDetails;
