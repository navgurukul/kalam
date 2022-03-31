import { Card, Grid, Modal, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import React, { useEffect, useState } from "react";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import MainLayout from "./MainLayout";

const baseUrl = import.meta.env.VITE_API_URL;
function OwnerSchedule(props) {
  const { ScheduleOpen, setScheduleOpen } = props;
  const columns = [
    {
      name: "name",
      label: "name",
      options: {
        filter: false,
        sort: false,
        customBodyRender: React.useCallback(
          (value) => <p>{value.split("T")[0]}</p>,
          []
        ),
      },
    },
    {
      name: "phone",
      label: "Phone Number",
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
      label: "start time",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "end_time_expected",
      label: "end time",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "on_date",
      label: "date",
      options: {
        filter: true,
        sort: true,
        // eslint-disable-next-line react/no-unstable-nested-components
        customBodyRender: (value) => <p>{value.split("T")[0]}</p>,
      },
    },
    {
      name: "owner",
      label: "owner Name",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const [slotData, setSlotData] = useState([]);
  const [date, setDate] = useState(Date.now);
  const handleDateChange = (dater) => {
    //console.log(dater);
    setDate(dater);
    // let DateArray = typeof dater;
    const d = new Date(dater).split(" ");
    d[2] += ",";
    // eslint-disable-next-line no-use-before-define
    const DateToSend = [d[3], month[d[1]], d[2]].join("-").replace(",", "");
    fetch(`${baseUrl}/slot/interview/ondate/${DateToSend}`).then((res) => {
      res.json().then((data) => {
        const dataAdd = data.data.map((item) => ({
          ...item,
          on_date: item.on_date.split("T")[0],
          start_time: item.start_time,
          end_time_expected: item.end_time_expected,
          topic_name: item.topic_name,
          name: item.student.name,
          email: item.student.email,
          phone: item.contacts.mobile,
          owner: item.user.user_name,
        }));

        setSlotData(dataAdd);
      });
    });
    useEffect(() => {
      handleDateChange(date);
    }, []);
  };
  const month = {
    Jan: `01`,
    Feb: `02`,
    Mar: `03`,
    Apr: `04`,
    May: `05`,
    Jun: `06`,
    Jul: `07`,
    Aug: `08`,
    Sep: `09`,
    Oct: `10`,
    Nov: `11`,
    Dec: `12`,
  };
  return (
    <Modal
      open={ScheduleOpen}
      onClose={() => {
        setScheduleOpen(false);
      }}
      style={{
        height: "85%",
        marginTop: "1%",
        overflow: "scroll",
      }}
    >
      <Card>
        <h1>
          <center>Interview Schedule</center>
        </h1>
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <Grid container justify="space-around">
            <DatePicker
              margin="normal"
              id="date-picker-dialog"
              format="yyyy-MM-dd"
              value={date}
              onChange={(dates) => {
                handleDateChange(dates);
                //console.log(dates);
              }}
              inputVariant="outlined"
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </LocalizationProvider>
        <MainLayout title="Schedule" columns={columns} data={slotData} />
      </Card>
    </Modal>
  );
}

export default OwnerSchedule;
