/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { Box } from "@mui/system";
import MainLayout from "../muiTables/MainLayout";

const baseUrl = import.meta.env.VITE_API_URL;

const renderTime = (value) => dayjs(value, "hh:mm").format("hh:mm A");
const renderDate = (value) => dayjs(value).format("D MMM YYYY");
const renderMeetLink = (value) =>
  value?.trim() ? (
    <a href={value} target="_blank" rel="noopener noreferrer">
      Join Meet
    </a>
  ) : (
    "—"
  );

function OwnerSchedule(props) {
  const { scheduleOpen, setScheduleOpen } = props;
  const [slotData, setSlotData] = useState([]);
  const [date, setDate] = useState(new Date());

  const handleDateChange = useCallback((newDate) => {
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
          meet_link: item.meet_link || " ",
          meet_link_status: item.meet_link_status,
          meet_call_status:
            item.meet_link_status === true
              ? "Present"
              : item.meet_link_status === false
              ? "Absent"
              : "",
          result_status:
            item.result_status === true
              ? "Pass"
              : item.result_status === false
              ? "Fail"
              : "",
        }));

        setDate(DateToSend);
        setSlotData(newSlotData);
      });
  }, []);

  const handleResultChange = async (index, resultStatus) => {
    const selectedSlot = slotData[index].id;
    const meet_call_status = slotData[index].meet_call_status;

    const meet_link_status = meet_call_status === "Present";
    const pass = resultStatus === "Pass";

    try {
      await axios.put(
        `${baseUrl}/slot/interview/updateMeetStatus/${selectedSlot}`,
        {
          meet_link_status,
          pass,
        }
      );

      const updatedData = [...slotData];
      updatedData[index].result_status = resultStatus;
      setSlotData(updatedData);
    } catch (error) {
      console.error("Error updating both statuses:", error);
      alert("Failed to update interview status. Please try again.");
    }
  };

  const handleStatusChange = async (index, status) => {
    const selectedSlot = slotData[index].id;
    const meet_link_status = status === "Present";

    try {
      if (status === "Absent") {
        await axios.put(
          `${baseUrl}/slot/interview/updateMeetStatus/${selectedSlot}`,
          {
            meet_link_status,
          }
        );
      }

      const updatedData = [...slotData];
      updatedData[index].meet_call_status = status;
      updatedData[index].meet_link_status = meet_link_status;
      setSlotData(updatedData);
    } catch (error) {
      console.error("Error updating meet call status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const renderMeetStatusSelect = useCallback(
    (dataIndex) => {
      const value = slotData[dataIndex]?.meet_call_status;

      return (
        <Select
          value={value !== undefined ? value : ""}
          onChange={(e) => handleStatusChange(dataIndex, e.target.value)}
          size="small"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return "Select";
            }
            return selected;
          }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Present">Present</MenuItem>
          <MenuItem value="Absent">Absent</MenuItem>
        </Select>
      );
    },
    [slotData]
  );

  const renderResultSelect = useCallback(
    (dataIndex) => {
      const status = slotData[dataIndex]?.meet_call_status;
      if (status !== "Present") return "—";

      const value = slotData[dataIndex]?.result_status || "";

      return (
        <Select
          value={value}
          onChange={(e) => handleResultChange(dataIndex, e.target.value)}
          displayEmpty
          size="small"
          renderValue={(selected) => {
            if (selected === "") {
              return "Select";
            }
            return selected;
          }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Pass">Pass</MenuItem>
          <MenuItem value="Fail">Fail</MenuItem>
        </Select>
      );
    },
    [slotData]
  );

  const columns = [
    { name: "name", label: "Name", options: { filter: false, sort: false } },
    {
      name: "phone",
      label: "Phone No.",
      options: { filter: false, sort: false },
    },
    { name: "email", label: "Email", options: { filter: false, sort: false } },
    {
      name: "start_time",
      label: "Start Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: renderTime,
      },
    },
    {
      name: "end_time_expected",
      label: "Expected End Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: renderTime,
      },
    },
    {
      name: "on_date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: renderDate,
      },
    },
    {
      name: "owner",
      label: "Owner Name",
      options: { filter: true, sort: true },
    },
    {
      name: "topic_name",
      label: "Topic Name",
      options: { filter: true, sort: true },
    },
    {
      name: "meet_link",
      label: "Meet Link",
      options: {
        filter: true,
        sort: true,
        customBodyRender: renderMeetLink,
      },
    },
    {
      name: "meet_call_status",
      label: "Meet Call Status",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: renderMeetStatusSelect,
      },
    },
    {
      name: "result_status",
      label: "Result",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: renderResultSelect,
      },
    },
  ];

  useEffect(() => {
    handleDateChange(date);
  }, [handleDateChange]);

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
                format="MM/dd/yyyy"
                value={dayjs(date)}
                onChange={(newDate) => handleDateChange(newDate)}
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
