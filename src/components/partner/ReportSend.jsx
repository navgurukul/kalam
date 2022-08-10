import React from "react";
import SendIcon from "@mui/icons-material/Send";
//mail icon from material icons
import MailIcon from "@mui/icons-material/Mail";
import {
  Button,
  IconButton,
  FormControl,
  FormHelperText,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  Icon,
  Chip,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { AddCircle, DeleteForeverRounded } from "@mui/icons-material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import Loader from "../ui/Loader";

const baseUrl = import.meta.env.VITE_API_URL;

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dates = [...Array(31)].map((el, inx) => inx + 1);
// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: "flex",
//     flexWrap: "wrap",
//     flexDirection: "column",
//     maxWidth: 400,
//   },
//   root: {
//     maxWidth: 450,
//     margin: "auto",
//     marginTop: "20px",
//   },

//   addIcon: {
//     position: "absolute",
//     marginLeft: "60%",
//     top: "9px",
//   },
//   text: {
//     marginBottom: theme.spacing(2),
//     color: "black",
//     fontSize: "15px",
//   },
//   btn: {
//     marginTop: theme.spacing(4),
//   },
// }));

const ReportSend = ({ partnerId }) => {
  // const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    emails: [""],
    repeat: "Daily",
    date: [],
    status: 1,
    report: "Outreach",
    emailreportId: null,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
  } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "emails" });

  const getRepeatValue = (interval, dateValues) => {
    if (interval === "Daily") {
      return interval;
    }

    return `${interval} ${
      ["Bi-Weekly", "Bi-Monthly"].includes(interval)
        ? dateValues.join(" ")
        : dateValues
    }`;
  };

  const handleDialogClose = () => setDialogOpen(false);

  const sendReport = (data) => {
    const { emails, repeat, date, status, report } = data;
    axios
      .post(`${baseUrl}partners/emailreport`, {
        partner_id: partnerId,
        emails: emails.map((email) => email.email),
        repeat: getRepeatValue(repeat, date),
        status: !!status,
        report,
      })
      .then(() => {
        enqueueSnackbar(`Report ready to share  ${repeat} bases`, {
          variant: "success",
        });
        handleDialogClose();
      });
  };

  const editSendReport = async (data) => {
    const { report, emailreportId, emails, repeat, date, status } = data;

    axios
      .put(`${baseUrl}partners/emailreport/${emailreportId}`, {
        partner_id: partnerId,
        emails: emails.map((email) => email.email),
        repeat: getRepeatValue(repeat, date),
        status: !!status,
        report,
      })
      .then(() => {
        enqueueSnackbar(`Report successfully updated`, {
          variant: "success",
        });
        handleDialogClose();
      });
  };

  const instantReportSend = () => {
    axios.get(`${baseUrl}emailreport/send/partner/${partnerId}`).then(() => {
      enqueueSnackbar(`Instant Report Sent!!!`, {
        variant: "success",
      });
    });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    axios.get(`${baseUrl}partners/emailreport/${partnerId}`).then((data) => {
      const resp = data.data.data[0];
      if (resp) {
        const splitRepeat = resp.repeat.split(" ");
        const dateData = splitRepeat.splice(1, splitRepeat.length);
        setFormData((prevState) => ({
          ...prevState,
          emails: resp.emails.map((email) => ({ email })),
          repeat: splitRepeat[0],
          date: dateData,
          status: resp.status ? 1 : 0,
          report: resp.report,
          emailreportId: resp.id,
        }));
        reset({
          emails: resp.emails.map((email) => ({ email })),
          repeat: splitRepeat[0],
          date: dateData,
          status: resp.status ? 1 : 0,
          report: resp.report,
          emailreportId: resp.id,
        });
        setLoading(false);
      }
    });
  };
  const repeat = watch("repeat");
  const date = watch("date");

  // const { emailreportId, repeat, emails, date } = state;
  const isWeekly = repeat?.indexOf("Weekly") > -1;
  return (
    <div>
      <IconButton onClick={handleDialogOpen}>
        <SendIcon />
      </IconButton>
      <IconButton onClick={instantReportSend}>
        <MailIcon
          style={{
            marginLeft: "10px",
          }}
        />
      </IconButton>
      <Dialog
        open={dialogOpen}
        style={{ overflow: "scroll" }}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Send Report To Partner</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <Loader container />
          ) : (
            <Grid container sx={{ mt: "0.2rem" }} spacing={2}>
              {fields.map((email, index) => (
                <React.Fragment key={email.id}>
                  <Grid item xs={9}>
                    <Controller
                      control={control}
                      defaultValue={formData.emails[index]?.email || ""}
                      name={`emails[${index}].email`}
                      rules={{
                        required: true,
                        pattern:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      }}
                      render={({ field: { ref, ...rest } }) => (
                        <TextField
                          variant="outlined"
                          fullWidth
                          id={`emails[${index}]`}
                          name={`emails[${index}]`}
                          inputRef={ref}
                          // className={classes.spacing}
                          label={`Partner Email ${index + 1}`}
                          placeholder={`Partner Email ${index + 1}`}
                          autoComplete="off"
                          type="email"
                          error={!!errors.emails && !!errors.emails[index]}
                          helperText={
                            errors.name
                              ? `Required Field`
                              : `Enter Partner Email ${index + 1}`
                          }
                          {...rest}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="large"
                      onClick={() => remove(index)}
                      style={{
                        // marginTop: "3vh",
                        borderSpacing: "-1",
                      }}
                    >
                      <DeleteForeverRounded />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12} sx={{ mY: "0.2rem" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => append()}
                >
                  <Icon
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "1vh",
                      // marginTop: "-1vh",
                    }}
                  >
                    <AddCircle />
                  </Icon>
                  Add Another District
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  name="repeat"
                  defaultValue={formData.repeat ?? "Select Timeline"}
                  render={({ field: { ref, ...rest } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="repeat-label">Select Timeline</InputLabel>
                      <Select
                        label="Select Timeline"
                        placeholder="Select Timeline"
                        error={!!errors.report}
                        id="repeat"
                        inputRef={ref}
                        required
                        {...rest}
                        onChange={(e) => {
                          const {
                            target: { value },
                          } = e;
                          setValue(
                            "date",
                            ["Bi-Weekly", "Bi-Monthly"].includes(value)
                              ? []
                              : ""
                          );
                          rest.onChange(e);
                        }}
                      >
                        {[
                          "Select Timeline",
                          "Daily",
                          "Weekly",
                          "Bi-Weekly",
                          "Monthly",
                          "Bi-Monthly",
                        ].map((el) => (
                          <MenuItem
                            key={el}
                            value={el}
                            disabled={el === "Select Timeline"}
                          >
                            {el}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.repeat ? (
                  <FormHelperText
                    style={{
                      paddingLeft: "0.8rem",
                      paddingTop: "0.4rem",
                      paddingBottom: "0.4rem",
                    }}
                    // variant="caption"
                    color="error"
                  >
                    Select Timeline
                  </FormHelperText>
                ) : (
                  ""
                )}
              </Grid>

              {repeat !== "Daily" && (
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    name="date"
                    defaultValue={formData.date ?? ""}
                    render={({ field: { ref, ...rest } }) => (
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="repeat-label">
                          Select {isWeekly ? "Day" : "Date"}
                        </InputLabel>
                        <Select
                          label={`Select ${isWeekly ? "Day" : "Date"}`}
                          placeholder={`Select ${isWeekly ? "Day" : "Date"}`}
                          error={!!errors.date}
                          id="date"
                          multiple={["Bi-Weekly", "Bi-Monthly"].includes(
                            repeat
                          )}
                          // multiple
                          inputRef={ref}
                          required
                          renderValue={(selected) =>
                            ["Bi-Weekly", "Bi-Monthly"].includes(repeat) ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    onMouseDown={(event) => {
                                      event.stopPropagation();
                                    }}
                                    key={value}
                                    label={value}
                                    onDelete={() => {
                                      setValue(
                                        "date",
                                        date.filter((day) => day !== value)
                                      );
                                    }}
                                  />
                                ))}
                              </Box>
                            ) : (
                              selected
                            )
                          }
                          {...rest}
                        >
                          <MenuItem value="" disabled>
                            Select {isWeekly ? "Day" : "Date"}
                          </MenuItem>
                          {(isWeekly ? weekDays : dates).map((el) => (
                            <MenuItem
                              key={el}
                              value={el}
                              disabled={el === "Select Timeline"}
                            >
                              {["Bi-Weekly", "Bi-Monthly"].includes(repeat) && (
                                <Checkbox
                                  size="small"
                                  checked={date.includes(el)}
                                />
                              )}
                              {el}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors.date ? (
                    <FormHelperText
                      style={{
                        paddingLeft: "0.8rem",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                      }}
                      // variant="caption"
                      color="error"
                    >
                      Select {isWeekly ? "Day" : "Date"}
                    </FormHelperText>
                  ) : (
                    ""
                  )}
                </Grid>
              )}

              <Grid item xs={12}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  name="status"
                  defaultValue={formData.status ?? 1}
                  render={({ field: { ref, ...rest } }) => (
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="repeat-label">Select Status</InputLabel>
                      <Select
                        label="Select Status"
                        placeholder="Select Status"
                        error={!!errors.status}
                        id="status"
                        inputRef={ref}
                        required
                        {...rest}
                      >
                        {[
                          { value: "Select Status", label: "Select Status" },
                          { value: 1, label: "Yes" },
                          { value: 0, label: "No" },
                        ].map(({ value, label }) => (
                          <MenuItem
                            key={value}
                            value={value}
                            disabled={value === "Select Status"}
                          >
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <FormHelperText
                  style={{
                    paddingLeft: "0.8rem",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                  }}
                  // variant="caption"
                  // color="error"
                >
                  Do you want to share report ?
                </FormHelperText>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSubmit(
              formData.emailreportId ? editSendReport : sendReport
            )}
          >
            {formData.emailreportId ? "Edit Send Report" : "Send Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ReportSend;
