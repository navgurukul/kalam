import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { state } from "./Constant";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  text: {
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
}));

function KuchAurDetails() {
  const classes = useStyles();

  const [values, setValues] = useState({
    pin_code: "",
    state: "Select State",
    city: "",
    current_status: "",
    qualification: "",
    school_medium: "",
    caste: "",
    religon: "",
    math_marks_in10th: "",
    percentage_in10th: "",
    math_marks_in12th: "",
    percentage_in12th: "",
  });

  console.log("state", state);

  const changeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log("Values", values);
  };

  const submitHandler = () => {
    console.log("Values", values);
  };

  console.log("values.qualification", values.qualification);

  return (
    <Container maxWidth="lg" align="center" className={classes.container}>
      <div className={classes.root}>
        <Paper
          square
          elevation={0}
          className={classes.textField}
          align="center"
        >
          <Typography variant="h4" className={classes.text}>
            Aapki Kuch Details
          </Typography>
        </Paper>
        <Paper square elevation={0} className={classes.textField} align="left">
          <TextField
            variant="outlined"
            required
            fullWidth
            // id="pin_code"
            className={classes.spacing}
            label="Pin Code"
            placeholder="Pin Code"
            value={values.pin_code}
            name="pin_code"
            autoComplete="off"
            onChange={changeHandler}
          />
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Aap kis State me rehte hai
            </InputLabel>
            <Select
              value={values.state}
              onChange={changeHandler}
              label="Aap kis State me rehte hai"
              name="state"
            >
              <MenuItem value={"Select State"}>Select State</MenuItem>
              {/* <MenuItem value={"Hindi"}>Hindi</MenuItem>
              <MenuItem value={"English"}>English</MenuItem> */}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Aapki City/Village ka naam
            </InputLabel>
            <Select
              value={values.city}
              onChange={changeHandler}
              label="Aapki City/Village ka naam"
              name="city"
            >
              <MenuItem value={"Other"}>Other</MenuItem>
              {/* <MenuItem value={"Hindi"}>Hindi</MenuItem>
              <MenuItem value={"English"}>English</MenuItem> */}
            </Select>
          </FormControl>
          {/* </Paper> */}
          <TextField
            variant="outlined"
            required
            fullWidth
            // id="city"
            className={classes.spacing}
            label="Aapki City/Village ka Naam (agar upar list me nahi)"
            placeholder="Aapki City/Village ka Naam (agar upar list me nahi)"
            value={values.city}
            name="city"
            autoComplete="off"
            onChange={changeHandler}
          />
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Current status
            </InputLabel>
            <Select
              value={values.current_status}
              onChange={changeHandler}
              label="Current status"
              name="current_status"
            >
              <MenuItem value={"Select Option"}>Select Option</MenuItem>
              <MenuItem value={"Nothing"}>Nothing</MenuItem>
              <MenuItem value={"Job"}>Job</MenuItem>
              <MenuItem value={"Study"}>Study</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Maximum Qualification
            </InputLabel>
            <Select
              value={values.qualification}
              onChange={changeHandler}
              label="Maximum Qualification"
              name="qualification"
            >
              <MenuItem value={"Select Option"}>Select Option</MenuItem>
              <MenuItem value={"Less than 10th pass"}>
                Less than 10th pass
              </MenuItem>
              <MenuItem value={"10th pass"}>10th pass</MenuItem>
              <MenuItem value={"12th pass"}>12th pass</MenuItem>
              <MenuItem value={"Graduated"}>Graduated</MenuItem>
            </Select>
          </FormControl>
          {values.qualification === "10th pass" ? (
            <>
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Marks in Maths in 10th class"
                placeholder="Marks in Maths in 10th class"
                value={values.math_marks_in10th}
                name="math_marks_in10th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Percentage in 10th class"
                placeholder="Percentage in 10th class"
                value={values.percentage_in10th}
                name="percentage_in10th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
            </>
          ) : null}
          {values.qualification === "12th pass" ||
          values.qualification === "Graduated" ? (
            <>
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Marks in Maths in 10th class"
                placeholder="Marks in Maths in 10th class"
                value={values.math_marks_in10th}
                name="math_marks_in10th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Percentage in 10th class"
                placeholder="Percentage in 10th class"
                value={values.percentage_in10th}
                name="percentage_in10th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Marks in Maths in 12th class"
                placeholder="Marks in Maths in 12th class"
                value={values.math_marks_in12th}
                name="math_marks_in12th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                // id="city"
                className={classes.spacing}
                label="Percentage in 12th class"
                placeholder="Percentage in 12th class"
                value={values.percentage_in12th}
                name="percentage_in12th"
                type="number"
                autoComplete="off"
                onChange={changeHandler}
              />
            </>
          ) : null}
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              School Medium
            </InputLabel>
            <Select
              value={values.school_medium}
              onChange={changeHandler}
              label="School Medium"
              name="school_medium"
            >
              <MenuItem value={"Select Option"}>Select Option</MenuItem>
              <MenuItem value={"Hindi"}>Hindi</MenuItem>
              <MenuItem value={"English"}>English</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Caste/Tribe
            </InputLabel>
            <Select
              value={values.cast}
              onChange={changeHandler}
              label="Caste/Tribe"
              name="cast"
            >
              <MenuItem value={"Select Option"}>Select Option</MenuItem>
              <MenuItem value={"(SC) Scheduled Caste / (ST) Scheduled Tribe"}>
                (SC) Scheduled Caste / (ST) Scheduled Tribe
              </MenuItem>
              <MenuItem value={"(OBC) Other Backward Classes"}>
                (OBC) Other Backward Classes
              </MenuItem>
              <MenuItem value={"General"}>General</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" className={classes.spacing}>
            <InputLabel id="demo-simple-select-outlined-label">
              Religion/dharam
            </InputLabel>
            <Select
              value={values.religion}
              onChange={changeHandler}
              label="Religion/dharam"
              name="religion"
            >
              <MenuItem value={"Select Option"}>Select Option</MenuItem>
              <MenuItem value={"Hindu"}>Hindu</MenuItem>
              <MenuItem value={"Islam"}>Islam</MenuItem>
              <MenuItem value={"Sikh"}>Sikh</MenuItem>
              <MenuItem value={"Christian"}>Christian</MenuItem>
              <MenuItem value={"Jain"}>Jain</MenuItem>
              <MenuItem value={"Others"}>Others</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          // className={classes.submit}
          onClick={submitHandler}
        >
          submit
        </Button>
      </div>
    </Container>
  );
}

export default KuchAurDetails;
