import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { FormControl, InputLabel, Select as MUISelect, MenuItem } from "@mui/material";
import { setSchool } from "../../store/slices/studentSlice";

const baseURL = import.meta.env.VITE_API_URL;

const UpdateSchool = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [studentData, setStudentData] = useState();
  const [isMounted, setIsMounted] = useState(true);
  const { rowMeta } = props;
  const dispatch = useDispatch();
  const setUpdateSchool = (data) => dispatch(setSchool(data));

  let { value, studentId } = props;

  if (value === "programming") {
    value = { id: 1, name: "NG Programming" };
  }
  if (value?.length > 0) {
    if (typeof value === "string") {
      value = studentData?.school[0];
    } else {
      value = value[0];
    }
  }

  const selectedValue = value?.id || "";

  useEffect(() => {
    axios
      .get(`${baseURL}school`)
      .then((response) => {
        if (isMounted) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
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

  const handleChange = (e) => {
    const { change, studentId } = props;
    const selectedId = e.target.value;
    const selectedOption = data.find((item) => item.id === selectedId);
    if (!selectedOption) return;

    axios
      .post(`${baseURL}school/students_school`, {
        student_id: studentId,
        school_id: selectedId,
      })
      .then(() => {
        enqueueSnackbar(`School successfully updated !`, {
          variant: "success",
        });
        setUpdateSchool(selectedOption.name);
        change(selectedOption.name);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

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
    <FormControl fullWidth size="small">
      <InputLabel>Select School</InputLabel>
      <MUISelect
        value={selectedValue}
        onChange={handleChange}
        label="Select School"
      >
        {data.map((school) => (
          <MenuItem key={school.id} value={school.id}>
            {school.name}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
};

export default UpdateSchool;