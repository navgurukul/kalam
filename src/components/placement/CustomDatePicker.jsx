import React from "react";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import dayjs from "dayjs";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";

const baseUrl = import.meta.env.VITE_API_URL;

const CustomDatePicker = ({ offerLetterDate, id, studentId, change }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isPickerVisible, setPickerVisible] = React.useState(false);

  const updateDate = (newValue) => {
    if (dayjs(newValue).diff(offerLetterDate, "date") === 0) return;
    axios
      .put(`${baseUrl}students/jobDetails/${id}`, {
        offer_letter_date: newValue,
        student_id: studentId,
      })
      .then(() => {
        enqueueSnackbar(`${name} successfully updated !`, {
          variant: "success",
        });
        change({ offer_letter_date: newValue });
        setPickerVisible(false);
      })
      .catch(() => {
        enqueueSnackbar(`Error in updating ${name}`, {
          variant: "error",
        });
      });
  };

  return (
    <Box sx={{ minWidth: "10rem" }}>
      {isPickerVisible ? (
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DatePicker
            disableFuture
            // margin="normal"
            id="offer_letter_date"
            label="Date of Offer Letter"
            value={offerLetterDate}
            onChange={updateDate}
            inputFormat="dd/MM/yyyy"
            inputVariant="outlined"
            renderInput={(params) => <TextField fullWidth {...params} />}
            fullWidth
            placeholder="Date of Offer Letter"
          />
        </LocalizationProvider>
      ) : (
        <Button
          variant="text"
          size="small"
          color="inherit"
          onClick={() => setPickerVisible(true)}
        >
          {dayjs(offerLetterDate).isValid()
            ? dayjs(offerLetterDate).format("D MMM YYYY")
            : "Click to Add"}
        </Button>
      )}
    </Box>
  );
};

export default CustomDatePicker;
