import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

const baseURL = import.meta.env.VITE_API_URL;
const animatedComponents = makeAnimated();
import { setSchool } from "../../store/slices/studentSlice";

const UpdateSchool = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = React.useState([]);
  const [studentData, setStudentData] = React.useState();
  const [isMounted, setIsMounted] = useState(true);
  const { rowMeta } = props;
  // const { studentData, school } = useSelector((state) => state.students);
  const dispatch = useDispatch();
  const setUpdateSchool = (data) => dispatch(setSchool(data));

  let { value, studentId } = props;

  if (value === "programming") {
    value = { id: 1, name: "NG Programming" };
  }
  if (value?.length > 0) {
    if (typeof value === "string") {
      value = studentData?.school[0];
      // .map((x) => ({ value: x.id, label: x.label }));
    } else {
      value = value[0];
    }
  }

  const selectedValue = { value: value?.id, label: value?.name };

  useEffect(() => {
    axios
      .get(`${baseURL}school`)
      .then((response) => {
        // setData(response.data);
        if (isMounted) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
        // if (err.message === "canceled") return;
      });

    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const studentId = rowMeta.rowData[0];
    axios
      .get(`${baseURL}students/${studentId}`)
      .then((res) => {
        if (isMounted) {
          setStudentData(res.data.data[0]);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [props]);

  // only for students who have failed
  // const showDropdown = rowMeta.rowData[14] === "Test Failed";

  // let showDropdown =
  //   studentData?.student_school_stage !== null
  //     ? studentData?.student_school_stage?.stageName.toLowerCase() ===
  //       "test failed"
  //     : rowMeta.rowData[14] === "Test Failed";

  // useEffect(() => {
  //   showDropdown =
  //     studentData?.student_school_stage !== null
  //       ? studentData?.student_school_stage?.stageName.toLowerCase() ===
  //         "test failed"
  //       : rowMeta.rowData[14] === "Test Failed";
  // }, [studentData]);

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
        setUpdateSchool(label);
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
      url: `${baseURL}school/students_school`,
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
      value={selectedValue}
      onChange={handleChange}
      options={
        data.length
          ? // && showDropdown
            data.map((x) => ({ value: x.id, label: x.name })) // Either || x.value here
          : [selectedValue].map((x) => ({
              value: x.id, // Or || x.value here
              label: x.label,
            }))
      }
      isClearable={false}
      components={animatedComponents}
      closeMenuOnSelect
    />
  );
};

export default UpdateSchool;
