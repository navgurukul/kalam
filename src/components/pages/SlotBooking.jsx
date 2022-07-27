import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { StaticDatePicker } from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useSnackbar } from "notistack";
import { allStages } from "../../utils/constants";
import Loader from "../ui/Loader";

const baseUrl = import.meta.env.VITE_API_URL;
const SlotBooking = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { studentId } = useParams();

  const defaultTimings = [
    {
      id: 1,
      from: "9:00",
      to: "10:00",
    },
    {
      id: 2,
      from: "10:00",
      to: "11:00",
    },
    {
      id: 3,
      from: "11:00",
      to: "12:00",
    },
    {
      id: 7,
      from: "12:00",
      to: "13:00",
    },
    {
      id: 4,
      from: "13:00",
      to: "14:00",
    },
    {
      id: 5,
      from: "14:00",
      to: "15:00",
    },
    {
      id: 6,
      from: "15:00",
      to: "16:00",
    },
  ];

  const [loading, setLoading] = React.useState(true);
  const [slot, setSlot] = React.useState({
    from: "",
    to: "",
    id: null,
    is_cancelled: true,
  });
  const [date, setDate] = React.useState(new Date());
  const [studentData, setStudentData] = React.useState({});
  const [timings, setTimings] = React.useState(defaultTimings);

  const handleDateChange = (newDate) => {
    //console.log(dater);
    const d = dayjs(newDate);
    const DateToSend = d.format("YYYY-MM-DD");
    setDate(DateToSend);
    axios
      .get(`${baseUrl}/slot/interview/check/ondate/${DateToSend}/1`)
      .then(({ data }) => {
        if (data.data.length) {
          const filteredTimings = dayjs().isSame(d, "day")
            ? data.data.filter(
                (time) =>
                  time.availiblity &&
                  dayjs().isBefore(dayjs(time.from, "HH:MM"), "hour")
              )
            : data.data.filter((time) => time.availiblity);
          setTimings(filteredTimings);
        } else setTimings(defaultTimings);
      });
  };

  useEffect(() => {
    (async () => {
      const slotData = await axios.get(`${baseUrl}slot/interview/${studentId}`);
      if (slotData.data?.data?.length) {
        setSlot(slotData.data?.data[0] || "");
        // setSlotCancelled(slotData.data[0]?.data?.is_cancelled || true);
      }
      const studentRes = await axios.get(`${baseUrl}/students/${studentId}`);
      if (studentRes.data?.data?.length) {
        const { name, stage, lastTransition } = studentRes.data?.data[0] || {
          name: null,
          stage: null,
          lastTransition: { id: null },
        };
        setStudentData({
          name,
          stage: allStages[stage],
          transitionID: lastTransition.id,
        });
        handleDateChange(date);
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteSlot = () => {
    axios
      .delete(`${baseUrl}slot/interview/stundet/${slot.id}`)
      .then(({ data }) => {
        if (data.message === "Successfully inserted slot deleted") {
          enqueueSnackbar("Slot Cancelled", {
            variant: "info",
          });
          handleDateChange(date);
          // setSlotCancelled(true);
          setSlot({ is_cancelled: true });
        } else {
          enqueueSnackbar("Slot Not Cancelled", {
            variant: "error",
          });
        }
      });
  };

  const handleSlotBooking = () => {
    const { from, to } = slot;
    fetch(`${baseUrl}slot/interview/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        student_name: studentData.name,
        topic_name: studentData.stage,
        transition_id: studentData.transitionID,
        start_time: from,
        end_time_expected: to,
        duration: "1hr",
        on_date: date,
      }),
    }).then((res) => {
      res
        .json()
        .then((data) => {
          //console.log(data);
          if (data.status === "successfully_scheduled") {
            enqueueSnackbar("Slot Booked", {
              variant: "success",
            });
            fetch(`${baseUrl}/slot/interview/${studentId}`).then((_res) => {
              _res.json().then((_data) => {
                setSlot(_data.data[0]);
                // setSlotCancelled(_data.data[0].is_cancelled);
              });
              fetch(`${baseUrl}/slot/interview/${studentId}`).then(
                (interviewRes) => {
                  interviewRes.json().then((iData) => {
                    setSlot(iData.data[0]);
                    // setSlotCancelled(iData.data[0].is_cancelled);
                  });
                }
              );
            });
          } else {
            enqueueSnackbar("Cannot Book Slot", {
              variant: "error",
            });
          }
        })
        .catch(() => {
          enqueueSnackbar("Couldn't Book Slot!", { variant: "error" });
        });
    });
  };
  function disablePrevDates() {
    const yesterday = new Date(Date.now() - 86400000);
    const startSeconds = Date.parse(yesterday);
    return (_date) => Date.parse(_date) < startSeconds;
  }

  return loading ? (
    <Loader />
  ) : [
      "English Interview Pending (2nd Round)",
      "Culture Fit Interview Pending (4th Round)",
      "Pending Culture Fit Re-Interview",
    ].includes(studentData.stage) ? (
    <Container
      maxWidth="md"
      sx={{
        // position: "absolute",
        // top: "50%",
        // left: "50%",
        // maxWidth: "500px",
        // minWidth: "200px",
        // transform: "translate(-50%, -50%)",
        bgcolor: "background.paper  ",
        // border: "1px solid #000",
        p: 4,
      }}
    >
      {slot.is_cancelled ? (
        <>
          <Typography variant="h5" fontWeight="medium">
            Book Interview Slot
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Book Interview Slot {studentData.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: "1.2rem",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                margin="normal"
                id="date-picker-dialog"
                format="yyyy-MM-dd"
                value={date}
                onChange={(dates) => {
                  handleDateChange(dates);
                }}
                shouldDisableDate={disablePrevDates()}
                inputVariant="outlined"
                fullWidth
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {timings.length > 0 ? (
              <Grid container justifyContent="center" spacing={2}>
                {timings.map(({ id, from, to }) => (
                  <Grid item key={id} sm={6} md={4}>
                    <Button
                      color="primary"
                      fullWidth
                      variant={slot.id === id ? "contained" : "outlined"}
                      sx={{
                        padding: "8px",
                        fontSize: "14px",
                        fontWeight: slot.id !== id && "600",
                        border: slot.id !== id && "2px solid",
                      }}
                      onClick={() => {
                        setSlot({ id, from, to, is_cancelled: true });
                        // setStartTime(item.from);
                        // setEndTime(item.to);
                        // setCurrentTimeId(item.id);
                      }}
                    >
                      {dayjs(from, "HH").format("h:mm a")} -{" "}
                      {dayjs(to, "HH").format("h:mm a")}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6" textAlign="center">
                No Slots Available on {dayjs(date).format("MMM D, YYYY")}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            disabled={timings.length === 0 || !slot.id}
            onClick={() => {
              handleSlotBooking();
              // setCurrentTimeId(null);
            }}
          >
            Book Slot
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight="medium">
            Interview Slot Booked
          </Typography>
          <Typography variant="h5" fontWeight="medium" sx={{ mt: 2 }}>
            Slot Details
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }} fontWeight="normal">
            <span style={{ fontWeight: "500" }}>Student Name:</span>{" "}
            {slot.student_name}
          </Typography>
          <Typography variant="h6" fontWeight="normal">
            <span style={{ fontWeight: "500" }}>Topic:</span> {slot.topic_name}
          </Typography>
          <Typography variant="h6" fontWeight="normal">
            <span style={{ fontWeight: "500" }}>On:</span>{" "}
            {dayjs(slot.on_date).format("D MMM YYYY") || ""}
          </Typography>
          <Typography variant="h6" fontWeight="normal">
            <span style={{ fontWeight: "500" }}>From</span>{" "}
            {dayjs(slot.start_time, "HH").format("h:mm a")}{" "}
            <span style={{ fontWeight: "500" }}>To</span>{" "}
            {dayjs(slot.end_time_expected, "HH").format("h:mm a")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            // style={{ fontSize: "10px" }}
            sx={{ mt: 3 }}
            onClick={() => {
              handleDeleteSlot();
              // setCurrentTimeId(null);
            }}
          >
            Delete Slot
          </Button>
        </>
      )}
    </Container>
  ) : (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      <Typography color="primary" variant="h2" style={{ marginTop: "0.4rem" }}>
        You cannot book slot
      </Typography>
    </Box>
  );
};

export default SlotBooking;
