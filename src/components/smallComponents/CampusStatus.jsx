import React from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();
const baseURL = import.meta.env.VITE_API_URL;

const CampusStatusDropdown = (props) => {
  const handleChange = (event) => {
    const { change } = props;
    const { label, value } = event;
    change(label);
    // axios
    //   .put(`${baseURL}students/${studentId}`, { partner_id: value })
    //   .then(() => {
    //     enqueueSnackbar(`Partner successfully updated !`, {
    //       variant: "success",
    //     });
    //     change(label);
    //   })
    //   .catch((err) => {
    //     enqueueSnackbar(err, { variant: "error" });
    //   });
  };

  const campusStatusOptions = [
    { value: "droppedOut", label: "Dropped Out" },
    { value: "onLeave", label: "On Leave" },
    { value: "present", label: "Present" },
  ];

  return (
    <Select
      className="filterSelectStage"
      // value={selectedValue}
      onChange={handleChange}
      placeholder="Select Campus Status"
      options={campusStatusOptions}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default CampusStatusDropdown;
