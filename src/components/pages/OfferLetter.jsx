import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, TextField, MenuItem, Button, Box, Typography, Checkbox, CircularProgress,
  Snackbar, Alert
} from "@mui/material";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const stageOptions = [
  { value: "selectedAndJoiningAwaited", label: "Culture fit round Pass" },
  { value: "offerLetterSent", label: "Offer Letter Sent" },
];

const OfferLetterTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkStage, setBulkStage] = useState("");
  const [page, setPage] = useState(0);
  const [numberOfRows] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const [selectedCampus, setSelectedCampus] = useState("");
  const [campusOptions, setCampusOptions] = useState([]);

const fetchStudents = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`${baseURL}students`, {
      params: {
        limit: numberOfRows,
        page,
        stage: "selectedAndJoiningAwaited",
      },
    });

    const results = response?.data?.data?.results || [];
    const total = response?.data?.data?.count || 0;

    const formatted = results.map((student) => ({
      id: student.id,
      profileImage: student.image_url || "https://i.pravatar.cc/40?img=1",
      email: student.email || "",
      name_of_school_en: student.school?.[0]?.name || "—",
      name_of_campus_en: student.campus || "—",
      name: student.name || "—",
      stage: student.stage || "—",
      subject: "NavGurukul - Your Admission Letter",
      phone: student.contacts?.[0]?.mobile || "—",
    }));

    const uniqueCampuses = [...new Set(formatted.map(s => s.name_of_campus_en))].filter(c => c && c !== "—");
    setCampusOptions(uniqueCampuses);

    setStudents(formatted);
    setTotalCount(total);
  } catch (error) {
    console.error("Failed to fetch students:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleCheckboxChange = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStageChange = async (index, newStage) => {
    const updatedStudents = [...students];
    const student = updatedStudents[index];
    const studentId = student.id;

    updatedStudents[index].stage = newStage;
    setStudents(updatedStudents);

    try {
      await axios.post(`${baseURL}students/changeStage/${studentId}`, {
        stage: newStage,
      });

      if (newStage === "offerLetterSent") {
        const payload = {
          students: [{
            name: student.name,
            email: student.email,
            name_of_campus_en: student.name_of_campus_en,
            name_of_school_en: student.name_of_school_en,
            name_of_school_hi: "स्कूल प्रवेश प्रोग्रामिंग",
            subject: student.subject,
          }],
        };

        await axios.post(`${baseURL}student/sendOfferLetterViaEmail`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        setSnackbarMsg(`Offer letter sent to ${student.name}`);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Failed to update stage or send email:", err);
    }
  };

  const handleBulkStageChange = async () => {
    if (!bulkStage || selectedStudentIds.length === 0) return;

    const updated = [...students];
    const emailStudents = [];

    await Promise.all(selectedStudentIds.map(async (id) => {
      try {
        await axios.post(`${baseURL}students/changeStage/${id}`, { stage: bulkStage });

        const index = updated.findIndex((s) => s.id === id);
        if (index !== -1) {
          updated[index].stage = bulkStage;

          if (bulkStage === "offerLetterSent") {
            emailStudents.push({
              name: updated[index].name,
              email: updated[index].email,
              name_of_campus_en: updated[index].name_of_campus_en,
              name_of_school_en: updated[index].name_of_school_en,
              name_of_school_hi: "स्कूल ऑफ प्रोग्रामिंग",
              subject: updated[index].subject,
            });
          }
        }
      } catch (err) {
        console.error(`Failed to update stage for student ${id}`, err);
      }
    }));

    setStudents(updated);
    setSelectedStudentIds([]);
    setBulkStage("");

    if (bulkStage === "offerLetterSent" && emailStudents.length > 0) {
      try {
        await axios.post(`${baseURL}student/sendOfferLetterViaEmail`, { students: emailStudents }, {
          headers: { "Content-Type": "application/json" },
        });

        setSnackbarMsg(`Offer letters sent to ${emailStudents.length} student(s)`);
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Failed to send bulk offer letter email:", err);
      }
    }
  };

  const handleNext = () => {
    if ((page + 1) * numberOfRows < totalCount) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const displayedStudents = selectedCampus
    ? students.filter(s => s.name_of_campus_en === selectedCampus)
    : students;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={3} mt={2}>
        <TextField
          select
          size="small"
          label="Filter by Campus"
          value={selectedCampus}
          onChange={(e) => setSelectedCampus(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Campuses</MenuItem>
          {campusOptions.map((campus) => (
            <MenuItem key={campus} value={campus}>
              {campus}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Bulk Stage Change"
          value={bulkStage}
          onChange={(e) => setBulkStage(e.target.value)}
          sx={{ minWidth: 250 }}
        >
          {stageOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          onClick={handleBulkStageChange}
          disabled={!bulkStage || selectedStudentIds.length === 0}
        >
          Update Selected
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Campus</TableCell>
              <TableCell>Stage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={24} />
                  <Typography variant="body2" mt={1}>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Avatar src={student.profileImage} alt={student.name} />
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.name_of_school_en}</TableCell>
                  <TableCell>{student.name_of_campus_en}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      value={student.stage}
                      size="small"
                      fullWidth
                      disabled={student.name_of_campus_en === "—"}
                      onChange={(e) => handleStageChange(index, e.target.value)}
                    >
                      {stageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="outlined" disabled={page === 0} onClick={handlePrev}>
          Previous
        </Button>
        <Typography>Page {page + 1}</Typography>
        <Button
          variant="outlined"
          disabled={(page + 1) * numberOfRows >= totalCount}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfferLetterTable;
