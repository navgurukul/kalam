import React from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { setStudentData } from "../../store/slices/studentSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteStudent = (props) => {
  const { studentId } = props;

  const { studentData, totalData } = useSelector((state) => state.students);

  const dispatch = useDispatch();

  const setStudents = (data) => dispatch(setStudentData(data));

  // eslint-disable-next-line no-shadow
  const handleDelete = (studentId) => {
    //confirm whether to delete
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`${baseUrl}students/${studentId}`)
        .then(() => {
          const newStudentData = studentData.filter(
            (student) => student.id !== studentId
          );
          setStudents({
            data: newStudentData,
            totalData: totalData - 1,
          });
        })
        .catch(() => {});
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DeleteIcon onClick={() => handleDelete(studentId)} />
    </div>
  );
};

export default DeleteStudent;
