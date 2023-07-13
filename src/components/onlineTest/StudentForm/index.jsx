import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Typography, MobileStepper } from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles, useTheme } from "@mui/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { baseUrl, customPartner } from "../../../utils/constants";
import Loader from "../../ui/Loader";
import { setStudentId } from "../../../store/slices/onlineTestSlice";

const BasicDetails = React.lazy(() => import("./BasicDetails"));
const OtherDetails = React.lazy(() => import("./OtherDetails"));

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

const StudentForm = () => {
  const classes = useStyles();
  const theme = useTheme();
  // const rLocation = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    studentData,
    enrollmentKey,
    studentId = "",
    partner,
  } = useSelector((state) => state.onlineTest);
  const { lang } = useSelector((state) => state.ui);
  const {
    firstName,
    middleName,
    lastName,
    mobileNumber,
    // lang = "En",
  } = studentData || {
    firstName: null,
    middleName: null,
    lastName: null,
    mobileNumber: null,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm();
  // const [enrolmentKey, setEnrolmentKey] = useState("");
  // const [prevData, setPrevData] = useState({});
  const [alreadyAUser, setAlreadyAUser] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // const [date, setDate] = useState();
  const { enqueueSnackbar } = useSnackbar();

  //State for disabled form input field on Page Refresh
  const [formDisabled, setformDisabled] = useState(false);

  const [formData, setFormData] = useState({
    ProfileImage: "",
    FirstName: firstName || "",
    MiddleName: middleName || "",
    email: "",
    LastName: lastName || "",
    whatsapp: mobileNumber || "",
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

  const savePhoto = (imgFile) => {
    const tempFormdata = new FormData();
    tempFormdata.append("file", imgFile);
    axios
      .post(
        `${baseUrl}on_assessment/details/photo/${enrollmentKey}`,
        tempFormdata
      )
      .then(() => {
        enqueueSnackbar("Photo Uploaded Successfully", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Please Provide Valid Image File", {
          variant: "error",
        });
      });
  };

  const setProfileImage = (img) => {
    console.log(img);
    setFormData({ ...formData, ProfileImage: img });
    savePhoto(img);
  };

  const gender = {
    1: "female",
    2: "male",
    3: "other",
  };
  const casteOptions = ["", "obc", "scSt", "general", "others"];
  const qualificationOptions = [
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
  const religionOptions = [
    "",
    "hindu",
    "islam",
    "sikh",
    "jain",
    "christian",
    "others",
  ];

  const CurrentStatusOptions = ["", "nothing", "job", "study", "other"];
  const schoolMediumOptions = ["", "en", "other"];

  useEffect(() => {
    // setEnrolment_key(key)
    // const enrkey = location.pathname.split("/")[2];
    // setEnrolmentKey(enrkey);
  }, []);

  // To Persist Data on Page Refresh..
  useEffect(() => {
    const PrevDatas = JSON.parse(window.sessionStorage.getItem("formData"));
    let formDataObj = window.sessionStorage.getItem("formData") || {};
    if (Object.keys(formDataObj).length > 0) {
      setformDisabled(true);
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
        current_status: CurrentStatusOptions[PrevDatas.current_status],
        qualification: qualificationOptions[PrevDatas.qualification],
        school_medium: schoolMediumOptions[PrevDatas.school_medium],
        caste: casteOptions[PrevDatas.caste],
        religion: religionOptions[PrevDatas.religon],
        math_marks_in10th: PrevDatas.math_marks_in10th,
        percentage_in10th: PrevDatas.percentage_in10th,
        math_marks_in12th: PrevDatas.math_marks_in12th,
        percentage_in12th: PrevDatas.percentage_in12th,
      });
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
        current_status: CurrentStatusOptions[PrevDatas.current_status],
        qualification: qualificationOptions[PrevDatas.qualification],
        school_medium: schoolMediumOptions[PrevDatas.school_medium],
        caste: casteOptions[PrevDatas.caste],
        religion: religionOptions[PrevDatas.religon],
        math_marks_in10th: PrevDatas.math_marks_in10th,
        percentage_in10th: PrevDatas.percentage_in10th,
        math_marks_in12th: PrevDatas.math_marks_in12th,
        percentage_in12th: PrevDatas.percentage_in12th,
      });
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      axios.get(`${baseUrl}/students/${studentId}`).then((res) => {
        if (res.data.data.length > 0) {
          const PrevDatas = res.data.data[0];

          // setPrevData(PrevDatas);
          setAlreadyAUser(true);
          // setInputDisabled(true);
          // Storing the data in session storage..
          window.sessionStorage.setItem("formData", JSON.stringify(PrevDatas));
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
            current_status: CurrentStatusOptions[PrevDatas.current_status],
            qualification: qualificationOptions[PrevDatas.qualification],
            school_medium: schoolMediumOptions[PrevDatas.school_medium],
            caste: casteOptions[PrevDatas.caste],
            religion: religionOptions[PrevDatas.religon],
            math_marks_in10th: PrevDatas.math_marks_in10th,
            percentage_in10th: PrevDatas.percentage_in10th,
            math_marks_in12th: PrevDatas.math_marks_in12th,
            percentage_in12th: PrevDatas.percentage_in12th,
          });
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
            current_status: CurrentStatusOptions[PrevDatas.current_status],
            qualification: qualificationOptions[PrevDatas.qualification],
            school_medium: schoolMediumOptions[PrevDatas.school_medium],
            caste: casteOptions[PrevDatas.caste],
            religion: religionOptions[PrevDatas.religon],
            math_marks_in10th: PrevDatas.math_marks_in10th,
            percentage_in10th: PrevDatas.percentage_in10th,
            math_marks_in12th: PrevDatas.math_marks_in12th,
            percentage_in12th: PrevDatas.percentage_in12th,
          });
        }
      });
    }
  }, []);

  const getSteps = () => [
    { en: "Basic Details", hi: "बुनियादी जानकारी", ma: "मूलभूत माहिती" },
    { en: "Other Details", hi: "अन्य जानकारी", ma: "इतर माहिती" },
  ];

  const steps = getSteps();

  const submitHandler = (prevData) => {
    const data = {
      name: prevData.name,
      email: prevData.email,
      whatsapp: prevData.whatsapp,
      dob: prevData.dob,
      gender: prevData.gender,
      gps_lat: prevData.gps_lat,
      gps_long: prevData.gps_long,
      partner_refer: prevData.partner_refer,
      qualification: prevData.qualification,
      state: prevData.state,
      district: prevData.district,
      city: prevData.city,
      current_status: prevData.current_status,
      school_medium: prevData.school_medium,
      pin_code: prevData.pin_code,
      caste: prevData.caste,
      religon: prevData.religion,
      percentage_in10th: prevData.percentage_in10th
        ? prevData.percentage_in10th
        : "",
      math_marks_in10th: prevData.math_marks_in10th,
      math_marks_in12th: prevData.math_marks_in12th,
      percentage_in12th: prevData.percentage_in12th
        ? prevData.percentage_in12th
        : "",
    };
    if (prevData.alt_mobile) data.alt_mobile = prevData.alt_mobile;

    if (alreadyAUser) {
      axios
        .put(`${baseUrl}students/updateDetails/${studentId}`, {
          gender: prevData.gender,
          gps_lat: prevData.gps_lat,
          gps_long: prevData.gps_long,
          partner_refer: prevData.partner_refer,
          qualification: prevData.qualification,
          state: prevData.state,
          district: prevData.district,
          city: prevData.city,
          current_status: prevData.current_status,
          school_medium: prevData.school_medium,
          pin_code: prevData.pin_code,
          caste: prevData.caste,
          religon: prevData.religion,
          percentage_in10th: "string",
          math_marks_in10th: 0,
          percentage_in12th: "string",
          math_marks_in12th: 0,
        })
        .then(() => {
          navigate(`/test/finalinstruction/`, {
            // state: { enrollmentKey, studentId },
          });
        });
    } else {
      axios
        .post(`${baseUrl}on_assessment/details/${enrollmentKey}`, data)
        .then((res) => {
          dispatch(setStudentId(res.data.details.id));
          navigate(`/test/finalinstruction/`, {
            // state: {
            //   enrollmentKey,
            //   partnerSlug: partner?.slug,
            //   studentId: res.data.details.id,
            // },
          });

          //console.log("res", res);
        })
        .catch(() => {
          enqueueSnackbar("Please fill all the fields properly", {
            variant: "error",
          });
        });
    }
  };

  const handleNext = (data, e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));

    if (
      // !customPartner.includes(partner?.slug || "") &&
      activeStep === 0 &&
      !formData.PrevImage &&
      !formData.ProfileImage
    ) {
      enqueueSnackbar("Please provide a Profile Picture", { variant: "error" });
      return;
    }

    if (activeStep >= steps.length - 1) {
      submitHandler({
        name: `${data.FirstName} ${data.MiddleName} ${data.LastName}`,
        alt_mobile: data.AlternateNumber,
        partner_refer: "NONE",
        image_url: formData.ProfileImage,
        gps_lat: formData.gps_lat ? formData.gps_lat : "",
        gps_long: formData.gps_long ? formData.gps_lat : "",
        math_marks_in10th: formData.math_marks_in10th
          ? formData.math_marks_in10th
          : "",
        math_marks_in12th: formData.math_marks_in12th
          ? formData.math_marks_in12th
          : "",
        ...data,
      });
      return;
    } //submit here
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <React.Suspense fallback={<Loader />}>
            <BasicDetails
              lang={lang}
              formData={formData}
              // handleChange={handleChange}
              reactForm={{ register, errors, control }}
              inputDisabled={alreadyAUser || formDisabled}
              pfpCompulsion={!customPartner.includes(partner?.slug)}
              setProfileImage={setProfileImage}
            />
          </React.Suspense>
        );
      case 1:
        return (
          <React.Suspense fallback={<Loader />}>
            <OtherDetails
              formData={{
                name: `${formData.FirstName} ${formData.MiddleName} ${formData.LastName}`,
                alt_mobile: formData.AlternateNumber,
                partner_refer: "NONE",
                image_url: formData.ProfileImage,
                ...formData,
              }}
              reactForm={{ register, errors, control, watch, setValue }}
              lang={lang}
              // prevFilledData={prevData}
              alreadyAUser={alreadyAUser}
              partnerSlug={partner?.slug}
              inputDisabled={alreadyAUser || formDisabled}
            />
          </React.Suspense>
        );
      default:
        return <div />;
    }
  };

  return (
    <Container className={classes.root} maxWidth="sm">
      <Typography variant="h5" className={classes.text}>
        {steps[activeStep][lang]}
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
};

export default StudentForm;
