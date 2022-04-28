import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Axios from "axios";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";

const baseURL = import.meta.env.VITE_API_URL;
function DeadLineDateUpdate(props) {
  const { value: pValue } = props;
  const [value, setValue] = useState(pValue);
  const { rowData } = props;
  const [dateToSend, setDateToSend] = React.useState(value);
  const snackBar = useSnackbar();
  if (value) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          margin="dense"
          style={{ marginLeft: 16 }}
          value={dateToSend}
          id="date-picker-dialog"
          label="Joining Date"
          format="dd/MM/yyyy"
          onChange={(date) => {
            Axios.put(
              `${baseURL}students/updateDeadlineOrFinishedAt/${rowData.rowData[10]}`,
              {
                deadline_at: date,
              }
            ).then((res) => {
              if (res.data) {
                snackBar.enqueueSnackbar("Deadline Updated", {
                  variant: "success",
                });
                setDateToSend(date);
              }
            });
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    );
  }
  if (rowData.rowData[4]) {
    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <p
        onKeyUp={(e) => {
          if (e.key === "Enter") setValue(Date.now());
        }}
        onClick={() => {
          setValue(Date.now());
        }}
      >
        Update Date
      </p>
    );
  }
  return null;
}

export default DeadLineDateUpdate;
