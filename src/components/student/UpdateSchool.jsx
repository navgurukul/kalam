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
      .put(`${baseURL}school/students_school_post/${studentId}`, {
        school_id: value,
      })
      .then(() => {
        enqueueSnackbar(`School successfully updated !`, {
          variant: "success",
        });
        change(label);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  let { value, studentId } = props;
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
        console.log("JSON.stringify(response.data)");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (value === "programming") {
    value = { id: 1, name: "NG Programming" };
  }
  if (value.length > 0) {
    value = value[0];
  }
  const selectedValue = { value: value.id, label: value.name };

  console.log([selectedValue])
  return  (
    <Select
      className="filterSelectStage"
      defaultValue={selectedValue}
      onChange={handleChange}
      options={
        data.length && showDropdown ? data.map((x) => ({ value: x.id, label: x.name })) :
         [selectedValue].map((x) => ({ value: x.id, label: x.label }))
      }
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  )  
};

export default UpdateSchool;
