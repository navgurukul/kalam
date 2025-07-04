import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  Button,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL;

const UpdateDonor = ({ value, studentId, change, allOptions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDonors, setSelectedDonors] = useState([]);

  useEffect(() => {
    if (value && value?.donor_id) {
      const matched = allOptions.filter((item) => value.donor_id.includes(item.id));
      setSelectedDonors(matched.map((x) => x.id));
    }
  }, [value, allOptions]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDonors(typeof value === 'string' ? value.split(',') : value);
  };

  const updateDonor = () => {
    axios
      .put(`${baseURL}students/${studentId}`, {
        donor: selectedDonors,
      })
      .then((res) => {
        const newDonors = allOptions.filter((x) => selectedDonors.includes(x.id));
        change(newDonors);
        enqueueSnackbar(res.data.data, { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Error in Updating Donor", { variant: "error" });
      });
  };

  const selectedValue = selectedDonors;

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Select Donor</InputLabel>
        <MUISelect
          multiple
          value={selectedValue}
          onChange={handleChange}
          input={<OutlinedInput label="Select Donor" />}
          renderValue={(selected) =>
            selected
              .map((id) => allOptions.find((x) => x.id === id)?.donor || id)
              .join(", ")
          }
        >
          {allOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selectedDonors.indexOf(option.id) > -1} />
              <ListItemText primary={option.donor} />
            </MenuItem>
          ))}
        </MUISelect>
      </FormControl>
      <Button
        color="primary"
        disabled={
          JSON.stringify(selectedDonors) ===
          JSON.stringify(value?.donor_id || [])
        }
        onClick={updateDonor}
      >
        Update
      </Button>
    </>
  );
};

export default UpdateDonor;
