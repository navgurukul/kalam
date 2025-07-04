import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FormControl, InputLabel, Select as MUISelect, MenuItem } from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL;

const UpdatePartner = ({ change, studentId, value, allOptions, privileges }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [partnerName, setPartnerName] = useState();

  useEffect(() => {
    axios
      .get(`${baseURL}/students/${studentId}`)
      .then((res) => {
        setPartnerName(res.data.data[0]?.partner?.name);
      })
      .catch(() => {});
  }, [value]);

  const newValue = value ? value : partnerName;
  const selectedValue = allOptions?.find((opt) => opt.name === newValue)?.id || "";

  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedOption = allOptions.find((item) => item.id === selectedId);
    if (!selectedOption) return;

    axios
      .put(`${baseURL}students/${studentId}`, { partner_id: selectedId })
      .then(() => {
        enqueueSnackbar(`Partner successfully updated !`, {
          variant: "success",
        });
        change(selectedOption.name);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return privileges?.some((priv) => priv.privilege === "UpdateStudentPartner") ? (
    <FormControl fullWidth size="small">
      <InputLabel>Select Partner</InputLabel>
      <MUISelect
        value={selectedValue}
        onChange={handleChange}
        label="Select Partner"
      >
        {allOptions?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  ) : (
    <p>{value}</p>
  );
};

export default UpdatePartner;
