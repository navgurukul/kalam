import React from "react";
import { makeStyles } from "@mui/styles";

import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
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

const AddSlug = ({ name, notes, partnerId, change, columnIndex }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [partner, setPartner] = React.useState({
    name: name ?? "",
    notes: notes ?? "",
    slug: "",
  });

  const editPartner = async () => {
    try {
      const dataURL = `${baseUrl}partners/${partnerId}`;
      await axios
        .put(dataURL, {
          name: partner.name,
          notes: partner.notes,
          slug: partner.slug,
        })
        .then(() => {
          setDialogOpen(false);
          enqueueSnackbar("Partner successfully edited with slug!", {
            variant: "success",
          });
          change(partner.slug, columnIndex);
        });
    } catch (e) {
      enqueueSnackbar("All fields are mandatory Or Slug should be unique", {
        variant: "error",
      });
    }
  };

  const onSubmit = () => editPartner();

  const handleChange = (event) => {
    setPartner({ ...partner, [event.target.name]: event.target.value });
  };

  const toggleDialog = () => {
    setDialogOpen((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={toggleDialog}
      >
        Add Slug
      </Button>
      <Dialog open={dialogOpen} onClose={toggleDialog}>
        <DialogContent className={classes.container}>
          <TextField
            id="partnerName"
            name="name"
            label="Partner Name"
            value={partner.name}
            onChange={handleChange}
            helperText="Partner ka Name Enter karein."
          />
          <TextField
            id="partnerNotes"
            name="notes"
            value={partner.notes}
            label="Partner Notes"
            onChange={handleChange}
            helperText="Partner ka Name Enter karein."
          />
          <TextField
            id="partnerSlug"
            name="slug"
            value={partner.slug}
            label="Partner Slug"
            onChange={handleChange}
            helperText="Partner ke student ko online test dene ke liye Slug add karo."
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={toggleDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Edit Partner
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSlug;
