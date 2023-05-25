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
import axios from "axios";
import { Controller } from "react-hook-form";
import { states, customPartner } from "../../../../utils/constants";

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

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

  const langOptions = {
    state: {
      en: "Select State",
      hi: "राज्य चुनें",
      ma: "राज्य निवडा",
      error: {
        en: "Select your State",
        hi: "अपना राज्य चुनें",
        ma: "तुमचे राज्य निवडा",
      },
    },
    district: {
      en: "Select District",
      hi: "जिला चुनें",
      ma: "जिल्हा निवडा",
      error: {
        en: "Select your District",
        hi: "अपना जिला चुनें",
        ma: "तुमचा जिल्हा निवडा",
      },
    },
    city: {
      en: "City",
      hi: "शहर",
      ma: "शहर",
      error: {
        en: "Select your City",
        hi: "अपना शहर चुनें",
        ma: "तुमचे शहर निवडा",
      },
    },
    pin_code: {
      en: "Pin Code",
      hi: "पिन कोड",
      ma: "पिन कोड",
      error: {
        en: "Enter your Pin Code",
        hi: "अपना पिन कोड दर्ज करें",
        ma: "तुमचा पिन कोड टाका",
        minLength: {
          en: "Enter a valid Pin Code",
          hi: "अपना शहर चुनें",
          ma: "वैध पिन कोड प्रविष्ट करा",
        },
      },
    },
    current_status: {
      en: "Current Status",
      hi: "वर्तमान स्थिति",
      ma: "वर्तमान स्थिती",
      error: {
        en: "Select your Current Status",
        hi: "अपनी वर्तमान स्थिति चुनें",
        ma: "तुमची वर्तमान स्थिती निवडा",
      },
    },
    qualification: {
      en: "Maximum Qualification",
      hi: "अधिकतम योग्यता",
      ma: "कमाल पात्रता",
      error: {
        en: "Select your Current Qualification",
        hi: "अपनी वर्तमान योग्यता चुनें",
        ma: "तुमची सध्याची पात्रता निवडा",
      },
    },
    class10th: {
      en: "Percentage in 10th class",
      hi: "10वीं कक्षा के प्रतिशत अंक",
      ma: "दहावीत टक्केवारी",
      error: {
        en: "Enter 10th Class Percentage",
        hi: "10वीं कक्षा के प्रतिशत अंक दर्ज करें",
        ma: "10वी वर्ग टक्केवारी प्रविष्ट करा",
        max: {
          en: "Enter valid Percentage",
          hi: "मान्य प्रतिशत दर्ज करें",
          ma: "वैध टक्केवारी प्रविष्ट करा",
        },
      },
    },
    class12th: {
      en: "Percentage in 12th class",
      hi: "12वीं कक्षा के प्रतिशत अंक",
      ma: "बारावीत टक्केवारी",
      error: {
        en: "Enter 12th Class Percentage",
        hi: "12वीं कक्षा के प्रतिशत अंक दर्ज करें",
        ma: "12वी वर्ग टक्केवारी प्रविष्ट करा",
        max: {
          en: "Enter valid Percentage",
          hi: "मान्य प्रतिशत दर्ज करें",
          ma: "वैध टक्केवारी प्रविष्ट करा",
        },
      },
    },
    graduate: {
      en: "Percentage in 12th class",
      hi: "12वीं कक्षा के प्रतिशत अंक",
      ma: "बारावीत टक्केवारी",
      error: {
        en: "Enter 12th Class Percentage",
        hi: "12वीं कक्षा के प्रतिशत अंक दर्ज करें",
        ma: "12वी वर्ग टक्केवारी प्रविष्ट करा",
        max: {
          en: "Enter valid Percentage",
          hi: "मान्य प्रतिशत दर्ज करें",
          ma: "वैध टक्केवारी प्रविष्ट करा",
        },
      },
    },
    iti: {
      en: "Percentage in ITI",
      hi: "ITI के प्रतिशत अंक",
      ma: "ITIमध्ये टक्केवारी",
      error: {
        en: "Enter ITI Percentage",
        hi: "ITI के प्रतिशत अंक दर्ज करें",
        ma: "ITIमध्ये टक्केवारी प्रविष्ट करा",
        max: {
          en: "Enter valid Percentage",
          hi: "मान्य प्रतिशत दर्ज करें",
          ma: "वैध टक्केवारी प्रविष्ट करा",
        },
      },
    },
    school_medium: {
      en: "School Medium",
      hi: "स्कूल माध्यम",
      ma: "शाळा माध्यम",
      error: {
        en: "Select your School Medium",
        hi: "अपना स्कूल माध्यम चुनें",
        ma: "तुमचे शाळेचे माध्यम निवडा",
      },
    },
    caste: {
      en: "Caste/Tribe",
      hi: "जाति/जनजाति",
      ma: "जात/जमाती",
      error: {
        en: "Select your Caste/Tribe",
        hi: "अपनी जाति/जनजाति चुनें",
        ma: "तुमची जात/जमाती निवडा",
      },
    },
    religion: {
      en: "Religion",
      hi: "धर्म",
      ma: "धर्म",
      error: {
        en: "Select your Religion",
        hi: "अपना धर्म चुनें",
        ma: "तुमचा धर्म निवडा",
      },
    },
  };

  const {
    inputDisabled,
    formData,
    reactForm: { errors, control, watch, setValue },
    partnerSlug,
  } = props;
  const { lang } = props;

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
    axios
      .get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${_state}/cities`, //API URL
        {
          headers: {
            "X-CSCAPI-KEY":
              "TzZrb2p0emtqa29BOW0zTnpLZHdzOVdjNmlubnRDMmtqOEgxRXpFdw==",
          },
        }
      )
      .then(({ data }) => {
        if (_state === "CT") {
          const newDis = { id: 0, name: "Dantewada" };
          data.push(newDis);
          data.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
        }
        setDistricts(data);
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
                    {langOptions.state[lang]}
                  </InputLabel>
                  <Select
                    data-cy="state-input"
                    error={!!errors.state}
                    required
                    inputRef={ref}
                    label={langOptions.state[lang]}
                    placeholder={langOptions.state[lang]}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                  >
                    <MenuItem value="" disabled>
                      {langOptions.state[lang]}
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
                {langOptions.state.error[lang]}
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
                    {langOptions.district[lang]}
                  </InputLabel>
                  <Select
                    data-cy="district-input"
                    error={!!errors.district}
                    required
                    inputRef={ref}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                    label={langOptions.district[lang]}
                    placeholder={langOptions.district[lang]}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                  >
                    <MenuItem value="" disabled>
                      {langOptions.district[lang]}
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
                {langOptions.district.error[lang]}
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
                  data-cy="city"
                  disabled={inputDisabled && formData.city !== null}
                  variant="outlined"
                  required
                  inputRef={ref}
                  {...rest}
                  fullWidth
                  id="city"
                  label={langOptions.city[lang]}
                  placeholder={langOptions.city[lang]}
                  autoComplete="off"
                  error={!!errors.city}
                  helperText={
                    errors.city ? langOptions.city.error[lang] : "Ex. Bangalore"
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
                  data-cy="pin-Input"
                  disabled={inputDisabled && formData.pin_code !== null}
                  variant="outlined"
                  required
                  fullWidth
                  id="pin_code"
                  inputRef={ref}
                  label={langOptions.pin_code[lang]}
                  placeholder={langOptions.pin_code[lang]}
                  autoComplete="off"
                  error={!!errors.pin_code}
                  helperText={
                    errors.pin_code
                      ? errors.pin_code.type === "minLength" ||
                        errors.pin_code.type === "maxLength"
                        ? langOptions.pin_code.error.minLength[lang]
                        : langOptions.pin_code.error[lang]
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
                    {langOptions.current_status[lang]}
                  </InputLabel>
                  <Select
                    data-cy="currentStatus"
                    disabled={
                      inputDisabled && formData.current_status !== undefined
                    }
                    error={!!errors.current_status}
                    label={langOptions.current_status[lang]}
                    placeholder={langOptions.current_status[lang]}
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
                {langOptions.current_status.error[lang]}
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
                    {langOptions.qualification[lang]}
                  </InputLabel>
                  <Select
                    data-cy="maxQualification"
                    label={langOptions.qualification[lang]}
                    placeholder={langOptions.qualification[lang]}
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
                      <MenuItem value="lessThan10th">
                        Less than 10th pass
                      </MenuItem>
                    )}
                    {partnerSlug &&
                      customPartner.includes(partnerSlug) ? null : (
                      <MenuItem value="class10th">10th pass</MenuItem>
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
                {langOptions.qualification.error[lang]}
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
                rules={{ required: true, max: 100, min: 33 }}
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
                    label={langOptions.class10th[lang]}
                    placeholder={langOptions.class10th[lang]}
                    type="number"
                    autoComplete="off"
                    error={!!errors.percentage_in10th}
                    helperText={
                      errors.percentage_in10th
                        ? errors.percentage_in10th.type === "max" ||
                          errors.percentage_in10th.type === "min"
                          ? langOptions.class10th.error.max[lang]
                          : langOptions.class10th.error[lang]
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
                    min: 33,
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
                      label={langOptions.class10th[lang]}
                      placeholder={langOptions.class10th[lang]}
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in10th}
                      helperText={
                        errors.percentage_in10th
                          ? errors.percentage_in10th.type === "max" ||
                            errors.percentage_in10th.type === "min"
                            ? langOptions.class10th.error.max[lang]
                            : langOptions.class10th.error[lang]
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
                    min: 33,
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
                        langOptions[qualification][lang]
                        // lang === "en"
                        //   ? `Percentage in ${
                        //       qualification === "iti" ? "ITI" : "12th class"
                        //     }`
                        //   : `${
                        //       qualification === "iti" ? "ITI" : "12वीं कक्षा"
                        //     } के प्रतिशत अंक`
                      }
                      placeholder={
                        langOptions[qualification][lang]
                        // lang === "en"
                        //   ? `Percentage in ${
                        //       qualification === "iti" ? "ITI" : "12th class"
                        //     }`
                        //   : `${
                        //       qualification === "iti" ? "ITI" : "12वीं कक्षा"
                        //     } के प्रतिशत अंक`
                      }
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in12th}
                      helperText={
                        errors.percentage_in12th
                          ? errors.percentage_in12th.type === "min" ||
                            errors.percentage_in12th.type === "max"
                            ? langOptions[qualification].error.max[lang]
                            : langOptions[qualification].error[lang]
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
                    {langOptions.school_medium[lang]}
                  </InputLabel>
                  <Select
                    data-cy="schoolMedium"
                    label={langOptions.school_medium[lang]}
                    placeholder={langOptions.school_medium[lang]}
                    error={!!errors.school_medium}
                    required
                    inputRef={ref}
                    {...rest}
                    disabled={
                      inputDisabled && formData.school_medium !== undefined
                    }
                  >
                    <MenuItem value="" disabled>
                      {langOptions.school_medium[lang]}
                    </MenuItem>

                    {Object.entries({
                      hi: ["Hindi", "हिन्दी"],
                      en: ["English", "अंग्रेज़ी"],
                      ma: ["Marathi", "मराठी"],
                      ur: ["Urdu", "उर्दू"],
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
                {langOptions.school_medium.error[lang]}
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
                      {langOptions.caste[lang]}
                    </InputLabel>
                    <Select
                      label={langOptions.caste[lang]}
                      placeholder={langOptions.caste[lang]}
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
                  {langOptions.caste.error[lang]}
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
                    {langOptions.religion[lang]}
                  </InputLabel>
                  <Select
                    data-cy="religion-input"
                    label={langOptions.religion[lang]}
                    placeholder={langOptions.religion[lang]}
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
                {langOptions.religion.error[lang]}
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
