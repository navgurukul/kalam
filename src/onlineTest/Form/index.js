import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Date from "./Date";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import history from "../../utils/history";
import { useSnackbar } from "notistack";
import { Avatar, FilledInput, Input, Snackbar } from "@material-ui/core";
import { set } from "date-fns";
import KuchAurDetails from "../KuchAurDetails";
import transitions from "@material-ui/core/styles/transitions";

const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
  },
  text: {
    paddingBottom: theme.spacing(3),
  },
  date: {
    maxWidth: 400,
    paddingTop: theme.spacing(-2),
    paddingBottom: theme.spacing(1),
  },
}));

function Form(props) {
  const classes = useStyles();
  const [enrolment_key, setEnrolment_key] = useState("");
  let lang = props.lang;
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // let key = localStorage.getItem("enrolmentKey")
    // setEnrolment_key(key)
    let enrkey = location.pathname.split("/")[2];
    console.log("enrkey", enrkey);
    setEnrolment_key(enrkey);
  }, []);

  useEffect(() => {
    if (location.pathname.split("/")[3]) {
      axios
        .get(
          `http://dev-join.navgurukul.org/api/students/${
            location.pathname.split("/")[3]
          }`
        )
        .then((res) => {
          console.log("res");
          let PrevDatas = res.data.data[0];
          setValues({
            ...values,
            // ProfileImage: PrevDatas.image_url,
            FirstName: PrevDatas.name.split(" ")[0],
            MiddleName: PrevDatas.name.split(" ")[1],
            LastName: PrevDatas.name.split(" ")[2],
            email: PrevDatas.email,
            whatsapp: PrevDatas.contacts[0].mobile,
            AlternateNumber: PrevDatas.contacts[0].alt_mobile,
            dob: PrevDatas.dob.split("T")[0],
          });
        });
    }
  }, []);
  const [date, setDate] = useState();
  const [values, setValues] = useState({
    ProfileImage: "",
    FirstName: "",
    MiddleName: "",
    email: "",
    LastName: "",
    whatsapp: "",
    AlternateNumber: "",
    gender: "",
    dob: "",
    gps_lat: "-1",
    gps_long: "-1",
  });

  const savePhoto = (e) => {
    var formdata = new FormData();
    formdata.append("file", e.target.files[0]);
    axios
      .post(`${baseUrl}on_assessment/details/photo/${enrolment_key}`, formdata)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
        enqueueSnackbar("Please fill all the fields properly", {
          variant: "error",
        });
      });
  };

  const isNotEmpty = (values) => {
    if (values.whatsapp.length !== 10) {
      return false;
    }
    return true;
  };
  const [Next, setNext] = useState(true);

  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value, dob: date });
    e.preventDefault();
  };
  //   console.log("Date", selectedDate);
  let data = {
    name: `${values.FirstName} ${values.MiddleName} ${values.LastName}`,
    whatsapp: values.whatsapp,
    gender: values.gender,
    dob: values.dob,
    // state: "MH",
    // district: values.district,
    // city: values.district,
    // pin_code: "422101",
    email: values.email,
    alt_mobile: values.AlternateNumber,
    gps_lat: "-1",
    gps_long: "-1",
    partner_refer: "NONE",
  };

  const submitHandler = () => {
    if (
      data.email !== "" &&
      data.name !== "" &&
      data.whatsapp.length == 10 &&
      data.gender !== "" &&
      values.ProfileImage !== "" &&
      data.dob !== ""
    ) {
      if (data.gender == "female") {
        const isValidEmail =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (data.email && isValidEmail.test(data.email) === false) {
          enqueueSnackbar("Please enter valid email", {
            variant: "error",
          });
        } else {
          setNext(false);
        }
      } else {
        enqueueSnackbar("only Females Can Appear For The Test", {
          variant: "info",
        });
      }
    } else {
      enqueueSnackbar("Please Fill All The fields", {
        variant: "error",
      });
    }
  };

  const wantDate = (date) => {
    // console.log("This is date from form", a)
    setDate(date);
  };

  // console.log("This is form props", props)
  const HandelOnNumberChange = (e) => {
    if (e.target.value.length <= 10) {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };
  return (
    <>
      {Next ? (
        <Container maxWidth="lg" align="center">
          <div className={classes.root}>
            <Typography variant="h4" className={classes.text}>
              {lang == "En" ? "Your Details" : "आपकी जानकारी"}
            </Typography>

            <form
              onSubmit={() => {
                submitHandler();
              }}
            >
              <label
                style={{
                  margin: "10px",
                }}
                htmlFor="ProfileImage"
              >
                <Avatar
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                  alt="Remy Sharp"
                  src={
                    values.ProfileImage
                      ? URL.createObjectURL(values.ProfileImage)
                      : ""
                  }
                />
                <Typography variant="h6" className={classes.text}>
                  Profile Image *
                </Typography>
              </label>
              <input
                onChange={(e) => {
                  setValues({ ...values, ProfileImage: e.target.files[0] });
                  savePhoto(e);
                }}
                id="ProfileImage"
                type="file"
                name="ProfileImage"
                style={{ display: "none" }}
                required
                accept=".png,.jpg,.jpeg"
              />
              <div className="FirstNameLast">
                <TextField
                  variant="outlined"
                  noValidate
                  id="name"
                  className={classes.spacing}
                  label={lang == "En" ? "First Name" : "प्रथम नाम"}
                  placeholder={lang == "En" ? "First Name" : "प्रथम नाम"}
                  value={values.FirstName}
                  name="FirstName"
                  onChange={changeHandler}
                  autoComplete="off"
                  onChange={changeHandler}
                />
                <TextField
                  variant="outlined"
                  id="name"
                  className={classes.spacing}
                  label={lang == "En" ? "Middle Name " : "मध्यनाम "}
                  placeholder={lang == "En" ? "Middle Name " : "मध्यनाम "}
                  value={values.MiddleName}
                  name="MiddleName"
                  onChange={changeHandler}
                  autoComplete="off"
                  onChange={changeHandler}
                />{" "}
                <TextField
                  variant="outlined"
                  id="name"
                  className={classes.spacing}
                  label={lang == "En" ? "Last Name" : "कुलनाम"}
                  placeholder={lang == "En" ? "Last Name" : "कुलनाम"}
                  value={values.LastName}
                  name="LastName"
                  onChange={changeHandler}
                  autoComplete="off"
                  onChange={changeHandler}
                />
              </div>
              <TextField
                variant="outlined"
                fullWidth
                id="whatsapp"
                className={classes.spacing}
                label={
                  lang == "En" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                placeholder={
                  lang == "En" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                value={values.whatsapp}
                name="whatsapp"
                autoComplete="off"
                onChange={HandelOnNumberChange}
              />
              <TextField
                variant="outlined"
                fullWidth
                id="whatsapp"
                className={classes.spacing}
                label={lang == "En" ? "Alternate Number" : "वैकल्पिक नंबर"}
                placeholder={
                  lang == "En" ? "Alternate Number" : "वैकल्पिक नंबर"
                }
                value={values.AlternateNumber}
                name="AlternateNumber"
                autoComplete="off"
                onChange={HandelOnNumberChange}
              />
              <TextField
                variant="outlined"
                type="email"
                className={classes.spacing}
                label={lang == "En" ? "Email" : "ईमेल"}
                placeholder={lang == "En" ? "Email" : "ईमेल"}
                value={values.email}
                name="email"
                onChange={changeHandler}
                autoComplete="off"
                onChange={changeHandler}
                fullWidth={true}
              />

              <div className={classes.date}>
                <Date lang={lang} forDate={wantDate} />
              </div>
              <FormControl
                fullWidth
                variant="outlined"
                align="left"
                className={classes.spacing}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  {lang == "En" ? "Select Gender" : "लिंग चुनें"}
                </InputLabel>
                <Select
                  value={values.gender}
                  onChange={changeHandler}
                  label={lang == "En" ? "Select Gender" : "लिंग चुनें"}
                  name="gender"
                >
                  <MenuItem value={"selectGender"}>
                    {lang == "En" ? "Select Gender" : "लिंग चुनें"}
                  </MenuItem>
                  <MenuItem value={"female"}>
                    {lang == "En" ? "female" : "महिला"}
                  </MenuItem>
                  <MenuItem value={"male"}>
                    {lang == "En" ? "male" : "पुरुष"}
                  </MenuItem>
                  <MenuItem value={"trans"}>
                    {lang == "En" ? "other" : "अन्य"}
                  </MenuItem>
                </Select>
              </FormControl>

              {/* <FormControl
                fullWidth
                variant="outlined"
                align="left"
                className={classes.spacing}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  {lang == "En" ? "Select State" : "राज्य चुनें"}
                </InputLabel>
                <Select
                  value={values.state}
                  onChange={changeHandler}
                  label="Select State"
                  name="state"
                >
                  <MenuItem value={"selectGender"}>
                    {lang == "En" ? "Select Gender" : "लिंग चुनें"}
                  </MenuItem>
                  {states.map((item, index) => {
                    return <MenuItem value={item}>{item}</MenuItem>;
                  })}
                </Select>
              </FormControl> */}
              {/* <TextField
                variant="outlined"
                required
                className={classes.spacing}
                // label="Your name"
                placeholder={lang == "En" ? "District" : "जिला"}
                value={values.district}
                name="district"
                onChange={changeHandler}
                autoComplete="off"
                onChange={changeHandler}
                fullWidth={true}
              /> */}
              {/* <TextField
                variant="outlined"
                required
                className={classes.spacing}
                // label="Your name"
                placeholder={lang == "En" ? "city" : "शहर"}
                value={values.city}
                name="city"
                onChange={changeHandler}
                autoComplete="off"
                onChange={changeHandler}
                fullWidth={true}
              /> */}
              {/* <Link exact to="ekAurBaat"> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  submitHandler();
                }}
              >
                NEXT
              </Button>
              {/* </Link> */}
            </form>
          </div>
        </Container>
      ) : (
        <KuchAurDetails prevData={data} lang={lang} />
      )}
    </>
  );
}

export default Form;
