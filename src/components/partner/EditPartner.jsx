import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import {
  Button,
  Dialog,
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import { useSnackbar } from "notistack";

import EditIcon from "@mui/icons-material/Edit";

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    maxWidth: 400,
  },
  btn: {
    marginTop: theme.spacing(4),
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

const EditPartner = (props) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    name: "",
    notes: "",
    slug: "",
    dialogOpen: false,
  });

  const editPartner = async () => {
    try {
      const { partnerId, change, columnIndex } = props;
      const { name, notes, slug } = state;
      const dataURL = `${baseUrl}partners/${partnerId}`;
      await axios
        .put(dataURL, {
          name,
          notes,
          slug,
        })
        .then(() => {
          //console.log(response.data);
          setState({
            ...state,
            dialogOpen: false,
          });
          snackbar.enqueueSnackbar("Partner successfully edited with slug!", {
            variant: "success",
          });
          change(slug, columnIndex);
        });
    } catch (e) {
      snackbar.enqueueSnackbar(
        "All fields are mandatory Or Slug should be unique",
        { variant: "error" }
      );
    }
  };

  const onSubmit = () => {
    setState({
      ...state,
      loading: true,
    });
    editPartner();
  };

  useEffect(() => {
    const { name, notes } = props;
    setState({
      ...state,
      name,
      notes,
    });
  }, []);

  const handleChange = (name) => (event) => {
    const valChange = {};
    valChange[name] = event.target.value;

    setState({ ...state, [name]: event.target.value });
  };

  const handleClose = () => {
    setState({
      ...state,
      dialogOpen: false,
    });
  };

  const handleOpen = () => {
    setState({
      ...state,
      dialogOpen: true,
    });
  };
  const { name, notes } = props;
  return (
    <>
      <Box onClick={handleOpen} style={{ cursor: "pointer" }}>
        <EditIcon /> Add Slug
      </Box>
      <Dialog open={state.dialogOpen} onClose={handleClose}>
        <form className={classes.container}>
          <FormControl>
            <InputLabel htmlFor="partnerName">Partner Name</InputLabel>
            <Input
              id="partnerName"
              aria-describedby="my-helper-text"
              name="name"
              defaultValue={name}
              onChange={handleChange("name")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ka Name Enter karein.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="partnerNotes">Partner Notes</InputLabel>
            <Input
              id="partnerNotes"
              aria-describedby="my-helper-text"
              name="notes"
              defaultValue={notes}
              onChange={handleChange("notes")}
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
              value={state.slug}
              onChange={handleChange("slug")}
            />
            <FormHelperText className={classes.text} id="my-helper-text">
              Partner ke student ko online test dene ke liye Slug add karo.
            </FormHelperText>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.btn}
          >
            Edit Partner
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default EditPartner;
