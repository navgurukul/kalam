/* eslint-disable camelcase */
import React from "react";
import { Button } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const { permissions } = require("../config");

const baseUrl = import.meta.env.VITE_API_URL;

const AddOrUpdateContact = (props) => {
  const { loggedInUser } = useSelector((state) => state.auth);
  const [updateOrAddType, setUpdateOrAddType] = React.useState("");
  const snackbar = useSnackbar();
  const addOrUpdateMobile = async (event) => {
    const { contact_type, mobile, studentId, handleClose } = props;
    const type = event.target.innerText;

    await setUpdateOrAddType(type === "ADD" ? "addContact" : "updateContact");

    if (permissions.addOrUpdateContact.indexOf(loggedInUser.mail_id) >= 0) {
      try {
        if (mobile) {
          axios
            .post(`${baseUrl}students/contactUpdateAdd/${studentId}`, {
              mobile,
              contact_type,
              updateOrAddType,
            })
            .then(() => {
              handleClose();
              snackbar.enqueueSnackbar(
                "Contact is successfully Added/Updated!",
                { variant: "success" }
              );
            })
            .catch(() => {
              snackbar.enqueueSnackbar("Mobile number should be 10 digit!", {
                variant: "error",
              });
            });
        } else {
          snackbar.enqueueSnackbar("New mobile number is required!", {
            variant: "error",
          });
        }
      } catch (e) {
        //console.log(e);
        snackbar.enqueueSnackbar("Something went wrong in server", {
          variant: "error",
        });
      }
    } else {
      handleClose();
      snackbar.enqueueSnackbar(
        "You are not Authenticated user to Add/Update contact!",
        { variant: "error" }
      );
    }
  };
  return (
    <DialogActions>
      <Button variant="contained" color="primary" onClick={addOrUpdateMobile}>
        Update
      </Button>
      <Button variant="contained" color="primary" onClick={addOrUpdateMobile}>
        Add
      </Button>
    </DialogActions>
  );
};

export default AddOrUpdateContact;
