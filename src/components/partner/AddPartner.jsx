/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Icon,
  Divider,
} from "@mui/material";
import { AddCircle, DeleteForeverRounded } from "@mui/icons-material";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { useSnackbar } from "notistack";

import { useNavigate } from "react-router-dom";
import { changeFetching } from "../../store/slices/uiSlice";

const baseUrl = import.meta.env.VITE_API_URL;
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  root: {
    maxWidth: 450,
    margin: "auto",
    marginTop: "20px",
  },

  addIcon: {
    position: "absolute",
    marginLeft: "60%",
    top: "9px",
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  btn: {
    marginTop: theme.spacing(4),
  },
}));

const AddPartnerPage = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const fetchingStart = () => dispatch(changeFetching(true));
  const fetchingFinish = () => dispatch(changeFetching(false));
  const [stateList, setStateList] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    slug: "",
    notes: "",
    states: "",
    state: "",
    partnerEmail: "",
    partnerUsers: [{ email: "" }],
    districts: [""],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "partnerUsers",
  });

  useEffect(() => {
    const { value } = props;
    if (value) {
      const dataURL = `${baseUrl}partners/${value}`;
      axios.get(dataURL).then((response) => {
        const { data } = response.data;
        //console.log("data", data);
        setFormData((prevState) => ({
          ...prevState,
          name: data.name || "",
          email: data.email || "",
          slug: data.slug || "",
          notes: data.notes || "",
          state: data.state || "",
          partnerUsers: data.partnerUser || [{ email: "" }],
          districts: data.districts || [""],
        }));

        reset({
          name: data.name || "",
          email: data.email || "",
          slug: data.slug || "",
          notes: data.notes || "",
          state: data.state || "",
          partnerUsers: data.partnerUser || [{ email: "" }],
          districts: data.districts || [""],
        });
      });
    } else {
      reset({
        ...formData,
        partnerUsers: [""],
        districts: [""],
      });
    }
    // eslint-disable-next-line no-use-before-define
    getStateList();
  }, []);

  const submitHandler = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    const { value } = props;
    if (value) {
      //edit partner
    } else {
      //add partner
    }
  };

  const addPartner = async () => {
    const {
      name,
      email,
      notes,
      slug,
      partnerUsers,
      districts,
      state: _state,
    } = formData;
    const removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );

    try {
      fetchingStart();
      const dataURL = ` ${baseUrl}partners`;
      const response = await axios.post(
        dataURL,
        {
          name,
          email,
          notes,
          slug,
          state: _state,
          partnerUsers,
          districts: removeExtraDistricts,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      if (response.data.error) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Partner details added Successfull!", {
          variant: "success",
        });
        fetchingFinish();
        navigate("/partners");
      }
    } catch (e) {
      //console.log(e);
      enqueueSnackbar("All fields are mandatory Or Slug should be unique", {
        variant: "error",
      });
      fetchingFinish();
    }
  };

  const editPartner = (value) => {
    const {
      name,
      email,
      notes,
      partnerUsers,
      districts,
      state: _state,
    } = formData;
    const removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );

    axios
      .put(`${baseUrl}partners/${value}`, {
        name,
        email: email || null,
        notes,
        state: _state || null,
        partner_user: partnerUsers || null,
        districts:
          removeExtraDistricts.length > 0 ? removeExtraDistricts : null,
      })
      .then((response) => {
        if (response.data.error) {
          enqueueSnackbar(`Something went wrong, ${response.data.message}`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Partner details Successfull edit", {
            variant: "success",
          });
          fetchingFinish();
          navigate("/partners");
        }
      })
      .catch((error) => {
        enqueueSnackbar(`Something went wrong, ${error}`, {
          variant: "error",
        });
      });
  };

  // const onSubmit = () => {
  //   const { value } = props;
  //   if (value) {
  //     editPartner(value);
  //   } else {
  //     addPartner();
  //   }
  // };

  const getStateList = async () => {
    const response = await axios.get(
      "https://api.countrystatecity.in/v1/countries/IN/states",
      {
        headers: {
          "X-CSCAPI-KEY":
            "TzZrb2p0emtqa29BOW0zTnpLZHdzOVdjNmlubnRDMmtqOEgxRXpFdw==",
        },
      }
    );
    const newData = response.data.sort((a, b) => {
      const fa = a.name.toLowerCase();
      const fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    setStateList(newData);
  };

  // const addState = () => {
  //   setState({ ...state, districts: ["", ...state.districts] });
  // };

  // const addEmail = () => {
  //   setState({ ...state, partner_user: [...state.partner_user, ""] });
  // };

  // const handleChange = (name) => (event) => {
  //   const valChange = {};
  //   valChange[name] = event.target.value;
  //   setState({ ...state, [name]: event.target.value });
  // };

  // const changeDistricts = (value, index) => {
  //   const newDistricts = [...state.districts];
  //   newDistricts[index] = value;
  //   console.log(newDistricts);
  //   setState((prevState) => ({ ...prevState, districts: newDistricts }));
  // };

  // const changeHandler = (index) => {
  //   const { value } = props;
  //   if (event.target.name === "state") {
  //     const { districts } = state;
  //     if (event.target.value) {
  //       districts[index] = event.target.value;
  //     } else {
  //       districts.splice(index, 1);
  //     }
  //     setState({
  //       ...state,
  //       districts: districts.length < 1 ? [""] : districts,
  //     });
  //   }
  //   if (event.target.name === "user") {
  //     let newPEmail;
  //     const { partner_user } = state;
  //     if (event.target.value) {
  //       if (partner_user.length < 1) {
  //         newPEmail = state.partnerEmail + event.target.value;
  //         partner_user[0] = {
  //           email: newPEmail,
  //           partner_id: value,
  //         };
  //       } else if (partner_user[index]) {
  //         partner_user[index] = {
  //           ...partner_user[index],
  //           email: event.target.value,
  //         };
  //       } else {
  //         partner_user[index] = {
  //           email: event.target.value,
  //           partner_id: value,
  //         };
  //       }
  //     } else {
  //       partner_user.splice(index, 1);
  //     }
  //     setState({
  //       ...state,
  //       partnerEmail: newPEmail || state.partnerEmail,
  //       partner_user: partner_user.length < 1 ? [""] : partner_user,
  //     });
  //   }
  // };

  const { value } = props;
  //console.log("state", state);
  return (
    <Container component={Paper} maxWidth="sm" className={classes.root}>
      <Grid container spacing={2} sx={{ p: ".4rem" }}>
        <Grid item xs={12}>
          <Controller
            control={control}
            defaultValue={formData.name || ""}
            name="name"
            rules={{ required: true, maxLength: 40 }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="name"
                // autoFocus
                inputRef={ref}
                className={classes.spacing}
                label="Partner Name"
                placeholder="Partner Name"
                autoComplete="off"
                type="text"
                error={!!errors.name}
                helperText={
                  errors.name
                    ? errors.name.type === "maxLength"
                      ? "Length should be under 40 characters"
                      : "Partner ka Name Enter karein."
                    : "Ex. ABC"
                }
                {...rest}
              />
            )}
          />
          {/* <FormControl>
          <InputLabel htmlFor="partnerName">Partner Name</InputLabel>
          <Input
            id="partnerName"
            aria-describedby="my-helper-text"
            name="name"
            value={state.name}
            onChange={handleChange("name")}
          />
          <FormHelperText className={classes.text} id="my-helper-text">
            
          </FormHelperText>
        </FormControl> */}
        </Grid>

        <FormControl>
          <InputLabel htmlFor="partnerEmail">Partner Email</InputLabel>
          <Input
            id="partnerEmail"
            aria-describedby="my-helper-text"
            name="email"
            // value={state.email}
            // onChange={handleChange("email")}
          />
          <FormHelperText className={classes.text} id="my-helper-text">
            Partner ka Email Enter karein.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="partnerNotes">Partner Notes</InputLabel>
          <Input
            id="partnerNotes"
            aria-describedby="my-helper-text"
            name="notes"
            // value={state.notes}
            // onChange={handleChange("notes")}
          />
          <FormHelperText className={classes.text} id="my-helper-text">
            Partner ki thodi details add karein.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="partnerNotes">Partner Slug</InputLabel>
          <Input
            id="partnerNotes"
            aria-describedby="my-helper-text"
            name="notes"
            disabled={!!value}
            // value={state.slug}
            // onChange={handleChange("slug")}
          />
          <FormHelperText className={classes.text} id="my-helper-text">
            Partner ke student ko online test dene ke liye Slug add karo.
          </FormHelperText>
        </FormControl>

        {fields.map((email, index) => (
          <React.Fragment key={email.id}>
            <Grid item xs={9}>
              <Controller
                control={control}
                defaultValue={formData.partnerUsers[index]?.email || ""}
                name={`partnerUsers[${index}].email`}
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id={`partnerUsers[${index}]`}
                    name={`partnerUsers[${index}]`}
                    inputRef={ref}
                    // className={classes.spacing}
                    label={`User Email ${index + 1}`}
                    placeholder={`User Email ${index + 1}`}
                    autoComplete="off"
                    type="email"
                    error={
                      !!errors.partnerUsers && !!errors.partnerUsers[index]
                    }
                    helperText={
                      errors.name
                        ? `Required Field`
                        : `Enter Partner Email ${index + 1}`
                    }
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              }}
            >
              <IconButton
                color="primary"
                size="large"
                onClick={() => remove(index)}
                style={{
                  // marginTop: "3vh",
                  borderSpacing: "-1",
                }}
              >
                <DeleteForeverRounded />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={7} sx={{ mY: "0.2rem" }}>
          <Button variant="outlined" color="primary" onClick={() => append()}>
            <Icon
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1vh",
                // marginTop: "-1vh",
              }}
            >
              <AddCircle />
            </Icon>
            Add Another Email
          </Button>
        </Grid>

        <Divider variant="middle" />
        {/* <FormControl>
          {state.partner_user.length > 0 ? (
            // eslint-disable-next-line arrow-body-style
            state.partner_user.map((user, index) => {
              return (
                <div key={user.email}>
                  <TextField
                    // type={
                    //   state.partner_user.length - 1 === index ? "search" : null
                    // }
                    id="PartnerUsers"
                    // label="Users"
                    placeholder="User"
                    aria-describedby="my-helper-text"
                    name="user"
                    value={user.email}
                    // onChange={() => changeHandler(index)}
                  />
                </div>
              );
            })
          ) : (
            <div>
              <TextField
                id="PartnerUsers"
                // label="Users"
                placeholder="User"
                aria-describedby="my-helper-text"
                name="user"
                // value={state.partnerEmail}
                // onChange={() => changeHandler()}
              />
            </div>
          )}

          <FormHelperText className={classes.text} id="my-helper-text">
            Multiple Email Enter karein
          </FormHelperText>
          <Fab
            className={classes.addIcon}
            color="primary"
            aria-label="add"
            // onClick={addEmail}
            // disabled={state.partner_user[state.partner_user.length - 1] === ""}
          >
            <AddIcon />
          </Fab>
        </FormControl> */}

        {/* <FormControl>
          {state.districts.map((state_d, index) => (
            <div key={state_d}>
              <TextField
                // type={state.districts.length - 1 === index ? "search" : null}
                id="PartnerDistrictsCities"
                label=" Partner Districts/Cities"
                aria-describedby="my-helper-text"
                name={`districts-${index}`}
                defaultValue={state_d}
                // onChange={(e) => changeDistricts(e.target.value, index)}
              />
              {console.log(index)}
            </div>
          ))}
          <FormHelperText className={classes.text} id="my-helper-text">
            Partner ka districts or city Enter karein.
          </FormHelperText>
          <Fab
            className={classes.addIcon}
            color="primary"
            aria-label="add"
            // onClick={addState}
            // disabled={state.districts[0] === ""}
          >
            <AddIcon />
          </Fab>
        </FormControl> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit((data) => console.log(data))}
          className={classes.btn}
        >
          {value ? "Edit Partner" : "Add Partner"}
        </Button>
      </Grid>
    </Container>
  );
};

export default AddPartnerPage;
