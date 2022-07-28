import React, { useEffect, useState } from "react";
import { Card, Modal, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { Box } from "@mui/system";
import MainLayout from "../muiTables/MainLayout";

const baseUrl = import.meta.env.VITE_API_URL;
function OwnerSchedule(props) {
  const { scheduleOpen, setScheduleOpen } = props;
  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "phone",
      label: "Phone No.",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "start_time",
      label: "Start Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => dayjs(value, "hh:mm").format("hh:mm A"),
      },
    },
    {
      name: "end_time_expected",
      label: "Expected End Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => dayjs(value, "hh:mm").format("hh:mm A"),
      },
    },
    {
      name: "on_date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => dayjs(value).format("D MMM YYYY"),
      },
    },
    {
      name: "owner",
      label: "Owner Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "topic_name",
      label: "Topic Name",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const [slotData, setSlotData] = useState([]);
  const [date, setDate] = useState(Date.now);

  const handleDateChange = (newDate) => {
    const d = dayjs(newDate);
    if (!d.isValid()) return;
    const DateToSend = d.format("YYYY-MM-DD");
    axios
      .get(`${baseUrl}/slot/interview/ondate/${DateToSend}`)
      .then(({ data }) => {
        const newSlotData = data.data.map((item) => ({
          ...item,
          name: item.student.name,
          email: item.student.email,
          phone: item.contacts.mobile,
          owner: item.user?.user_name || "",
        }));
        setDate(DateToSend);
        setSlotData(newSlotData);
      });
  };

  useEffect(() => {
    handleDateChange(date);
  }, []);

  return (
    <Modal
      open={scheduleOpen}
      onClose={() => setScheduleOpen(false)}
      sx={{
        height: "85%",
        marginTop: "1.4rem",
        width: "99%",
        mx: "1.2rem",
        overflow: "scroll",
      }}
    >
      <Card sx={{ py: "1.2rem", px: "0.8rem" }}>
        <Typography variant="h3" textAlign="center" fontWeight="medium">
          Interview Schedule
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                margin="normal"
                format="YYYY-MM-DD"
                value={date}
                onChange={(newDate) => handleDateChange(newDate)}
                inputVariant="outlined"
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <MainLayout title="Schedule" columns={columns} data={slotData} />
        </Box>
      </Card>
    </Modal>
  );
}

export default OwnerSchedule;
