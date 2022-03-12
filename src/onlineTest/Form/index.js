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
import Typography from "@material-ui/core/Typography";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import { Link } from "react-router-dom";
import history from "../../utils/history";
import { useSnackbar } from "notistack";
import {
  Avatar,
  Badge,
  FilledInput,
  Grid,
  Input,
  MobileStepper,
  Snackbar,
} from "@material-ui/core";
import { set } from "date-fns";
import KuchAurDetails from "../KuchAurDetails";
import transitions from "@material-ui/core/styles/transitions";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTheme } from "@material-ui/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";

const baseUrl = process.env.API_URL;

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
  handleChange,
  setProfileImage,
  inputDisabled,
  reactForm: { errors, register, control },
}) => {
  const classes = useStyles();
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
          Profile Image*
        </Typography>
        {errors.ProfileImage ? (
          <Typography
            style={{ paddingTop: "-0.2rem" }}
            variant="caption"
            color="error"
          >
            {lang === "En" ? "Required Field" : "आवश्यक क्षेत्र"}
          </Typography>
        ) : (
          ""
        )}
      </label>

      <input
        onChange={(e) => setProfileImage(e.target.files[0])}
        id="ProfileImage"
        type="file"
        name="ProfileImage"
        style={{ display: "none" }}
        // {...register("ProfileImage", { required: true })}
        required
        disabled={inputDisabled}
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
                // {...register("FirstName", { required: true })}
                fullWidth
                id="FirstName"
                // autoFocus
                inputRef={ref}
                onBlur={rest.onBlur}
                className={classes.spacing}
                label={lang == "En" ? "First Name" : "प्रथम नाम"}
                placeholder={lang == "En" ? "First Name" : "प्रथम नाम"}
                // name="FirstName"
                autoComplete="off"
                type="text"
                error={!!errors.FirstName}
                helperText={
                  errors.FirstName
                    ? lang === "En"
                      ? "Enter First Name"
                      : "प्रथम नाम दर्ज करें"
                    : "Ex. XYZ"
                }
                disabled={inputDisabled}
                {...rest}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Controller
            control={control}
            name="MiddleName"
            rules={{ required: true }}
            defaultValue={formData.MiddleName}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                required
                id="MiddleName"
                inputRef={ref}
                className={classes.spacing}
                label={lang == "En" ? "Middle Name " : "मध्यनाम"}
                placeholder={lang == "En" ? "Middle Name " : "मध्यनाम"}
                autoComplete="off"
                error={!!errors.MiddleName}
                type="text"
                helperText={
                  errors.MiddleName
                    ? lang === "En"
                      ? "Enter Middle Name"
                      : "मध्यनाम दर्ज करें"
                    : "Ex. PQR"
                }
                disabled={inputDisabled}
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
                label={lang == "En" ? "Last Name" : "कुलनाम"}
                placeholder={lang == "En" ? "Last Name" : "कुलनाम"}
                autoComplete="off"
                error={!!errors.LastName}
                helperText={
                  errors.LastName
                    ? lang === "En"
                      ? "Enter Last Name"
                      : "कुलनाम दर्ज करें"
                    : "Ex. ABC"
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
            name="dob"
            defaultValue={formData.dob ? formData.dob : null}
            rules={{
              required: true,
              validate: (dob) => {
                return (
                  parseInt(
                    moment
                      .duration(moment(moment.now()).diff(moment(dob)))
                      .asYears()
                  ) >= 16
                );
              },
            }}
            render={({
              field: { ref, ...rest },
              fieldState: { isTouched },
            }) => (
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disabled={inputDisabled}
                  // margin="normal"
                  id="dob"
                  label={lang == "En" ? "Date of Birth" : "आपका जन्मदिन"}
                  required
                  inputRef={ref}
                  focused={isTouched}
                  format="dd/MM/yyyy"
                  inputVariant="outlined"
                  fullWidth
                  placeholder={lang == "En" ? "Date of Birth" : "आपका जन्मदिन"}
                  error={!!errors.dob}
                  helperText={
                    errors.dob
                      ? errors.dob.type === "validate"
                        ? lang === "En"
                          ? "Age must be 16 or higher"
                          : "आयु 16 या अधिक होनी चाहिए"
                        : lang === "En"
                        ? "Enter Date of Birth"
                        : "जन्मदिन दर्ज करें"
                      : "Ex. 19/11/2005"
                  }
                  {...rest}
                />
              </MuiPickersUtilsProvider>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            control={control}
            rules={{
              required: true,
              pattern: /(6|7|8|9)\d{9}/,
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
                label={
                  lang == "En" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                placeholder={
                  lang == "En" ? "Your Whatsapp Number" : "आपका व्हाट्सएप नंबर"
                }
                type="tel"
                autoComplete="off"
                error={!!errors.whatsapp}
                helperText={
                  errors.whatsapp
                    ? errors.whatsapp.type === "pattern" ||
                      errors.whatsapp.type === "maxLength"
                      ? lang === "En"
                        ? "No. should be of 10 digits"
                        : "नंबर 10 अंकों का होना चाहिए"
                      : lang === "En"
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
              required: true,
              pattern: /(6|7|8|9)\d{9}/,
            }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                required
                fullWidth
                id="AlternateNumber"
                type="tel"
                inputRef={ref}
                className={classes.spacing}
                label={lang == "En" ? "Alternate Number" : "वैकल्पिक नंबर"}
                placeholder={
                  lang == "En" ? "Alternate Number" : "वैकल्पिक नंबर"
                }
                autoComplete="off"
                error={!!errors.AlternateNumber}
                helperText={
                  errors.AlternateNumber
                    ? errors.AlternateNumber.type === "pattern"
                      ? lang === "En"
                        ? "No. should be of 10 digits"
                        : "नंबर 10 अंकों का होना चाहिए"
                      : lang === "En"
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
                /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-])+$/,
            }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                inputRef={ref}
                type="email"
                required
                className={classes.spacing}
                label={lang == "En" ? "Email" : "ईमेल"}
                placeholder={lang == "En" ? "Email" : "ईमेल"}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.type === "pattern"
                      ? lang === "En"
                        ? "Enter Valid Email"
                        : "मान्य ईमेल नंबर दर्ज करें"
                      : lang === "En"
                      ? "Enter Email"
                      : "ईमेल दर्ज करें"
                    : "Ex. xyz@mail.com"
                }
                autoComplete="off"
                fullWidth
                disabled={inputDisabled}
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
              validate: (gender) => gender !== "Select Gender",
            }}
            name="gender"
            defaultValue={formData.gender ? formData.gender : "select gender"}
            render={({ field: { ref, ...rest } }) => (
              <FormControl fullWidth>
                <Select
                  fullWidth
                  label={lang == "En" ? "Select Gender" : "लिंग चुनें"}
                  error={!!errors.gender}
                  id="gender"
                  inputRef={ref}
                  name="gender"
                  placeholder={lang == "En" ? "Select Gender" : "लिंग चुनें"}
                  required
                  disabled={inputDisabled}
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
                      {lang == "En" ? el[0] : el[1]}
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
              {lang === "En" ? "Required Field" : "आवश्यक क्षेत्र"}
            </Typography>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

function Form(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
  } = useForm();
  const [inputDisabled, setInputDisabled] = useState(false);
  const [enrolmentKey, setEnrolmentKey] = useState("");
  // const [prevData, setPrevData] = useState({});
  const [alreadyAUser, setAlreadyAUser] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // const [date, setDate] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
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
    PrevImage: "",
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

  const handleChange = (e) => {
    console.log(e);
    // if (e.target.name == "ProfileImage") savePhoto(e);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setProfileImage = (img) => {
    console.log("XS");
    setFormData({ ...formData, ProfileImage: img });
    //savePhoto(img)
  };

  let gender = {
    1: "female",
    2: "male",
    3: "other",
  };
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

  const savePhoto = (imgFile) => {
    let tempFormdata = new FormData();
    tempFormdata.append("file", imgFile);
    axios
      .post(
        `${baseUrl}on_assessment/details/photo/${enrolmentKey}`,
        tempFormdata
      )
      .then(() => {
        enqueueSnackbar("Photo Uploaded Successfully", {
          variant: "success",
        });
      })
      .catch((err) => {
        console.err(err);
        enqueueSnackbar("Please fill all the fields properly", {
          variant: "error",
        });
      });
  };

  let lang = props.lang;
  useEffect(() => {
    // let key = localStorage.getItem("enrolmentKey")
    // setEnrolment_key(key)
    let enrkey = location.pathname.split("/")[2];
    //console.log("enrkey", enrkey);
    setEnrolmentKey(enrkey);
  }, []);

  useEffect(() => {
    if (location.pathname.split("/")[3]) {
      axios
        .get(`${baseUrl}/students/${location.pathname.split("/")[3]}`)
        .then((res) => {
          if (res.data.data.length > 0) {
            let PrevDatas = res.data.data[0];

            // setPrevData(PrevDatas);
            setAlreadyAUser(true);
            setInputDisabled(true);
            setFormData({
              ...formData,
              PrevImage: PrevDatas.image_url,
              FirstName: PrevDatas.name.split(" ")[0],
              MiddleName: PrevDatas.name.split(" ")[1],
              LastName: PrevDatas.name.split(" ")[2],
              email: PrevDatas.email,
              whatsapp: PrevDatas.contacts[0].mobile,
              AlternateNumber:
                PrevDatas.contacts[1] && PrevDatas.contacts[1].alt_mobile,
              dob: PrevDatas.dob,
              gender: gender[PrevDatas.gender],
              district: PrevDatas.district,
              pin_code: PrevDatas.pin_code,
              state: PrevDatas.state,
              city: PrevDatas.city,
              current_status: CurrentStatus[PrevDatas.current_status],
              qualification: qualification[PrevDatas.qualification],
              school_medium: school_medium[PrevDatas.school_medium],
              caste: caste[PrevDatas.caste],
              pin_code: PrevDatas.pin_code,
              religion: religion[PrevDatas.religon],
              math_marks_in10th: PrevDatas.math_marks_in10th,
              percentage_in10th: PrevDatas.percentage_in10th,
              math_marks_in12th: PrevDatas.math_marks_in12th,
              percentage_in12th: PrevDatas.percentage_in12th,
            });
            console.log(alreadyAUser, PrevDatas, formData);
            // console.log(getValues());
            reset({
              PrevImage: PrevDatas.image_url,
              FirstName: PrevDatas.name.split(" ")[0],
              MiddleName: PrevDatas.name.split(" ")[1],
              LastName: PrevDatas.name.split(" ")[2],
              email: PrevDatas.email,
              whatsapp: PrevDatas.contacts[0].mobile,
              AlternateNumber:
                PrevDatas.contacts[1] && PrevDatas.contacts[1].alt_mobile,
              dob: PrevDatas.dob,
              gender: gender[PrevDatas.gender],
              district: PrevDatas.district,
              pin_code: PrevDatas.pin_code,
              state: PrevDatas.state,
              city: PrevDatas.city,
              current_status: CurrentStatus[PrevDatas.current_status],
              qualification: qualification[PrevDatas.qualification],
              school_medium: school_medium[PrevDatas.school_medium],
              caste: caste[PrevDatas.caste],
              religion: religion[PrevDatas.religon],
              math_marks_in10th: PrevDatas.math_marks_in10th,
              percentage_in10th: PrevDatas.percentage_in10th,
              math_marks_in12th: PrevDatas.math_marks_in12th,
              percentage_in12th: PrevDatas.percentage_in12th,
            });
          }
        });
    }
  }, []);
  // const isNotEmpty = (values) => {
  //   if (values.whatsapp.length !== 10) {
  //     return false;
  //   }
  //   return true;
  // };

  // const changeHandler = (e) => {
  //   setValues({ ...values, [e.target.name]: e.target.value });
  // };
  // const wantDate = (date) => {
  //   // console.log("This is date from form", a)
  //   setDate(date);
  // };

  // console.log("This is form props", props)
  // const HandelOnNumberChange = (e) => {
  //   if (e.target.value.length <= 10) {
  //     setValues({ ...values, [e.target.name]: e.target.value });
  //   }
  // };

  const getSteps = () => [
    ["Basic Details", "बुनियादी जानकारी"],
    ["Other Details", "अन्य जानकारी"],
  ];
  const steps = getSteps();

  const handleNext = (data, e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    console.log(data);

    if (activeStep >= steps.length - 1) return; //submit here
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // const submitHandler = () => {
  //   if (
  //     data.email !== "" &&
  //     data.name !== "" &&
  //     data.whatsapp.length == 10 &&
  //     data.gender !== "" &&
  //     data.dob !== ""
  //   ) {
  //     if (data.gender == "female") {
  //       const isValidEmail =
  //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //       if (data.email && isValidEmail.test(data.email) === false) {
  //         enqueueSnackbar("Please enter valid email", {
  //           variant: "error",
  //         });
  //       } else {
  //         setActiveStep((prevStep) => prevStep + 1);
  //       }
  //     } else {
  //       enqueueSnackbar("only Females Can Appear For The Test", {
  //         variant: "info",
  //       });
  //     }
  //   } else {
  //     enqueueSnackbar("Please Fill All The fields", {
  //       variant: "error",
  //     });
  //   }
  // };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicDetails
            lang={lang}
            formData={formData}
            // handleChange={handleChange}
            reactForm={{ register, errors, control }}
            inputDisabled={alreadyAUser}
            setProfileImage={setProfileImage}
          />
        );
      case 1:
        return (
          <KuchAurDetails
            formData={{
              name: `${formData.FirstName} ${formData.MiddleName} ${formData.LastName}`,
              alt_mobile: formData.AlternateNumber,
              partner_refer: "NONE",
              image_url: formData.ProfileImage,
              ...formData,
            }}
            reactForm={{ register, errors, control }}
            handleChange={handleChange}
            lang={lang}
            // prevFilledData={prevData}
            alreadyAUser={alreadyAUser}
            inputDisabled={alreadyAUser}
            setInputDisabled={setInputDisabled}
          />
        );
    }
  };

  //   console.log("Date", selectedDate);
  // let data = {
  //   name: `${values.FirstName} ${values.MiddleName} ${values.LastName}`,
  //   whatsapp: values.whatsapp,
  //   gender: values.gender,
  //   dob: values.dob,
  //   // state: "MH",
  //   // district: values.district,
  //   // city: values.district,
  //   // pin_code: "422101",
  //   email: values.email,
  //   alt_mobile: values.AlternateNumber,
  //   gps_lat: "-1",
  //   gps_long: "-1",
  //   partner_refer: "NONE",
  //   image_url: values.ProfileImage,
  // };

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5" className={classes.text}>
        {lang == "En" ? steps[activeStep][0] : steps[activeStep][1]}
      </Typography>
      <form
        style={{ paddingTop: "2.0rem" }}
        noValidate
        onSubmit={handleSubmit(handleNext)}
      >
        {getStepContent(activeStep)}
        <MobileStepper
          style={{ marginTop: "1.6rem" }}
          variant="dots"
          position="static"
          steps={steps.length}
          activeStep={activeStep}
          nextButton={
            <Button
              size="medium"
              type="submit"
              variant={activeStep === steps.length - 1 ? "contained" : "text"}
              // disabled={activeStep === steps.length - 1}
              color="primary"
            >
              {activeStep === steps.length - 1 ? "Submit Data" : "Next"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="medium"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </form>
    </Container>
  );
}

export default Form;
