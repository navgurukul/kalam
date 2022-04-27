import React from "react";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import axios from "axios";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

dayjs.extend(customParseFormat);

const baseURL = import.meta.env.VITE_API_URL;

const JoinedDate = (props) => {
  const { value } = props;
  const snackbar = useSnackbar();
  const [state, setState] = React.useState({
    currentDate: value,
    isShowDatePicker: false,
  });

  const changeDate = (date) => {
    const { transitionId } = props;
    const formateddate = dayjs(date).format("YYYY-MM-DD");
    axios
      .put(`${baseURL}students/transition/${transitionId}`, {
        when: formateddate,
      })
      .then(() => {
        snackbar.enqueueSnackbar(`Joining successfully updated !`, {
          variant: "success",
        });
      })
      .catch(() => {
        snackbar.enqueueSnackbar(`Something went wrong`, {
          variant: "unsuccess!",
        });
      });
    setState({
      currentDate: date,
      isShowDatePicker: !state.isShowDatePicker,
    });
  };

  const showDatePicker = () =>
    setState({ ...state, isShowDatePicker: !state.isShowDatePicker });

  const { currentDate, isShowDatePicker } = state;
  if (isShowDatePicker) {
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
    <div>
      <p style={{ marginRight: 10 }}>
        {dayjs(currentDate).format("D MMM YYYY")}
      </p>
      <EditIcon onClick={showDatePicker} style={{ cursor: "pointer" }} />
    </div>
  );
};

export default JoinedDate;
