/* eslint-disable camelcase */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import {
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

const AddPartnerPage = ({ partnerId, closeDialog }) => {
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
    state: "",
    partnerEmail: "",
    partnerUsers: [{ email: "" }],
    districts: [""],
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const {
    fields: partnerUserFields,
    append: appendPartnerUser,
    remove: removePartnerUser,
  } = useFieldArray({
    control,
    name: "partnerUsers",
  });

  const {
    fields: districtFields,
    append: appendDistrict,
    remove: removeDistrict,
  } = useFieldArray({
    control,
    name: "districts",
  });

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

  useEffect(() => {
    if (partnerId) {
      const dataURL = `${baseUrl}partners/${partnerId}`;
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
    getStateList();
  }, []);

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

  const editPartner = () => {
    const { name, email, notes, partnerUsers, districts, state } = formData;
    const removeExtraDistricts = districts.filter(
      (district) => district.length > 0
    );

    axios
      .put(`${baseUrl}partners/${partnerId}`, {
        name,
        email: email || null,
        notes,
        state: state || null,
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

  const onSubmit = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
    if (partnerId) {
      //edit partner
      editPartner(partnerId);
    } else {
      //add partner
      addPartner();
    }
  };

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
                    : "Partner ka Name Enter karein."
                }
                {...rest}
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={formData.email || ""}
            name="email"
            rules={{
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                inputRef={ref}
                className={classes.spacing}
                label="Email"
                placeholder="Email"
                autoComplete="off"
                type="email"
                style={{
                  marginTop: "1rem",
                }}
                error={!!errors.email}
                helperText={
                  errors.email
                    ? errors.email.type === "pattern"
                      ? "Please enter a valid email address"
                      : "Email ka Address Enter karein."
                    : "Partner ka Email Enter karein."
                }
                {...rest}
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={formData.notes || ""}
            name="notes"
            rules={{ required: true }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="notes"
                inputRef={ref}
                className={classes.spacing}
                label="Notes"
                placeholder="Notes"
                autoComplete="off"
                type="text"
                style={{
                  marginTop: "1rem",
                }}
                error={!!errors.notes}
                helperText={
                  errors.notes
                    ? errors.notes.type === "required"
                      ? "Please enter notes"
                      : "Partner ki thodi details add karein."
                    : "Partner ki thodi details add karein."
                }
                {...rest}
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={formData.slug || ""}
            name="slug"
            rules={{ required: true }}
            render={({ field: { ref, ...rest } }) => (
              <TextField
                variant="outlined"
                fullWidth
                id="slug"
                inputRef={ref}
                className={classes.spacing}
                label="Slug"
                placeholder="Slug"
                autoComplete="off"
                type="text"
                style={{
                  marginTop: "1rem",
                }}
                error={!!errors.slug}
                helperText={
                  errors.slug
                    ? errors.slug.type === "required"
                      ? "Please enter slug"
                      : "Partner ke student ko online test dene ke liye Slug add karo."
                    : "Partner ke student ko online test dene ke liye Slug add karo."
                }
                {...rest}
              />
            )}
          />
        </Grid>

        {partnerUserFields.map((email, index) => (
          <React.Fragment key={email.id}>
            <Grid item xs={9}>
              <Controller
                control={control}
                defaultValue={formData.partnerUsers[index]?.email || ""}
                name={`partnerUsers[${index}].email`}
                rules={{
                  required: true,
                  pattern:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                }}
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
                onClick={() => removePartnerUser(index)}
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
        <Grid item xs={12} sx={{ mY: "0.2rem" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => appendPartnerUser()}
          >
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
        {districtFields.map((district, index) => (
          <React.Fragment key={district.id}>
            <Grid item xs={9}>
              <Controller
                control={control}
                defaultValue={formData.districts[index] || ""}
                name={`districts[${index}]`}
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id={`districts[${index}]`}
                    inputRef={ref}
                    // className={classes.spacing}
                    label={`District ${index + 1}`}
                    placeholder={`District ${index + 1}`}
                    autoComplete="off"
                    type="email"
                    error={
                      !!errors.partnerUsers && !!errors.partnerUsers[index]
                    }
                    helperText={
                      errors.name
                        ? `Required Field`
                        : `Enter District ${index + 1}`
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
                onClick={() => removeDistrict(index)}
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
        <Grid item xs={12} sx={{ mY: "0.2rem" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => appendDistrict()}
          >
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
            Add Another District
          </Button>
        </Grid>

        <Grid item xs={partnerId ? 6 : 12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            className={classes.btn}
          >
            {partnerId ? "Update Partner" : "Add Partner"}
          </Button>
        </Grid>
        {partnerId ? (
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={closeDialog}
              className={classes.btn}
            >
              Cancel
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};

export default AddPartnerPage;
