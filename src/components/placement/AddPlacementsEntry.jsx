/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import DateFnsUtils from "@mui/lab/AdapterDateFns";
import { Controller, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useSnackbar } from "notistack";

const AddPlacementsEntry = ({ studentId, studentName }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    employer: "",
    designation: "",
    location: "",
    salary: "",
    jobType: "selectjobtype",
    offerLetterDate: "",
    resume: "",
    videoLink: "",
    photoLink: "",
    writeUp: "",
  });

  const onSubmit = (data, e) => {
    console.log(data);
    setFormData({ ...formData, ...data });
  };

  const handleClose = () => setDialogOpen(false);

  const modes = [
    {
      value: "Internship",
      label: "Internship",
    },
    {
      value: "Full Time",
      label: "Full Time",
    },
  ];

  return (
    <Box>
      <Tooltip title="Add New Entry" placement="top">
        <IconButton onClick={() => setDialogOpen(true)}>
          <AddCircleIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
      <Dialog fullWidth open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Add New Job Entry for {studentName}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: "0.4rem" }}>
            <Grid item xs={12}>
              <Controller
                control={control}
                defaultValue={formData.employer || ""}
                name="employer"
                rules={{ required: true, maxLength: 40 }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="employer"
                    inputRef={ref}
                    label="Employer Name"
                    placeholder="Employer Name"
                    autoComplete="off"
                    type="text"
                    error={!!errors.employer}
                    helperText={
                      errors.employer
                        ? errors.employer.type === "maxLength"
                          ? "Length should be under 40 characters"
                          : "Enter Employer's Name"
                        : ""
                    }
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                defaultValue={formData.designation || ""}
                name="designation"
                rules={{ required: true, maxLength: 40 }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="designation"
                    inputRef={ref}
                    label="Job Designation"
                    placeholder="Job Designation"
                    autoComplete="off"
                    type="text"
                    error={!!errors.employer}
                    helperText={
                      errors.designation
                        ? errors.designation.type === "maxLength"
                          ? "Length should be under 40 characters"
                          : "Enter Job Designation"
                        : ""
                    }
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                defaultValue={formData.location || ""}
                name="location"
                rules={{ required: true, maxLength: 40 }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="location"
                    inputRef={ref}
                    label="Job Location"
                    placeholder="Job Location"
                    autoComplete="off"
                    type="text"
                    error={!!errors.employer}
                    helperText={
                      errors.location
                        ? errors.location.type === "maxLength"
                          ? "Length should be under 40 characters"
                          : "Enter Job Location"
                        : ""
                    }
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                defaultValue={formData.salary || ""}
                name="salary"
                rules={{ required: true, maxLength: 40 }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="salary"
                    inputRef={ref}
                    label="Job Salary/Stipend"
                    placeholder="Job Salary/Stipend"
                    autoComplete="off"
                    type="text"
                    error={!!errors.salary}
                    helperText={
                      errors.salary
                        ? errors.salary.type === "maxLength"
                          ? "Length should be under 40 characters"
                          : "Enter Job Salary/Stipend"
                        : ""
                    }
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (jobType) => jobType !== "selectjobtype",

                  // return true;
                }}
                name="jobType"
                defaultValue={formData.jobType}
                render={({ field: { ref, ...rest } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="jobType-label">Select Job Type</InputLabel>
                    <Select
                      label="Select Job Type"
                      error={!!errors.jobType}
                      id="jobType"
                      inputRef={ref}
                      placeholder="Select Job Type"
                      required
                      {...rest}
                    >
                      <MenuItem value="selectjobtype" disabled>
                        Select Job Type
                      </MenuItem>
                      {modes.map((el) => (
                        <MenuItem key={el.value} value={el.value}>
                          {el.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {errors.jobType ? (
                <Typography
                  style={{
                    paddingLeft: "0.8rem",
                    paddingTop: "0.4rem",
                    paddingBottom: "0.4rem",
                  }}
                  variant="caption"
                  color="error"
                >
                  Please specify Job Type
                </Typography>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="offerLetterDate"
                defaultValue={
                  formData.offerLetterDate ? formData.offerLetterDate : null
                }
                rules={{
                  required: true,
                }}
                render={({
                  field: { ref, ...rest },
                  fieldState: { isTouched },
                }) => (
                  <LocalizationProvider dateAdapter={DateFnsUtils}>
                    <DatePicker
                      disableFuture
                      id="offerLetterDate"
                      label="Date of Offer Letter"
                      required
                      inputRef={ref}
                      focused={isTouched}
                      inputFormat="dd/MM/yyyy"
                      inputVariant="outlined"
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          error={!!errors.offerLetterDate}
                          helperText={
                            errors.offerLetterDate ? "Enter Date of Birth" : ""
                          }
                        />
                      )}
                      fullWidth
                      placeholder="Date of Offer Letter"
                      error={!!errors.offerLetterDate}
                      {...rest}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                // defaultValue={formData.resume || ""}
                name="resume"
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <label id="resume-label">
                      <Typography variant="caption">Upload Resume</Typography>
                    </label>
                    <Input
                      inputProps={{ type: "file", accept: "image/*,.pdf" }}
                      id="resume"
                      fullWidth
                      inputRef={ref}
                      type="file"
                      style={
                        {
                          // display: "none",
                        }
                      }
                      error={!!errors.resume}
                      onChange={(e) => {
                        // LinkGenerator(e, 1);
                      }}
                      // helperText={
                      //   errors.resume ? "Enter Job Salary/Stipend" : ""
                      // }
                      {...rest}
                    />
                  </FormControl>
                )}
              />

              {/* <label htmlFor="resume-input">
                <Button variant="raised" component="span">
                  Upload
                </Button>
              </label> */}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                // defaultValue={formData.photoLink || ""}
                name="photoLink"
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <label id="photoLink-label">
                      <Typography variant="caption">Upload Photo</Typography>
                    </label>
                    <Input
                      inputProps={{ type: "file", accept: "image/*,.pdf" }}
                      id="photoLink"
                      fullWidth
                      inputRef={ref}
                      type="file"
                      style={
                        {
                          // display: "none",
                        }
                      }
                      error={!!errors.photoLink}
                      onChange={(e) => {
                        // LinkGenerator(e, 1);
                      }}
                      // helperText={
                      //   errors.photoLink ? "Enter Job Salary/Stipend" : ""
                      // }
                      {...rest}
                    />
                  </FormControl>
                )}
              />

              {/* <label htmlFor="resume-input">
                <Button variant="raised" component="span">
                  Upload
                </Button>
              </label> */}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                defaultValue={formData.videoLink || ""}
                name="videoLink"
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="videoLink"
                    inputRef={ref}
                    label="Video Link"
                    placeholder="Video Link"
                    autoComplete="off"
                    type="text"
                    error={!!errors.videoLink}
                    helperText={
                      errors.videoLink
                        ? errors.videoLink.type === "maxLength"
                          ? "Length should be under 40 characters"
                          : "Enter Video Link"
                        : ""
                    }
                    {...rest}
                  />
                )}
              />

              {/* <label htmlFor="resume-input">
                <Button variant="raised" component="span">
                  Upload
                </Button>
              </label> */}
            </Grid>
            {/* <Grid item xs={6}>
              <Controller
                control={control}
                // defaultValue={formData.photoLink || ""}
                name="photoLink"
                rules={{ required: true }}
                render={({ field: { ref, ...rest } }) => (
                  <FormControl variant="outlined" fullWidth>
                    <label id="photoLink-label">
                      <Typography variant="caption">Upload Photo</Typography>
                    </label>
                    <Input
                      inputProps={{ type: "file", accept: "image/*,.pdf" }}
                      id="photoLink"
                      fullWidth
                      inputRef={ref}
                      label="Job Salary/Stipend"
                      placeholder="Job Salary/Stipend"
                      type="file"
                      style={
                        {
                          // display: "none",
                        }
                      }
                      error={!!errors.photoLink}
                      onChange={(e) => {
                        // LinkGenerator(e, 1);
                      }}
                      helperText={
                        errors.photoLink ? "Enter Job Salary/Stipend" : ""
                      }
                      {...rest}
                    />
                  </FormControl>
                )}
              />

              <label htmlFor="resume-input">
                <Button variant="raised" component="span">
                  Upload
                </Button>
              </label>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Add New Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddPlacementsEntry;
