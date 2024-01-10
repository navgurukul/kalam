import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdateDonor = ({ value, studentId, change, allOptions }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDonors, setSelectedDonors] = React.useState(value);

  const donor =
    selectedDonors && selectedDonors?.donor_id
      ? allOptions?.filter((item) => item.id == selectedDonors?.donor_id[0])
      : selectedDonors;

  const selectedValue =
    value && value?.donor_id
      ? allOptions?.filter((item) => item.id == value?.donor_id[0])
      : value;

  const updateDonor = () =>
    axios
      .put(`${baseURL}students/${studentId}`, {
        donor: donor?.map((item) => item.id),
      })
      .then((res) => {
        change(selectedDonors ?? []);
        enqueueSnackbar(res.data.data, {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(`Error in Updating Donor`, {
          variant: "error",
        });
      });

  const handleChange = (event) =>
    setSelectedDonors(
      value && event === null
        ? []
        : event.map((item) => ({ id: item.value, donor: item.label }))
    );

  console.log("selectedDonors", selectedDonors);
  console.log("value", value);

  // Need to come back to this

  return (
    <>
      <Select
        className="filterSelectStage"
        components={{ animatedComponents }}
        isMulti
        value={
          selectedDonors
            ? donor?.map((x) => ({ value: x.id, label: x.donor }))
            : selectedDonors
        }
        onChange={handleChange}
        options={allOptions.map((x) => ({ value: x.id, label: x.donor }))}
        isClearable={false}
      />
      <Button
        color="primary"
        disabled={
          JSON.stringify(selectedDonors) === JSON.stringify(selectedValue)
        }
        onClick={updateDonor}
      >
        Update
      </Button>
    </>
  );
};

export default UpdateDonor;
