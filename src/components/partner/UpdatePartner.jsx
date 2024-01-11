import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdatePartner = ({
  change,
  studentId,
  value,
  allOptions,
  privileges,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [partnerName, setPartnerName] = React.useState();

  const handleChange = (event) => {
    const { label, value } = event;
    axios
      .put(`${baseURL}students/${studentId}`, { partner_id: value })
      .then(() => {
        enqueueSnackbar(`Partner successfully updated !`, {
          variant: "success",
        });
        change(label);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/students/${studentId}`)
      .then((res) => {
        setPartnerName(res.data.data[0]?.partner?.name);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [value]);

  const newValue = value ? value : partnerName;
  const selectedValue = { value: newValue, label: newValue };

  return privileges.some(
    (priv) => priv.privilege === "UpdateStudentPartner"
  ) ? (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={
        allOptions.length > 0 &&
        allOptions.map((x) => ({ value: x.id, label: x.name }))
      }
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  ) : (
    <p>{value}</p>
  );
};

export default UpdatePartner;
