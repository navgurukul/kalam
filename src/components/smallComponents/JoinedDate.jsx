import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import axios from "axios";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { IconButton, TextField } from "@mui/material";

dayjs.extend(customParseFormat);

const baseURL = import.meta.env.VITE_API_URL;

const JoinedDate = ({ value, transitionId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(value);

  const toggleShowDatePicker = () => setShowDatePicker((prev) => !prev);

  const changeDate = (date) => {
    const formateddate = dayjs(date).format("YYYY-MM-DD");
    axios
      .put(`${baseURL}students/transition/${transitionId}`, {
        when: formateddate,
      })
      .then(() => {
        enqueueSnackbar(`Joining successfully updated !`, {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(`Something went wrong`, {
          variant: "error",
        });
      });
    setCurrentDate(date);
    toggleShowDatePicker();
  };

  if (showDatePicker) {
    return (
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <DatePicker
          margin="dense"
          style={{ marginLeft: 16 }}
          value={currentDate}
          id="date-picker-dialog"
          label="Joining Date"
          format="MM/dd/yyyy"
          onChange={changeDate}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    );
  }
  return (
    <>
      <p style={{ marginRight: 10 }}>
        {dayjs(currentDate).format("D MMM YYYY")}
      </p>
      <IconButton onClick={showDatePicker}>
        <EditIcon />
      </IconButton>
    </>
  );
};

export default JoinedDate;
