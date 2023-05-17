import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdateCampus = ({ change, studentId, value }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { loggedInUser, roles } = useSelector((state) => state.auth);
  const [campusList, setCampusList] = React.useState([]);

  const fetchCampus = async () => {
    try {
      const adminRole = roles.findIndex(
        (roleItem) => roleItem.role === "Admin"
      );
      const role = roles.find((roleItem) => roleItem.role === "Campus");
      const access = role?.access?.map((accessItem) => accessItem.access) || [];
      const dataURL = `${baseURL}campus`;
      const response = await axios.get(dataURL);
      // console.log(response.data.data, "response");
      const campus = response.data.data;
      setCampusList(
        adminRole !== -1
          ? [...campus, { campus: "All" }]
          : [...campus.filter((campusItem) => access.includes(campusItem.id))]
      );
    } catch (e) {
      // console.error(e);
    }
  };
  useEffect(() => {
    (async () => {
      // await fetchAccess();
      await fetchCampus();
    })();
  }, [loggedInUser]);

  const handleChange = (event) => {
    axios
      // eslint-disable-next-line camelcase
      .put(`${baseURL}students/${studentId}`, { campus: event.value })
      .then(() => {
        enqueueSnackbar(`Campus successfully updated !`, {
          variant: "success",
        });
        change(event.value);
      })
      .catch(() =>
        enqueueSnackbar(`Error in updating Campus`, {
          variant: "error",
        })
      );
  };

  const selectedValue = { value, label: value };

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={[...campusList, { name: "No Campus Assigned" }].map((x) => ({
        value: x.campus,
        label: x.campus,
      }))}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdateCampus;
