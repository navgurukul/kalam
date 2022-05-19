import "date-fns";
import React from "react";
import Grid from "@mui/material/Grid";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/lab";

export default function MaterialUIPickers(props) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const { forDate, lang, filledDate } = props;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    forDate(date);
  };
  // console.log("dob", selectedDate)

  return (
    <LocalizationProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker
          margin="normal"
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          inputVariant="outlined"
          fullWidth
          label={lang === "en" ? "Your dob" : "आपका जन्मदिन"}
          placeholder={lang === "en" ? "Your dob" : "आपका जन्मदिन"}
          value={filledDate || selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
    </LocalizationProvider>
  );
}
