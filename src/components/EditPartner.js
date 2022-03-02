import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import { Button } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { Dialog } from "@material-ui/core";
import { Box } from "@material-ui/core";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const baseUrl = process.env.API_URL;

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
          name: name,
          notes: notes,
          slug: slug,
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
      console.error(e);
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
      name: name,
      notes: notes,
    });
  }, []);

  const handleChange = (name) => (event) => {
    let valChange = {};
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
  return (
    <Fragment>
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
              defaultValue={props.name}
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
              defaultValue={props.notes}
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
    </Fragment>
  );
};

// export default withSnackbar(withStyles(styles)(EditPartner));
export default EditPartner;
