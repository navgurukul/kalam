import {
  Box,
  Button,
  IconButton,
  Modal,
  Card,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDatFns from "@mui/lab/AdapterDateFns";
import axios from "axios";
import { useSnackbar } from "notistack";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

const baseUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    margin: "auto",
    marginTop: "20px",
    padding: "0.4rem 0.8rem",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.4rem 1.2rem",
  },
  timePicker: {
    padding: "0.2rem 0.4rem",
  },
  addIcon: {
    position: "absolute",
    marginLeft: "60%",
    top: "9px",
  },
  text: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  btn: {
    marginTop: theme.spacing(2),
  },
}));

const AddOwnerSchedule = ({
  isEdit,
  disabled,
  prevSchedule,
  ownerId,
  updateData,
}) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [schedule, setSchedule] = useState({
    from: isEdit
      ? dayjs(prevSchedule.from, "HH:mm").toDate().getTime()
      : dayjs("08:00", "HH:mm").toDate().getTime(),
    to: isEdit
      ? dayjs(prevSchedule.to, "HH:mm").toDate().getTime()
      : dayjs("16:00", "HH:mm").toDate().getTime(),
  });
  const [modalOpen, setModelOpen] = useState(false);

  const handleTimeChange = (id, time) => {
    setSchedule({
      ...schedule,
      [id]: dayjs(time, "hh:mm a").toDate().getTime(),
    });
  };

  const addSchedule = () => {
    const { from, to } = schedule;
    const diff = parseInt(dayjs(to).diff(dayjs(from), "hour"), 10);
    if (diff < 0) {
      snackbar.enqueueSnackbar("Start Time should be before End Time", {
        variant: "error",
      });
    } else if (diff < 1) {
      snackbar.enqueueSnackbar("Please select at least 1hr long schedule", {
        variant: "error",
      });
    }
    const Url = `${baseUrl}ownershedule`;
    const fromStr = dayjs(from).format("HH:mm");
    const toStr = dayjs(to).format("HH:mm");
    if (isEdit) {
      axios
        .put(`${Url}/${ownerId}`, {
          from: fromStr,
          to: toStr,
        })
        .then((res) => {
          const { data } = res.data;
          if (data.error) {
            snackbar.enqueueSnackbar("Schedule Already Exists", {
              variant: "error",
            });
            return;
          }
          snackbar.enqueueSnackbar("Schedule Added!", { variant: "success" });
          updateData();
          setModelOpen(false);
        })
        .catch((err) => {
          snackbar.enqueueSnackbar(`ERROR : ${err.message}`, {
            variant: "error",
          });
        });
    } else {
      axios
        .post(Url, {
          owner_id: ownerId,
          from: fromStr,
          to: toStr,
        })
        .then((res) => {
          const { data } = res.data;
          if (data.error) {
            snackbar.enqueueSnackbar("Schedule Already Exists", {
              variant: "error",
            });
            return;
          }
          snackbar.enqueueSnackbar("Schedule Added!", { variant: "success" });
          updateData();
          setModelOpen(false);
        })
        .catch((err) => {
          snackbar.enqueueSnackbar(`ERROR : ${err.message}`, {
            variant: "error",
          });
        });
    }
  };

  const deleteSchedule = () => {
    const toDelete = window.confirm("Are you sure?");
    if (!toDelete) return;
    const Url = `${baseUrl}ownershedule/${ownerId}`;
    axios.delete(Url).then((res) => {
      if (res.data.data === 1) {
        snackbar.enqueueSnackbar("Deleted Successfully!", {
          variant: "success",
        });
        updateData();
      }
    });
  };
  //console.log(ownerId,isEdit);
  return (
    <div>
      {isEdit ? (
        <Box>
          {dayjs(schedule.from).format("hh:mm A")} -{" "}
          {dayjs(schedule.to).format("hh:mm A")}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0.4rem",
              gap: "4px",
            }}
          >
            <IconButton
              color="primary"
              size="small"
              disabled={disabled}
              onClick={() => setModelOpen(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="primary"
              size="small"
              disabled={disabled}
              onClick={() => deleteSchedule()}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </Box>
      ) : (
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          onClick={() => setModelOpen(true)}
          className={classes.btn}
        >
          Set Schedule
        </Button>
      )}
      <Modal open={modalOpen} onClose={() => setModelOpen(false)}>
        <Card className={classes.root}>
          <Typography className={classes.text} variant="h5">
            Select Schedule Timings
          </Typography>
          <form className={classes.container}>
            <LocalizationProvider dateAdapter={AdapterDatFns}>
              <TimePicker
                margin="dense"
                value={schedule.from}
                id="from"
                label="From"
                fullWidth
                onChange={(_, time) => handleTimeChange("from", time)}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDatFns}>
              <TimePicker
                margin="dense"
                value={schedule.to}
                id="to"
                label="To"
                fullWidth
                onChange={(_, time) => handleTimeChange("to", time)}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addSchedule()}
              className={classes.btn}
            >
              {isEdit ? "Update" : "Confirm"} Schedule
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModelOpen(false)}
              className={classes.btn}
            >
              Cancel
            </Button>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default AddOwnerSchedule;
