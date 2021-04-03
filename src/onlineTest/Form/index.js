import React, { useState } from 'react'
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Date from './Date'
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
  },
  text: {
    paddingBottom: theme.spacing(3),
  },
  date: {
    maxWidth: 400,
    paddingTop: theme.spacing(-2),
    paddingBottom: theme.spacing(1),
  }
}));

function Form() {
    const classes = useStyles();

    const [values, setValues] = useState({
        studetName: "",
        studentNumber: "",
        gender: ""
    })   
    
    const changeHandler = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    return (
            <Container maxWidth="lg" align='center'>
                <div className={classes.root}>
                <Typography variant="h4" className={classes.text}>Aapki Kuch Details</Typography>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        // id="studetName"
                        className={classes.spacing}
                        label="Your name"
                        placeholder="Your Name"
                        value={values.studetName}
                        name="studetName"
                        autoComplete="off"
                        onChange={changeHandler}
                        />
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        // id="studentNumber"
                        className={classes.spacing}
                        label="Your Whatsapp Number"
                        placeholder="Your Whatsapp Number"
                        value={values.studentNumber}
                        name="studentNumber"
                        autoComplete="off"
                        onChange={changeHandler}
                        />
                    <div className={classes.date}>
                    <Date />
                    </div>
                    <FormControl fullWidth variant="outlined" align='left' className={classes.spacing}> 
                        <InputLabel id="demo-simple-select-outlined-label">
                            Select Gender
                        </InputLabel>
                        <Select
                            value={values.gender}
                            onChange={changeHandler}
                            label="Select Gender"
                            name="gender"
                        >
                            <MenuItem value={"selectGender"}>Select Gender</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        // onClick={submitHandler}
                    >
                        Test shuru karein
                    </Button>
                </div>
            </Container>
    )
}

export default Form
