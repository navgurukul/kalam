import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdatePartner = ({ change, studentId, value, allOptions, rowMeta }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);

  console.log("value", value);
  // console.log("allOptions", allOptions);
  console.log("data", data);
  console.log("rowMeta", rowMeta);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${baseURL}partners`, { signal: controller.signal })
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() => {
        // if (err.message === "canceled") return;
      });
    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    console.log("event", event);
    // const { change, studentId } = props;
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
  // const { value } = props;
  const newValue = value ? value : rowMeta.rowData[26];
  console.log("newValue", newValue);
  const selectedValue = { value: newValue, label: newValue };

  console.log("selectedValue", selectedValue);

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={
        data.length > 0 && data.map((x) => ({ value: x.id, label: x.name }))
      }
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdatePartner;
