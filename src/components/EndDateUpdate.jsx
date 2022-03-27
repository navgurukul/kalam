/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@mui/lab/DatePicker";
import DateFnsUtils from "@date-io/date-fns";
import Axios from "axios";
import { useSnackbar } from "notistack";

const baseURL = process.env.API_URL;
function EndDateUpdate(props) {
  console.log("hello");
  const [value, setValue] = React.useState(props.value);
  const { rowData } = props;
  const [dateToSend, setDateToSend] = React.useState(value);
  const snackBar = useSnackbar();
  if (value) {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
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
                finished_at: date,
              }
            ).then((res) => {
              if (res.data) {
                snackBar.enqueueSnackbar("End Date Updated", {
                  variant: "success",
                });
                setDateToSend(date);
              }
            });
          }}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }
  if (rowData.rowData[4]) {
    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <p
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

export default EndDateUpdate;
