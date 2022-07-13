/* eslint-disable camelcase */
import React from "react";
import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const baseUrl = import.meta.env.VITE_API_URL;

const AddOrUpdateContact = ({
  contactType,
  mobile,
  studentId,
  handleClose,
}) => {
  const { privileges } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [contact, setContact] = React.useState(mobile);

  const handleChange = (e) => setContact(e.target.value);

  const addOrUpdateMobile = async (action) => {
    if (!contact || contact === "") {
      enqueueSnackbar("New Mobile number is required!", {
        variant: "error",
      });
      return;
    }

    const updateOrAddType =
      action.toUpperCase() === "ADD" ? "addContact" : "updateContact";

    if (privileges.some((priv) => priv.privilege === "AddOrUpdateContact")) {
      try {
        await axios.post(`${baseUrl}students/contactUpdateAdd/${studentId}`, {
          mobile,
          contact_type: contactType,
          updateOrAddType,
        });
        handleClose();
        enqueueSnackbar("Contact is successfully Added/Updated!", {
          variant: "success",
        });
      } catch (e) {
        enqueueSnackbar("Mobile number should be 10 digit!", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("You are not Authenticated user to Add/Update contact!", {
        variant: "error",
      });
    }
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={7}>
        <TextField
          name={contactType}
          variant="outlined"
          onChange={handleChange}
          label={contactType.toUpperCase()}
          defaultValue={mobile}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => addOrUpdateMobile("add")}
        >
          Update
        </Button>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => addOrUpdateMobile("update")}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddOrUpdateContact;
