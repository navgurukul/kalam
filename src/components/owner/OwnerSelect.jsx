import React, { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const baseUrl = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const OwnerSelect = ({ value, change, rowMetaTable, studentId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { loggedInUser } = useSelector((state) => state.auth);
  const [ownerData, setOwnerData] = React.useState([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const dataURL = `${baseUrl}owner`;
      const response = await axios.get(dataURL, { signal: controller.signal });
      const { data } = response.data;
      const newData = data
        .filter((el) => el.available)
        .map((el) => ({
          value: el.user.user_name,
          label: el.user.user_name,
          available: el.available,
        }));
      setOwnerData(newData);
    })();
    return () => controller.abort();
  }, []);
  // console.log(ownerData);

  const handleChange = (selectedValue) => {
    try {
      const { rowData } = rowMetaTable;
      const whoAssign = loggedInUser.email;
      const stage = rowData[0];
      axios
        .post(`${baseUrl}students/assign_feedback_work`, {
          who_assign: whoAssign,
          to_assign: selectedValue.value,
          student_stage: stage,
          student_id: studentId,
        })
        .then(() => {
          change(selectedValue.value);
          enqueueSnackbar(`successfully Assigned work for ${value}`, {
            variant: "success",
          });
        });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };
  let selectedValue = { value: null, label: null };

  if (value) {
    selectedValue = { value, label: value };
  }

  return (
    <Select
      className="filterSelectStage"
      value={selectedValue}
      onChange={handleChange}
      options={ownerData}
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default OwnerSelect;
