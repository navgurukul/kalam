import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { allStages } from "../../utils/constants";
import {
  setSelectedStudent,
  setStudentData,
} from "../../store/slices/studentSlice";

const baseUrl = import.meta.env.VITE_API_URL;

const DeleteRow = ({ transitionId }) => {
  const snackbar = useSnackbar();
  const { selectedStudent, studentData, totalData } = useSelector(
    (state) => state.students
  );
  const { studentId, transitions } = selectedStudent;
  const dispatch = useDispatch();
  const setTransitions = (newTransitions) =>
    dispatch(setSelectedStudent({ studentId, transitions: newTransitions }));
  const setStudents = (newStudentsData) =>
    dispatch(setStudentData({ data: newStudentsData, totalData }));
  const deleteTransition = async () => {
    const newTransitions = [...transitions];
    const lastStage = newTransitions.pop();
    const selectedStudentInx = studentData.findIndex(
      (studentItem) => studentItem.id === studentId
    );
    const selectedStudentData = { ...studentData[selectedStudentInx] };
    selectedStudentData.stage = allStages[lastStage.from_stage];
    const newStudentData = [...studentData];
    newStudentData[selectedStudentInx] = selectedStudentData;

    try {
      await axios.delete(`${baseUrl}students/transition/${transitionId}`);
      setTransitions(newTransitions);
      setStudents(newStudentData);
      snackbar.enqueueSnackbar("Transition is successfully Deleted!", {
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      snackbar.enqueueSnackbar("An Error Occured!", {
        variant: "error",
      });
    }
  };
  return (
    <IconButton
      // m={1}
      onClick={deleteTransition}
      color="primary"
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteRow;
