import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { state } from "./Constant";
import history from "../../utils/history";
import { useSnackbar } from "notistack";
import Axios from "axios";
import { methods } from "underscore";
const baseUrl = process.env.API_URL;
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    marginTop: theme.spacing(4),
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
  let prevData = props.prevData;
  let alreadyAUser = props.alreadyAUser;
  let caste = ["", "obc", "scSt", "general", "others"];
  let qualification = [
    "",
    "lessThan10th",
    "class10th",
    "class12th",
    "graduate",
    "ba",
    "bcom",
    "mcom",
    "msc",
    "bca",
    "bsc",
    "bba",
  ];
  let religion = ["", "hindu", "islam", "sikh", "jain", "christian", "others"];

  let CurrentStatus = ["", "nothing", "job", "study", "other"];
  let school_medium = ["", "en", "other"];
  let prevFilledData = props.prevFilledData;
  let lang = props.lang;
  const [ApiCall, setApiCall] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (prevFilledData) {
      setApiCall(false);
      setValues({
        district: prevFilledData.district,
        pin_code: prevFilledData.pin_code,
        state: prevFilledData.state,
        city: prevFilledData.city,
        current_status: CurrentStatus[prevFilledData.current_status],
        qualification: qualification[prevFilledData.qualification],
        school_medium: school_medium[prevFilledData.school_medium],
        caste: caste[prevFilledData.caste],
        religion: religion[prevFilledData.religon],
        math_marks_in10th: prevFilledData.math_marks_in10th,
        percentage_in10th: prevFilledData.percentage_in10th,
        math_marks_in12th: prevFilledData.math_marks_in12th,
        percentage_in12th: prevFilledData.percentage_in12th,
      });
    }
  }, [prevFilledData]);

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
  const [values, setValues] = useState({
    district: "",
    pin_code: "",
    state: "",
    city: "",
    current_status: "",
    qualification: "",
    school_medium: "",
    caste: "",
    religion: "",
    math_marks_in10th: "",
    percentage_in10th: "",
    math_marks_in12th: "",
    percentage_in12th: "",
  });
  useEffect(() => {
    if (values.state != "") {
      getCityFromState(values.state);
    }
  }, [values.state]);

  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    //console.log("Values", values);
  };

  const isNotEmpty = (values) => {
    const valuesKey = Object.keys(values);

    for (const key of valuesKey) {
      if (values[key] === "10th pass") {
        values.math_marks_in12th = "empty";
        values.percentage_in12th = "empty";
      }
      if (values[key] === "Less than 10th pass") {
        values.math_marks_in10th = "empty";
        values.percentage_in10th = "empty";
        values.math_marks_in12th = "empty";
        values.percentage_in12th = "empty";
      }
      // if (values[key] === "") {
      //   return false;
      // }
    }
    return true;
  };

  //console.log("isNotEmpty", isNotEmpty(values));

  // const totalScore = props.location.totalScore;
  // console.log("totalScore", totalScore);
  // console.log("answerObj in kuch aur details", props.location.answerObj);

  const submitHandler = (e) => {
    e.preventDefault();
    let data;

    if (prevData.alt_mobile.length == 10) {
      data = {
        name: prevData.name,
        email: prevData.email,
        whatsapp: prevData.whatsapp,
        dob: prevData.dob,
        alt_mobile: prevData.alt_mobile,
        gender: prevData.gender,
        gps_lat: prevData.gps_lat,
        gps_long: prevData.gps_long,
        partner_refer: prevData.partner_refer,
        qualification: values.qualification,
        state: values.state,
        district: values.district,
        city: values.city,
        current_status: values.current_status,
        school_medium: values.school_medium,
        pin_code: values.pin_code,
        caste: values.caste,
        religon: values.religion,
        percentage_in10th: values.percentage_in10th,
        math_marks_in10th: values.math_marks_in10th,
        math_marks_in12th: values.math_marks_in12th,
        percentage_in12th: values.percentage_in12th,
      };
    } else {
      data = {
        name: prevData.name,
        email: prevData.email,
        whatsapp: prevData.whatsapp,
        dob: prevData.dob,
        gender: prevData.gender,
        gps_lat: prevData.gps_lat,
        gps_long: prevData.gps_long,
        partner_refer: prevData.partner_refer,
        qualification: values.qualification,
        state: values.state,
        district: values.district,
        city: values.city,
        current_status: values.current_status,
        school_medium: values.school_medium,
        pin_code: values.pin_code,
        caste: values.caste,
        religon: values.religion,
        percentage_in10th: values.percentage_in10th,
        math_marks_in10th: values.math_marks_in10th,
        math_marks_in12th: values.math_marks_in12th,
        percentage_in12th: values.percentage_in12th,
      };
    }

    if (/^([a-zA-Z0-9]|\s)+$/i.test(data.city) === false) {
      enqueueSnackbar('City name cannot contain (.,!,#,@,") ', {
        variant: "error",
      });
      return;
    }
    if (alreadyAUser) {
      history.push(`/EkAurBaat/${location.pathname.split("/")[2]}`);
    } else {
      Axios.post(
        `${baseUrl}on_assessment/details/${location.pathname.split("/")[2]}`,
        data
      )
        .then((res) => {
          //console.log("res", res);
          history.push(`/EkAurBaat/${location.pathname.split("/")[2]}`);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar("Please fill all the fields properly", {
            variant: "error",
          });
        });
    }
    // if (isNotEmpty(values)) {
    //   history.push({
    //     pathname: "/ekAurBaat",
    //     enrolment_key: props.location.enrolment_key,
    //   });
    // } else {
    //   console.log("Poo");
    //   enqueueSnackbar("Please fill all the fields properly", {
    //     variant: "error",
    //   });
  };

  //console.log("values.qualification", values.qualification);

  return (
    <Container maxWidth="lg" align="center" className={classes.container}>
      <div className={classes.root}>
        <Paper
          square
          elevation={0}
          className={classes.textField}
          align="center"
        >
          <Typography variant="h4" className={classes.text}>
            {lang == "En" ? "Your Details" : "आपकी जानकारी"}
          </Typography>
        </Paper>
        <form onSubmit={submitHandler}>
          <Paper
            square
            elevation={0}
            className={classes.textField}
            align="left"
          >
            <TextField
              variant="outlined"
              required
              fullWidth
              // id="pin_code"
              className={classes.spacing}
              label={lang == "En" ? "Pin code" : "पिन कोड"}
              placeholder={lang == "En" ? "Pin code" : "पिन कोड"}
              value={values.pin_code}
              name="pin_code"
              autoComplete="off"
              onChange={changeHandler}
              required={true}
            />
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "Select State" : "राज्य चुनें"}
              </InputLabel>
              <Select
                required={true}
                value={values.state}
                onChange={changeHandler}
                label={lang == "En" ? "Select State" : "राज्य चुनें"}
                name="state"
                MenuProps={{ classes: { paper: classes.menuPaper } }}
              >
                <MenuItem value={""}>
                  {lang == "En" ? "Select State" : "राज्य चुनें"}
                </MenuItem>
                {Object.keys(state).map((key, index) => {
                  return <MenuItem value={key}>{state[key]}</MenuItem>;
                })}
                {/* {state.map((state) => {
                  return <MenuItem value={state}>{state}</MenuItem>;
                })} */}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "Select District" : "जिला चुनें"}
              </InputLabel>
              <Select
                required={true}
                value={values.district}
                onChange={changeHandler}
                label={lang == "En" ? "Select District" : "जिला चुनें"}
                name="district"
                MenuProps={{ classes: { paper: classes.menuPaper } }}
              >
                {districts.map((key, index) => {
                  return <MenuItem value={key["name"]}>{key["name"]}</MenuItem>;
                })}
                {/* {state.map((state) => {
                  return <MenuItem value={state}>{state}</MenuItem>;
                })} */}
              </Select>
            </FormControl>

            {/* <TextField
              variant="outlined"
              required
              className={classes.spacing}
              placeholder="District"
              value={values.district}
              name="district"
              onChange={changeHandler}
              autoComplete="off"
              onChange={changeHandler}
              fullWidth={true}
            /> */}

            {/* <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Aapki City/Village ka naam
              </InputLabel>
              <Select
                value={values.city}
                onChange={changeHandler}
                label="Aapki City/Village ka naam"
                name="city"
              >
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl> */}
            {/* </Paper> */}
            <TextField
              variant="outlined"
              required
              fullWidth
              // id="city"
              className={classes.spacing}
              label={lang == "En" ? "city" : "शहर"}
              placeholder={lang == "En" ? "city" : "शहर"}
              value={values.city}
              name="city"
              required={true}
              autoComplete="off"
              onChange={changeHandler}
            />
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "Current Status" : "वर्तमान स्थिति"}
              </InputLabel>
              <Select
                value={values.current_status}
                onChange={changeHandler}
                label={lang == "En" ? "Current Status" : "वर्तमान स्थिति"}
                required={true}
                name="current_status"
              >
                <MenuItem value={"Select Option"}>Select Option</MenuItem>
                <MenuItem value={"nothing"}>Nothing</MenuItem>
                <MenuItem value={"job"}>Job</MenuItem>
                <MenuItem value={"study"}>Study</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "Maximum Qualification" : "अधिकतम योग्यता"}
              </InputLabel>
              <Select
                value={values.qualification}
                onChange={changeHandler}
                label={
                  lang == "En" ? "Maximum Qualification" : "अधिकतम योग्यता"
                }
                required={true}
                name="qualification"
              >
                <MenuItem value={""}>Select Option</MenuItem>
                <MenuItem value={"lessThan10th"}>Less than 10th pass</MenuItem>
                <MenuItem value={"class10th"}>10th pass</MenuItem>
                <MenuItem value={"class12th"}>12th pass</MenuItem>
                <MenuItem value={"graduate"}>Graduated</MenuItem>
              </Select>
            </FormControl>
            {values.qualification === "class10th" ? (
              <>
                <TextField
                  variant="outlined"
                  required
                  required={true}
                  fullWidth
                  // id="city"
                  className={classes.spacing}
                  label={
                    lang == "En"
                      ? "Marks in Maths in 10th class"
                      : "10वीं कक्षा में गणित में अंक"
                  }
                  placeholder={
                    lang == "En"
                      ? "Marks in Maths in 10th class"
                      : "10वीं कक्षा में गणित के अंक"
                  }
                  value={values.math_marks_in10th}
                  name="math_marks_in10th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  required={true}
                  // id="city"
                  className={classes.spacing}
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
                  value={values.percentage_in10th}
                  name="percentage_in10th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
              </>
            ) : null}
            {values.qualification === "class12th" ||
            values.qualification === "graduate" ? (
              <>
                <TextField
                  variant="outlined"
                  required
                  required={true}
                  fullWidth
                  // id="city"
                  className={classes.spacing}
                  label={
                    lang == "En"
                      ? "Marks in Maths in 10th class"
                      : "10वीं कक्षा में गणित में अंक"
                  }
                  placeholder={
                    lang == "En"
                      ? "Marks in Maths in 10th class"
                      : "10वीं कक्षा में गणित के अंक"
                  }
                  value={values.math_marks_in10th}
                  name="math_marks_in10th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
                <TextField
                  variant="outlined"
                  required
                  required={true}
                  fullWidth
                  // id="city"
                  className={classes.spacing}
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
                  value={values.percentage_in10th}
                  name="percentage_in10th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
                <TextField
                  variant="outlined"
                  required
                  required={true}
                  fullWidth
                  // id="city"
                  className={classes.spacing}
                  label={
                    lang == "En"
                      ? "Marks in Maths in 12th class"
                      : "12वीं कक्षा में गणित में अंक"
                  }
                  placeholder={
                    lang == "En"
                      ? "Marks in Maths in 12th class"
                      : "12वीं कक्षा में गणित के अंक"
                  }
                  value={values.math_marks_in12th}
                  name="math_marks_in12th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
                <TextField
                  variant="outlined"
                  required
                  required={true}
                  fullWidth
                  // id="city"
                  className={classes.spacing}
                  label={
                    lang == "En"
                      ? "Percentage in 10th class"
                      : "12वीं कक्षा के प्रतिशत अंक"
                  }
                  placeholder={
                    lang == "En"
                      ? "Percentage in 10th class"
                      : "12वीं कक्षा के प्रतिशत अंक"
                  }
                  value={values.percentage_in12th}
                  name="percentage_in12th"
                  type="number"
                  autoComplete="off"
                  onChange={changeHandler}
                />
              </>
            ) : null}
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "School Medium" : "स्कूल माध्यम"}
              </InputLabel>
              <Select
                value={values.school_medium}
                onChange={changeHandler}
                label={lang == "En" ? "School Medium" : "स्कूल माध्यम"}
                name="school_medium"
                required={true}
              >
                <MenuItem value={""}>
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
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? " Caste/Tribe" : "जाति/जनजाति"}
              </InputLabel>
              <Select
                value={values.caste}
                onChange={changeHandler}
                label={lang == "En" ? " Caste/Tribe" : "जाति/जनजाति"}
                name="caste"
                required={true}
              >
                <MenuItem value={"Select Option"}>Select Option</MenuItem>
                <MenuItem value={"scSt"}>
                  (SC) Scheduled Caste / (ST) Scheduled Tribe
                </MenuItem>
                <MenuItem value={"obc"}>(OBC) Other Backward Classes</MenuItem>
                <MenuItem value={"general"}>General</MenuItem>
                <MenuItem value={"others"}>Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              required={true}
              fullWidth
              variant="outlined"
              className={classes.spacing}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                {lang == "En" ? "Religion" : "धर्म"}
              </InputLabel>
              <Select
                value={values.religion}
                onChange={changeHandler}
                label={lang == "En" ? "Religion" : "धर्म"}
                name="religion"
              >
                <MenuItem value="">Select Option</MenuItem>
                <MenuItem value="hindu">Hindu</MenuItem>
                <MenuItem value="islam">Islam</MenuItem>
                <MenuItem value="sikh">Sikh</MenuItem>
                <MenuItem value="christian">Christian</MenuItem>
                <MenuItem value="jain">Jain</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // className={classes.submit}
            // onClick={submitHandler}
          >
            submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default KuchAurDetails;
