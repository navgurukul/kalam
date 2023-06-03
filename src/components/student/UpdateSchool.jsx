import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();

const UpdateSchool = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);
  const { rowMeta } = props;

  let { value, studentId } = props;

  if (value === "programming") {
    value = { id: 1, name: "NG Programming" };
  }
  if (value.length > 0) {
    value = value[0];
  }

  const selectedValue = { value: value.id, label: value.name };

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${baseURL}school`, { signal: controller.signal })
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        // if (err.message === "canceled") return;
      });
    return () => controller.abort();
  }, []);

  // only for students who have failed
  const showDropdown = rowMeta.rowData[14] === "Test Failed";

  const handleChange = (event) => {
    const { change, studentId } = props;
    const { label, value } = event;
    axios
      .post(`${baseURL}school/students_school`, {
        student_id: studentId,
        school_id: value,
      })
      .then((response) => {
        enqueueSnackbar(`School successfully updated !`, {
          variant: "success",
        });
        change(label);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  // remove this after words
  if (value === "programming") {
    const data = JSON.stringify({
      student_id: studentId,
      school_id: 1,
    });

    const config = {
      method: "post",
      url: "https://dev-join.navgurukul.org/apiDocs/school/students_school",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };
    axios(config)
      .then((response) => {
        console.log("JSON.stringify(response.data)", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Select
      className="filterSelectStage"
      defaultValue={selectedValue}
      onChange={handleChange}
      options={
        data.length && showDropdown
          ? data.map((x) => ({ value: x.id, label: x.name }))
          : [selectedValue].map((x) => ({ value: x.id, label: x.label }))
      }
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdateSchool;
