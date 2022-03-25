import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdatePartner = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);

  useEffect(() => {
    axios.get(`${baseURL}partners`).then((response) => {
      setData(response.data.data);
    });
  }, []);

  const handleChange = (event) => {
    const { change, studentId } = props;
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
        enqueueSnackbar(err, { variant: "error" });
      });
  };
  const { value } = props;
  const selectedValue = { value, label: value };

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
