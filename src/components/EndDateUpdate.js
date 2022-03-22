import React from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Axios from "axios";
import { useSnackbar } from "notistack";
const baseURL = process.env.API_URL;
function EndDateUpdate(props) {
  console.log("hello");
  const [value, setValue] = React.useState(props.value);
  const rowData = props.rowData;
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
  } else {
    if (rowData.rowData[4]) {
      return (
        <>
          <p
            onClick={() => {
              setValue(Date.now());
            }}
          >
            Update Date
          </p>
        </>
      );
    } else {
      return null;
    }
  }
}

export default EndDateUpdate;
