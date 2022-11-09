import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { Box } from "@mui/system";
// import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { genders } from "../../utils/constants";

const baseUrl = import.meta.env.VITE_API_URL;

const stageOptions = [
  {
    value: "EnglishInterview",
    label: "English Interview Pending (2nd Round)",
  },
  {
    value: "AlgebraInterview",
    label: "Algebra Interview Pending (3rd Round)",
  },
  {
    value: "CultureFitInterview",
    label: "Culture Fit Interview Pending (4th Round)",
  },
];

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
    // marginTop: theme.spacing(4),
  },
}));

const AddOwner = ({ updateOwners, isEdit, disabled, ownerData, ownerId }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { users } = useSelector((state) => state.owners);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [owner, setOwner] = React.useState({
    name: null,
    id: ownerId ?? null,
    availablity: "",
    stage: [],
    limit: 0,
    gender: "",
  });

  const fetchOwner = async (fetchOwnerId) => {
    const ownerRes = await axios.get(`${baseUrl}owner/${fetchOwnerId}`);
    const fetchedOwner = ownerRes.data?.data[0];

    setOwner({
      name: fetchedOwner.user.mail_id,
      gender: fetchedOwner.gender ?? "",
      availablity: fetchedOwner.available,
      stage: fetchedOwner.type,
      limit: fetchedOwner.max_limit,
      id: fetchedOwner.id,
    });
  };

  const createOwner = () => {
    const { name, gender, id, availablity, stage, limit } = owner;
    const duplicateData = ownerData.some((x) => x.user.mail_id === name);
    if (duplicateData) {
      enqueueSnackbar(`${name} exists in owner dashboard.`, {
        variant: "error",
      });
      return;
    }
    if (name && id && gender && stage && availablity !== "" && limit > 0) {
      axios
        .post(`${baseUrl}owner`, {
          user_id: id,
          available: availablity === "Yes",
          max_limit: limit ? parseInt(limit, 10) : undefined,
          type: stage,
          gender: parseInt(gender, 10),
        })
        .then((response) => {
          enqueueSnackbar(`Owner Successfull created !`, {
            variant: "success",
          });
          setDialogOpen(false);
          updateOwners(response.data.data[0], false);
        });
    } else {
      enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  const openDialog = async () => {
    setDialogOpen(true);
    if (isEdit) await fetchOwner(ownerId);
  };

  const handleClose = (ev, clickaway) => {
    setDialogOpen(false);
    if (clickaway) return;
    setOwner({
      name: null,
      id: ownerId ?? null,
      availablity: "",
      stage: [],
      limit: 0,
      gender: "",
    });
  };

  const editOwner = () => {
    const { name, gender, id, availablity, stage, limit } = owner;
    if (name && id && gender && stage && availablity !== "" && limit > 0) {
      axios
        .put(`${baseUrl}owner/${id}`, {
          available: availablity,
          max_limit: parseInt(limit, 10),
          type: stage,
          gender: parseInt(gender, 10),
        })
        .then((response) => {
          enqueueSnackbar(`Owner Successfull updated!`, {
            variant: "success",
          });
          handleClose();
          updateOwners(response.data.data[0], true);
        })
        .catch((err) => {
          console.error(err.message);
          enqueueSnackbar(`Interviews limit  should not be 10`, {
            variant: "error",
          });
          setDialogOpen(false);
        });
    } else {
      enqueueSnackbar(`Please fill all fields`, {
        variant: "error",
      });
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "name") {
      setOwner({ ...owner, name: event.target.label, id: event.target.value });
    } else {
      setOwner({
        ...owner,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleStageChange = (event) => {
    const {
      target: { value },
    } = event;
    setOwner({
      ...owner,
      stage: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleStageRemove = (value) => {
    setOwner((prevOwner) => ({
      ...prevOwner,
      stage: prevOwner.stage.filter((val) => val !== value),
    }));
  };

  const { name, gender, availablity, stage, limit } = owner;

  return (
    <>
      {isEdit ? (
        <IconButton disabled={disabled} onClick={openDialog}>
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={openDialog}
          className={classes.btn}
          disabled={disabled}
        >
          Add Owner
        </Button>
      )}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Add New Owner</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl sx={{ pt: "0.4rem" }}>
            <Autocomplete
              name="name"
              value={name}
              onChange={(ev, value) =>
                handleChange({
                  target: {
                    name: "name",
                    label: value.label,
                    value: value.value,
                  },
                })
              }
              options={users.map((x) => ({ value: x.id, label: x.user }))}
              isOptionEqualToValue={(option, value) => option.label === value}
              placeholder="Select Owner"
              renderInput={(params) => (
                <TextField
                  label="Select Owner"
                  helperText="Please Select Owner"
                  {...params}
                />
              )}
            />
          </FormControl>

          <FormControl>
            <InputLabel>Select Gender</InputLabel>
            <Select
              name="gender"
              value={gender}
              onChange={handleChange}
              placeholder="Select Gender"
              label="Select Gender"
            >
              <MenuItem value="" disabled>
                Select an Option
              </MenuItem>
              {Object.entries(genders).map(([value, label]) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className={classes.text} id="my-helper-text">
              Please select your gender
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel>Select Availability</InputLabel>
            <Select
              name="availablity"
              value={availablity}
              onChange={handleChange}
              placeholder="Select Availablity"
            >
              <MenuItem value="" disabled>
                Select an Option
              </MenuItem>
              {[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ].map(({ value, label }) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className={classes.text} id="my-helper-text">
              Select Yes/No
            </FormHelperText>
          </FormControl>

          <FormControl>
            <InputLabel>Select Stage</InputLabel>
            <Select
              name="stage"
              label="Select Stage"
              placeholder="Select Stage"
              value={stage}
              multiple
              onChange={handleStageChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      key={value}
                      label={
                        stageOptions.find(
                          (currentStage) => currentStage.value === value
                        ).label
                      }
                      onDelete={() => handleStageRemove(value)}
                    />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="" disabled>
                Select an Option
              </MenuItem>
              {stageOptions
                .filter(({ value }) => !stage.includes(value))
                .map(({ label, value }) => (
                  <MenuItem value={value} key={value}>
                    {label}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText className={classes.text} id="my-helper-text">
              Stage select kariye jo aap owner ko assign karna chahate ho.
            </FormHelperText>
          </FormControl>

          <TextField
            type="number"
            id="limit"
            name="limit"
            label="Interview Limit"
            placeholder="Interview Limit"
            value={limit}
            onChange={handleChange}
            helperText="Ek student kitne interviews le sakta hai."
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={isEdit ? editOwner : createOwner}
            className={classes.btn}
            disabled={isEdit && !name}
          >
            {`${isEdit ? "Update" : "Add"} Owner`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddOwner;
