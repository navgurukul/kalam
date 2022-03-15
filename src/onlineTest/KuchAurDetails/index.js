import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {
  Grid,
  TextField,
  Paper,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import { Controller } from "react-hook-form";
import { state } from "./Constant";
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

function KuchAurDetails(props) {
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
  } = props;
  let lang = props.lang;

  const [districts, setDistricts] = useState([]);
  async function getCityFromState(state) {
    fetch(
      `https://api.countrystatecity.in/v1/countries/IN/states/${state}/cities`, //API URL
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
        //console.log(districts);
      });
    });
  }

  const addr_state = watch("state");
  const qualification = watch("qualification");

  useEffect(() => {
    if (addr_state !== "") {
      if (!inputDisabled) setValue("district", "");
      getCityFromState(addr_state);
    }
  }, [addr_state]);

  return (
    <Container maxWidth="lg" align="center" className={classes.container}>
      {/* <div className={classes.root}> */}
      <Paper square elevation={0} className={classes.textField} align="left">
        <Grid style={{ paddingTop: "1.2rem" }} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              defaultValue={formData.state}
              name="state"
              rules={{ required: true, validate: (st) => st !== "" }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="state-label">
                    {lang == "En" ? "Select State" : "राज्य चुनें"}
                  </InputLabel>
                  <Select
                    error={!!errors.state}
                    required
                    inputRef={ref}
                    label={lang == "En" ? "Select State" : "राज्य चुनें"}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                    {...rest}
                  >
                    <MenuItem value={""} disabled>
                      {lang == "En" ? "Select State" : "राज्य चुनें"}
                    </MenuItem>
                    {Object.keys(state).map((key, index) => {
                      return (
                        <MenuItem key={index} value={key}>
                          {state[key]}
                        </MenuItem>
                      );
                    })}
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
                {lang === "En" ? "Select your State" : "अपना राज्य चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              defaultValue={formData.district}
              name="district"
              className={classes.spacing}
              rules={{
                required: true,
                validate: (district) => district !== "",
              }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="district-label">
                    {lang == "En" ? "Select District" : "जिला चुनें"}
                  </InputLabel>
                  <Select
                    error={!!errors.district}
                    required
                    inputRef={ref}
                    {...rest}
                    label={lang == "En" ? "Select District" : "जिला चुनें"}
                    MenuProps={{ classes: { paper: classes.menuPaper } }}
                  >
                    <MenuItem value={""} disabled>
                      {lang == "En" ? "Select District" : "जिला चुनें"}
                    </MenuItem>
                    {districts.map((key, index) => {
                      return (
                        <MenuItem key={index} value={key["name"]}>
                          {key["name"]}
                        </MenuItem>
                      );
                    })}
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
                {lang === "En" ? "Select your District" : "अपना जिला चुनें"}
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
                  disabled={inputDisabled}
                  variant="outlined"
                  required
                  inputRef={ref}
                  {...rest}
                  fullWidth
                  id="city"
                  label={lang == "En" ? "City" : "शहर"}
                  placeholder={lang == "En" ? "City" : "शहर"}
                  autoComplete="off"
                  error={!!errors.city}
                  helperText={
                    errors.city
                      ? lang === "En"
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
                  disabled={inputDisabled}
                  variant="outlined"
                  required
                  fullWidth
                  id="pin_code"
                  inputRef={ref}
                  label={lang == "En" ? "Pin code" : "पिन कोड"}
                  placeholder={lang == "En" ? "Pin code" : "पिन कोड"}
                  autoComplete="off"
                  error={!!errors.pin_code}
                  helperText={
                    errors.pin_code
                      ? errors.pin_code.type === "minLength" ||
                        errors.pin_code.type === "maxLength"
                        ? lang === "En"
                          ? "Enter a valid Pin Code"
                          : "एक मान्य पिन कोड दर्ज करें"
                        : lang === "En"
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
              rules={{ required: "true" }}
              defaultValue={formData.current_status}
              name="current_status"
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="current-status-label">
                    {lang == "En" ? "Current Status" : "वर्तमान स्थिति"}
                  </InputLabel>
                  <Select
                    disabled={inputDisabled}
                    error={!!errors.current_status}
                    label={lang == "En" ? "Current Status" : "वर्तमान स्थिति"}
                    required
                    inputRef={ref}
                    {...rest}
                  >
                    <MenuItem value={"Select Option"} disabled>
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
                {lang === "En"
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
              rules={{ required: "true" }}
              defaultValue={formData.qualification}
              name="qualification"
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel id="qualification-label">
                    {lang == "En" ? "Maximum Qualification" : "अधिकतम योग्यता"}
                  </InputLabel>
                  <Select
                    label={
                      lang == "En" ? "Maximum Qualification" : "अधिकतम योग्यता"
                    }
                    error={!!errors.qualification}
                    required
                    inputRef={ref}
                    {...rest}
                  >
                    <MenuItem value={""} disabled>
                      Select Option
                    </MenuItem>
                    <MenuItem value={"lessThan10th"}>
                      Less than 10th pass
                    </MenuItem>
                    <MenuItem value={"class10th"}>10th pass</MenuItem>
                    <MenuItem value={"class12th"}>12th pass</MenuItem>
                    <MenuItem value={"graduate"}>Graduated</MenuItem>
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
                {lang === "En"
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
                    disabled={inputDisabled}
                    variant="outlined"
                    required
                    inputRef={ref}
                    {...rest}
                    fullWidth
                    label={
                      lang == "En"
                        ? "Percentage in 10th class"
                        : "10वीं कक्षा के प्रतिशत अंक"
                    }
                    placeholder={
                      lang == "En"
                        ? "Percentage in 10th class"
                        : "10वीं कक्षा के प्रतिशत अंक"
                    }
                    type="number"
                    autoComplete="off"
                    error={!!errors.percentage_in10th}
                    helperText={
                      errors.percentage_in10th
                        ? errors.percentage_in10th.type === "max"
                          ? lang === "En"
                            ? "Enter valid Percentage"
                            : "मान्य प्रतिशत दर्ज करें"
                          : lang === "En"
                          ? "Enter 10th Class Percentage"
                          : "10वीं कक्षा के प्रतिशत अंक दर्ज करें"
                        : "Ex. 86.40"
                    }
                  />
                )}
              />
            </Grid>
          ) : null}
          {qualification === "class12th" || qualification === "graduate" ? (
            <>
              <Grid item xs={12} sm={6}>
                <Controller
                  control={control}
                  defaultValue={formData.percentage_in10th}
                  rules={{ required: true, max: 100 }}
                  name="percentage_in10th"
                  render={({ field: { ref, ...rest } }) => (
                    <TextField
                      disabled={inputDisabled}
                      variant="outlined"
                      required
                      inputRef={ref}
                      {...rest}
                      fullWidth
                      label={
                        lang == "En"
                          ? "Percentage in 10th class"
                          : "10वीं कक्षा के प्रतिशत अंक"
                      }
                      placeholder={
                        lang == "En"
                          ? "Percentage in 10th class"
                          : "10वीं कक्षा के प्रतिशत अंक"
                      }
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in10th}
                      helperText={
                        errors.percentage_in10th
                          ? errors.percentage_in10th.type === "max"
                            ? lang === "En"
                              ? "Enter valid Percentage"
                              : "मान्य प्रतिशत दर्ज करें"
                            : lang === "En"
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
                  rules={{ required: true, max: 100 }}
                  defaultValue={formData.percentage_in12th}
                  render={({ field: { ref, ...rest } }) => (
                    <TextField
                      disabled={inputDisabled}
                      variant="outlined"
                      required
                      inputRef={ref}
                      {...rest}
                      fullWidth
                      // id="city"
                      label={
                        lang == "En"
                          ? "Percentage in 12th class"
                          : "12वीं कक्षा के प्रतिशत अंक"
                      }
                      placeholder={
                        lang == "En"
                          ? "Percentage in 12th class"
                          : "12वीं कक्षा के प्रतिशत अंक"
                      }
                      type="number"
                      autoComplete="off"
                      error={!!errors.percentage_in12th}
                      helperText={
                        errors.percentage_in12th
                          ? errors.percentage_in12th.type === "max"
                            ? lang === "En"
                              ? "Enter valid Percentage"
                              : "मान्य प्रतिशत दर्ज करें"
                            : lang === "En"
                            ? "Enter 12th Class Percentage"
                            : "12वीं कक्षा के प्रतिशत अंक दर्ज करें"
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
              defaultValue={formData.school_medium}
              rules={{ required: true }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="school-medium-label">
                    {lang == "En" ? "School Medium" : "स्कूल माध्यम"}
                  </InputLabel>
                  <Select
                    label={lang == "En" ? "School Medium" : "स्कूल माध्यम"}
                    error={!!errors.school_medium}
                    required
                    inputRef={ref}
                    {...rest}
                    disabled={inputDisabled}
                  >
                    <MenuItem value={""} disabled>
                      {lang == "En" ? "Select Langauge" : "भाषा चुने"}
                    </MenuItem>
                    <MenuItem value={"other"}>
                      {lang == "En" ? "Hindi" : "हिन्दी"}
                    </MenuItem>
                    <MenuItem value={"en"}>
                      {lang == "En" ? "English" : "अंग्रेज़ी"}
                    </MenuItem>
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
                {lang === "En"
                  ? "Select your School Medium"
                  : "अपना स्कूल माध्यम चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="caste"
              defaultValue={formData.caste}
              rules={{ required: true }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  fullWidth
                  variant="outlined"
                  required
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    {lang === "En" ? " Caste/Tribe" : "जाति/जनजाति"}
                  </InputLabel>
                  <Select
                    label={lang == "En" ? " Caste/Tribe" : "जाति/जनजाति"}
                    error={!!errors.caste}
                    required
                    inputRef={ref}
                    {...rest}
                  >
                    <MenuItem value={"Select Option"} disabled>
                      Select Option
                    </MenuItem>
                    <MenuItem value={"scSt"}>
                      (SC) Scheduled Caste / (ST) Scheduled Tribe
                    </MenuItem>
                    <MenuItem value={"obc"}>
                      (OBC) Other Backward Classes
                    </MenuItem>
                    <MenuItem value={"general"}>General</MenuItem>
                    <MenuItem value={"others"}>Other</MenuItem>
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
                {lang === "En"
                  ? "Select your Caste/Tribe"
                  : "अपनी जाति/जनजाति चुनें"}
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="religion"
              defaultValue={formData.religion}
              rules={{ required: true }}
              render={({ field: { ref, ...rest } }) => (
                <FormControl
                  disabled={inputDisabled}
                  required={true}
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel id="religion-label">
                    {lang == "En" ? "Religion" : "धर्म"}
                  </InputLabel>
                  <Select
                    label={lang == "En" ? "Religion" : "धर्म"}
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
                {lang === "En" ? "Select your Religion" : "अपना धर्म चुनें"}
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

export default KuchAurDetails;
