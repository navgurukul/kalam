/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSnackbar } from "notistack";
import { allStages } from "../../utils/constants";
import Loader from "../ui/Loader";
import { initGoogleAPI, createMeetLink } from "../../utils/googleMeet";
import { deleteEventInTimeSlot } from "../../utils/googleMeet";

const baseUrl = import.meta.env.VITE_API_URL;

const SlotBooking = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { studentId } = useParams();

  const defaultTimings = [
    { id: 1, from: "9:00", to: "10:00" },
    { id: 2, from: "10:00", to: "11:00" },
    { id: 3, from: "11:00", to: "12:00" },
    { id: 4, from: "12:00", to: "13:00" },
    { id: 5, from: "13:00", to: "14:00" },
    { id: 6, from: "14:00", to: "15:00" },
  ];

  const [loading, setLoading] = useState(true);
  const [slot, setSlot] = useState({
    from: "",
    to: "",
    id: null,
    is_cancelled: true,
  });
  const [date, setDate] = useState(dayjs());
  const [studentData, setStudentData] = useState({});
  const [timings, setTimings] = useState(defaultTimings);
  const allowedSlotBookingDays = 15;

  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setDate(dayjs(newDate));

    axios
      .get(`${baseUrl}/slot/interview/check/ondate/${formattedDate}/1`)
      .then(({ data }) => {
        if (data.data.length) {
          const filteredTimings = dayjs().isSame(newDate, "day")
            ? data.data.filter(
                (time) =>
                  time.availiblity &&
                  dayjs(`${formattedDate} ${time.from}`).isAfter(dayjs())
              )
            : data.data.filter((time) => time.availiblity);
          setTimings(filteredTimings);
        } else {
          setTimings(defaultTimings);
        }
      });
  };

  const fetchSlot = async () => {
    const res = await axios.get(`${baseUrl}slot/interview/${studentId}`);
    return res.data?.data?.[0] ?? null;
  };

  const fetchStudent = async () => {
    const res = await axios.get(`${baseUrl}/students/${studentId}`);
    return res.data?.data?.[0] ?? null;
  };

  useEffect(() => {
    const updateStudentStage = async (newStage) => {
      try {
        await axios.patch(`${baseUrl}/students/stage/${studentId}`, {
          stage: newStage,
        });
      } catch (err) {
        console.error("Failed to update student stage:", err);
        enqueueSnackbar("Stage update failed", { variant: "warning" });
      }
    };

    (async () => {
      const slotData = await fetchSlot();
      if (slotData) setSlot(slotData);

      const student = await fetchStudent();
      if (student) {
        const { name, stage, lastTransition } = student;
        setStudentData({
          name,
          stage: allStages[stage],
          transitionID: lastTransition?.id,
        });
        handleDateChange(date);
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteSlot = async () => {
    if (!slot?.on_date || !slot?.start_time || !slot?.end_time_expected) {
      enqueueSnackbar("Slot timing is invalid. Cannot delete meet event.", {
        variant: "error",
      });
      return;
    }

    try {
      const dateObj = dayjs(slot.on_date);
      const [startHour, startMin] = slot.start_time.split(":");
      const [endHour, endMin] = slot.end_time_expected.split(":");

      const startTimeISO = dateObj
        .hour(startHour)
        .minute(startMin)
        .second(0)
        .toISOString();
      const endTimeISO = dateObj
        .hour(endHour)
        .minute(endMin)
        .second(0)
        .toISOString();

      console.log("Deleting event for:", { startTimeISO, endTimeISO });

      await initGoogleAPI();
      await deleteEventInTimeSlot(startTimeISO, endTimeISO);

      const { data } = await axios.delete(
        `${baseUrl}slot/interview/stundet/${slot.id}`
      );
      if (data.message === "Successfully inserted slot deleted") {
        enqueueSnackbar("Slot Cancelled & Meet Removed", { variant: "info" });
        handleDateChange(date);
        setSlot({ is_cancelled: true });
      } else {
        enqueueSnackbar("Slot Not Cancelled", { variant: "error" });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Error deleting slot or meet", { variant: "error" });
    }
  };

  const handleSlotBooking = async () => {
    const { from, to } = slot;
    const startDateTime = dayjs(
      `${date.format("YYYY-MM-DD")} ${from}`
    ).toISOString();
    const endDateTime = dayjs(
      `${date.format("YYYY-MM-DD")} ${to}`
    ).toISOString();

    try {
      await initGoogleAPI();
      const meetLink = await createMeetLink(
        startDateTime,
        endDateTime,
        "admissionteam@navgurukul.org"
      );

      const response = await axios.post(`${baseUrl}slot/interview/student`, {
        student_id: studentId,
        student_name: studentData.name,
        topic_name: studentData.stage,
        transition_id: studentData.transitionID,
        start_time: from,
        end_time_expected: to,
        duration: "1hr",
        on_date: date.format("YYYY-MM-DD"),
        meet_link: meetLink,
      });

      console.log("Booking Response:", response.data);

      if (response.data.status === "successfully_scheduled") {
        const slotData = await fetchSlot();
        if (slotData) setSlot(slotData);
        enqueueSnackbar("Slot Booked & Meet Scheduled", {
          variant: "success",
        });
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to schedule meet or book slot", {
        variant: "error",
      });
    }
  };

  if (loading) return <Loader />;

  const canBookSlot = [
    "Screening Test Pass",
    "Learning Round Pass",
    "Pending Culture Fit Re-Interview",
  ].includes(studentData.stage);

  if (!canBookSlot) {
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="h4" color="primary">
          You cannot book slot
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ bgcolor: "background.paper", p: 4 }}>
      {slot.is_cancelled ? (
        <>
          <Typography variant="h5">Book Interview Slot</Typography>
          <Typography variant="h6" mt={2}>
            Book Interview Slot for {studentData.name}
          </Typography>

          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                value={date}
                onChange={handleDateChange}
                shouldDisableDate={(d) =>
                  d.isAfter(dayjs().add(allowedSlotBookingDays, "day"))
                }
                disablePast
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            {timings.length > 0 ? (
              <Grid container spacing={2} justifyContent="center" mt={2}>
                {timings.map(({ id, from, to }) => (
                  <Grid item key={id} sm={6} md={4}>
                    <Button
                      fullWidth
                      variant={slot.id === id ? "contained" : "outlined"}
                      onClick={() =>
                        setSlot({ id, from, to, is_cancelled: true })
                      }
                    >
                      {dayjs(from, "HH").format("h:mm A")} -{" "}
                      {dayjs(to, "HH").format("h:mm A")}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" textAlign="center" mt={2}>
                No Slots Available on {date.format("MMM D, YYYY")}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            disabled={!slot.id || timings.length === 0}
            onClick={handleSlotBooking}
          >
            Book Slot
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4">Interview Slot Booked</Typography>
          <Typography variant="h5" mt={2}>
            Slot Details
          </Typography>
          <Typography variant="h6" mt={1}>
            <strong>Student Name:</strong> {slot.student_name}
          </Typography>
          <Typography variant="h6">
            <strong>Topic:</strong> {slot.topic_name}
          </Typography>
          <Typography variant="h6">
            <strong>On:</strong> {dayjs(slot.on_date).format("D MMM YYYY")}
          </Typography>
          <Typography variant="h6">
            <strong>From:</strong>{" "}
            {dayjs(slot.start_time, "HH").format("h:mm A")} <strong>To:</strong>{" "}
            {dayjs(slot.end_time_expected, "HH").format("h:mm A")}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleDeleteSlot}
          >
            Delete Slot
          </Button>
        </>
      )}
    </Container>
  );
};

export default SlotBooking;
