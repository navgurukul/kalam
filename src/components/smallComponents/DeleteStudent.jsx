import React from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { setStudentData } from "../../store/slices/studentSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteStudent = ({ studentId, studentName }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { studentData, totalData } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const setStudents = (data) => dispatch(setStudentData(data));

  const handleDelete = (deleteStudentId) => {
    //confirm whether to delete
    if (
      window.confirm(`Are you sure you want to delete student ${studentName}?`)
    ) {
      axios
        .delete(`${baseUrl}students/${deleteStudentId}`)
        .then(() => {
          enqueueSnackbar(`Student ${studentName} deleted successfully`, {
            variant: "success",
          });
          const newStudentData = studentData.filter(
            (student) => student.id !== deleteStudentId
          );
          setStudents({
            data: newStudentData,
            totalData: totalData - 1,
          });
        })
        .catch(() => {
          enqueueSnackbar("Error deleting student", {
            variant: "error",
          });
        });
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
      <DeleteIcon
        style={{
          color: "red",
          cursor: "pointer",
        }}
        onClick={() => handleDelete(studentId)}
      />
    </div>
  );
};

export default DeleteStudent;
